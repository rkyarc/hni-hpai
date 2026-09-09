import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
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

  // ✅ Logika Database Asli (TIDAK DISENTUH)
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
    <div className="min-h-screen bg-gray-50 pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Keranjang */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Isi Keranjang Kuning 🛒</h1>
          <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-1 rounded-full">
            {cartItems.length} Item
          </span>
        </div>
        
        {cartItems.length === 0 ? (
          /* Tampilan Jika Kosong */
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center transition-all">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🛍️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Anda masih kosong</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Yuk, temukan produk herbal terbaik untuk melengkapi kebutuhan kesehatan Anda hari ini.
            </p>
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 font-semibold text-lg shadow-md transition-all">
                Mulai Belanja
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 📦 KOLOM KIRI: Daftar Barang */}
            <div className="lg:w-2/3 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-md transition-shadow">
                  
                  {/* Thumbnail Gambar Produk */}
                  <div className="h-24 w-24 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100 p-2 relative overflow-hidden">
                    <img
                      src={`https://placehold.co/150x150/f3f4f6/10b981?text=${item.variant.product.name.replace(/ /g, '+')}`}
                      alt={item.variant.product.name}
                      className="object-contain h-full w-full mix-blend-multiply"
                    />
                  </div>

                  {/* Detail Produk */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.variant.product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">Varian: {item.variant.name}</p>
                    <p className="text-emerald-600 font-bold text-lg">
                      Rp {item.variant.price?.toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Qty & Subtotal */}
                  <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Qty</span>
                      <span className="font-bold text-gray-900">{item.quantity}</span>
                    </div>
                    <p className="font-bold text-gray-900 text-right w-full">
                      <span className="text-xs text-gray-400 font-normal mr-2">Subtotal:</span>
                      Rp {((item.quantity * (item.variant.price || 0))).toLocaleString('id-ID')}
                    </p>
                  </div>

                </div>
              ))}
            </div>
            
            {/* 🧾 KOLOM KANAN: Ringkasan Checkout (Sticky) */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                
                {/* Header Ringkasan dengan aksen kuning agar selaras dengan nama "Keranjang Kuning" */}
                <div className="bg-yellow-50 p-6 border-b border-yellow-100">
                  <h2 className="text-xl font-bold text-gray-900">Ringkasan Belanja</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Harga ({cartItems.length} barang)</span>
                    <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Biaya Layanan</span>
                    <span className="text-emerald-600 font-medium">Gratis</span>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-gray-900 text-lg">Total Tagihan</span>
                      <span className="font-black text-2xl text-emerald-600">
                        Rp {totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    
                    {/* ✅ Komponen CheckoutButton Asli */}
                    <div className="w-full">
                      <CheckoutButton />
                    </div>
                    
                    <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                      Transaksi Aman & Terenkripsi
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}