"use server" 

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { signIn, signOut, auth } from "../auth"
import { AuthError } from "next-auth"
import { revalidatePath } from "next/cache"

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