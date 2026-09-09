import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
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
      items: true,
      address: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Riwayat Pesanan</h1>
          <span className="text-3xl">📦</span>
        </div>

        {orders.length === 0 ? (
          /* Tampilan Jika Kosong */
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Pesanan</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Anda belum pernah melakukan pemesanan. Yuk, temukan produk kesehatan favorit Anda sekarang.
            </p>
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 font-semibold text-lg shadow-md transition-all">
                Mulai Belanja
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              // Logika warna status
              const isPaid = order.status === "PAID";
              const isPending = order.status === "PENDING_PAYMENT";
              
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  
                  {/* Card Header (Nomor Order & Status) */}
                  <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ID Pesanan</p>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-gray-900">...{order.id.slice(-8)}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Badge Status Dinamis */}
                    <span className={`px-4 py-1.5 text-xs font-bold rounded-full border ${
                      isPaid 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : isPending 
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}>
                      {order.status === "PAID" ? "✅ LUNAS" : order.status === "PENDING_PAYMENT" ? "⏳ MENUNGGU PEMBAYARAN" : order.status}
                    </span>
                  </div>

                  {/* Card Content (Barang & Total) */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      
                      {/* Bagian Kiri: Daftar Barang */}
                      <div className="flex-1 space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center group">
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-100 p-1">
                                <img
                                  src={`https://placehold.co/100x100/f3f4f6/10b981?text=${item.snapshotName.replace(/ /g, '+')}`}
                                  alt={item.snapshotName}
                                  className="object-contain h-full w-full mix-blend-multiply"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{item.snapshotName}</h4>
                                <p className="text-xs text-gray-500 mb-1">Varian: {item.snapshotVariant}</p>
                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                                  {item.quantity}x
                                </span>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900 whitespace-nowrap">
                              Rp {item.subtotal.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Garis Pemisah Mobile */}
                      <div className="hidden md:block w-px bg-gray-100"></div>
                      <div className="block md:hidden h-px w-full bg-gray-100"></div>

                      {/* Bagian Kanan: Info Pengiriman & Aksi */}
                      <div className="md:w-64 flex flex-col justify-between space-y-6">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dikirim ke:</p>
                          <p className="font-medium text-gray-900">{order.address.recipient}</p>
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{order.address.street}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Belanja</p>
                          <p className="text-xl font-black text-emerald-600 mb-4">
                            Rp {order.totalAmount.toLocaleString("id-ID")}
                          </p>
                          
                          {/* Tombol Lanjutkan Pembayaran (Jika belum bayar) */}
                          {isPending && order.payment?.snapToken && (
                            <div className="w-full mt-2">
                              <PayButton snapToken={order.payment.snapToken} />
                            </div>
                          )}
                          
                          {isPaid && (
                            <Button disabled className="w-full bg-gray-200 text-gray-500 rounded-lg">
                              Pembayaran Selesai
                            </Button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}