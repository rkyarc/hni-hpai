import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PayButton from "@/components/pay-button";

const prisma = new PrismaClient();

export default async function OrdersPage() {
  // 1. Pastikan user sudah login
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Ambil data pesanan (Order) dari yang terbaru
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: true, // Ambil daftar barang di dalam pesanan
      address: true, // Ambil alamat pengiriman
      payment: true,
    },
    orderBy: { createdAt: "desc" }, // Urutkan dari yang paling baru
  });

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Riwayat Pesanan 📦</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
          <p className="text-gray-500 mb-4">Anda belum memiliki pesanan.</p>
          <Link href="/">
            <Button>Mulai Belanja</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <CardTitle className="text-lg">Order ID: {order.id}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Tanggal: {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  {/* Status Pesanan */}
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                    {order.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Daftar Barang (Menggunakan Data Snapshot!) */}
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Barang yang dibeli:</h3>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium bg-gray-100 px-2 py-1 rounded text-xs">{item.quantity}x</span>
                          <span>{item.snapshotName} ({item.snapshotVariant})</span>
                        </div>
                        <span className="font-medium">Rp {item.subtotal.toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Info Pengiriman & Total */}
                  <div className="bg-gray-50 p-4 rounded-md text-sm space-y-3 border">
                    <div>
                      <span className="font-semibold block text-gray-700">Dikirim ke:</span>
                      <p className="text-gray-600">{order.address.recipient}</p>
                      <p className="text-gray-500 text-xs">{order.address.street}</p>
                    </div>
                    <div className="pt-3 border-t">
                      <span className="font-semibold block text-gray-700">Total Belanja:</span>
                      <p className="text-lg font-bold text-blue-600">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </p>
                      {order.status === "PENDING_PAYMENT" && order.payment?.snapToken && (
                        <PayButton snapToken={order.payment.snapToken} />
                      )}
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}