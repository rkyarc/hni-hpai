import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count();

  const totalOrders = await prisma.order.count();

  const paidOrders = await prisma.order.findMany({
    where: { status: "PAID" },
    select: { totalAmount: true },
  });
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard Ringkasan</h1>
      <p className="text-gray-600 mb-8">
        Selamat datang di Panel Kendali HNI-Store. Pilih menu di samping untuk mengelola toko Anda.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium">Total Pendapatan (Lunas)</h3>
          <p className="text-2xl font-bold mt-2 text-green-600">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium">Total Pesanan Masuk</h3>
          <p className="text-2xl font-bold mt-2">{totalOrders} Pesanan</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium">Total Produk Aktif</h3>
          <p className="text-2xl font-bold mt-2">{totalProducts} Produk</p>
        </div>
      </div>
    </div>
  );
}