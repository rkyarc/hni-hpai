import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  // ✅ Logika Database Asli (TIDAK DISENTUH)
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const paidOrders = await prisma.order.findMany({
    where: { status: "PAID" },
    select: { totalAmount: true },
  });
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      
      {/* Header Dashboard */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Utama</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Selamat datang di Panel Kendali HNI-Store. Pantau performa bisnis dan kelola toko Anda hari ini.
        </p>
      </div>
      
      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Pendapatan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Pendapatan</h3>
            <p className="text-2xl font-black text-emerald-600">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Card 2: Pesanan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pesanan Masuk</h3>
            <p className="text-2xl font-black text-gray-900">
              {totalOrders} <span className="text-sm font-medium text-gray-500">Transaksi</span>
            </p>
          </div>
        </div>

        {/* Card 3: Produk */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Katalog Produk</h3>
            <p className="text-2xl font-black text-gray-900">
              {totalProducts} <span className="text-sm font-medium text-gray-500">Aktif</span>
            </p>
          </div>
        </div>

      </div>

      {/* Area Aksi Cepat (Quick Actions) */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>⚡</span> Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/products/new" className="flex flex-col items-center justify-center p-6 bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-600 hover:text-white transition-colors group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</span>
            <span className="font-semibold text-sm">Tambah Produk</span>
          </Link>
          <Link href="/admin/products" className="flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-800 hover:text-white transition-colors group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📦</span>
            <span className="font-semibold text-sm">Kelola Katalog</span>
          </Link>
          <Link href="/admin/orders" className="flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-800 hover:text-white transition-colors group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🧾</span>
            <span className="font-semibold text-sm">Cek Pesanan</span>
          </Link>
          <Link href="/" target="_blank" className="flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-800 hover:text-white transition-colors group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏪</span>
            <span className="font-semibold text-sm">Lihat Toko</span>
          </Link>
        </div>
      </div>

    </div>
  );
}