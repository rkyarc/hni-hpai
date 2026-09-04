import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import CheckoutButton from "@/components/checkout-button";

const prisma = new PrismaClient();

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true, 
            }
          }
        },
        orderBy: { id: 'asc' } 
      }
    }
  });

  const cartItems = cart?.items || [];
  
  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.quantity * (item.variant.price || 0));
  }, 0);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Isi Keranjang Kuning 🛒</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
          <p className="text-gray-500 mb-4">Keranjang Anda masih kosong.</p>
          <Link href="/">
            <Button>Mulai Belanja</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Daftar Barang */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{item.variant.product.name}</h3>
                    <p className="text-sm text-gray-500">Varian: {item.variant.name}</p>
                    <p className="text-blue-600 font-medium">
                      Rp {item.variant.price?.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-md">
                    <span className="font-semibold text-sm">Qty: {item.quantity}</span>
                    <p className="font-bold">
                      Rp {((item.quantity * (item.variant.price || 0))).toLocaleString('id-ID')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Ringkasan Checkout */}
          <div>
            <Card className="sticky top-24 shadow-md border-yellow-200">
              <CardHeader className="bg-yellow-50 border-b border-yellow-100">
                <CardTitle>Ringkasan Belanja</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <CheckoutButton />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}