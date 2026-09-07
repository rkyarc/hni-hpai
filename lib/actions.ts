"use server" 

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { signIn, signOut, auth } from "../auth"
import { AuthError } from "next-auth"
import { revalidatePath } from "next/cache"
import { snap } from "./midtrans";
import { redirect } from "next/navigation";

const prisma = new PrismaClient()

export async function register(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    return { error: "Semua field harus diisi!" }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "Email sudah terdaftar!" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CUSTOMER"
      }
    })

    return { success: "Akun berhasil dibuat! Silakan login." }
  } catch (error) {
    return { error: "Terjadi kesalahan pada server." }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email dan password harus diisi!" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/" 
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah!" }
        default:
          return { error: "Gagal login, silakan coba lagi." }
      }
    }
    
    throw error 
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" })
}

export async function addToCart(variantId: string) {
  const session = await auth()
  if (!session?.user) {
    return { error: "Silakan login terlebih dahulu untuk berbelanja." }
  }

  const userId = session.user.id

  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: userId }
      })
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId: variantId
      }
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 }
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: variantId,
          quantity: 1
        }
      })
    }

    revalidatePath("/")
    return { success: "Berhasil dimasukkan ke keranjang kuning!" }
    
  } catch (error) {
    console.error("Cart error:", error)
    return { error: "Gagal menambahkan produk ke keranjang." }
  }
}

export async function checkout() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Silakan login terlebih dahulu." };
  }

  const userId = session.user.id;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { error: "Keranjang Anda masih kosong!" };
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.quantity * (item.variant.price || 0);
    }, 0);

    let address = await prisma.address.findFirst({ where: { userId } });
    if (!address) {
      address = await prisma.address.create({
        data: {
          userId: userId,
          title: "Rumah",
          recipient: session.user.name || "Customer",
          phone: "-",
          street: "Alamat belum diatur",
          city: "-",
          province: "-",
          postalCode: "-",
        },
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          addressId: address.id,
          totalAmount: totalAmount,
        },
      });

      const orderItems = cart.items.map((item) => ({
        orderId: newOrder.id,
        variantId: item.variantId,
        snapshotName: item.variant.product.name,
        snapshotVariant: item.variant.name,
        snapshotPrice: item.variant.price,
        quantity: item.quantity,
        subtotal: item.quantity * item.variant.price,
      }));

      await tx.orderItem.createMany({ data: orderItems });
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: totalAmount,
      },
      customer_details: {
        first_name: session.user.name || "Customer",
        email: session.user.email || "",
      },
    };

    const snapToken = await snap.createTransactionToken(parameter);

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        snapToken: snapToken,
        status: "PENDING",
      },
    });

    revalidatePath("/cart");
    return { success: "Pesanan berhasil dibuat! Segera lakukan pembayaran." };
  } catch (error) {
    console.error("Checkout error:", error);
    return { error: "Terjadi kesalahan saat memproses pesanan dan pembayaran." };
  }
}

export async function updatePaymentSuccess(snapToken: string) {
  try {
    const payment = await prisma.payment.findFirst({
      where: { snapToken: snapToken }
    })

    if (!payment) return { error: "Data pembayaran tidak ditemukan." }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID" }
      })

      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: "PAID" }
      })
    })

    revalidatePath("/orders")
    return { success: "Status pesanan berhasil diperbarui menjadi LUNAS!" }
    
  } catch (error) {
    console.error("Update payment error:", error)
    return { error: "Gagal memperbarui status pesanan di database." }
  }
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const weight = parseInt(formData.get("weight") as string);

  if (!name || !price || !stock) {
    console.error("Data tidak lengkap!");
    return; 
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

  try {
    await prisma.product.create({
      data: {
        name: name,
        slug: slug,
        description: description,
        isActive: true,
        category: {
          connectOrCreate: {
            where: { slug: "herba" },
            create: { name: "Herba", slug: "herba" }
          }
        },
        variants: {
          create: [
            {
              name: "Default",
              sku: "SKU-" + Date.now(),
              price: price,
              stock: stock,
              weight: weight || 1000,
            }
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return; 
  }

  revalidatePath("/admin/products");
  revalidatePath("/"); 
  redirect("/admin/products");
}