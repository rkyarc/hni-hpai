import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminOrdersPage() {
  // Ambil semua data pesanan dari database, beserta data user pengirimnya
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      address: true,
    },
    orderBy: { createdAt: "desc" }, // Urutkan dari yang terbaru
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Daftar Pesanan Masuk 📝</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm">ID Pesanan</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Pelanggan</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Total Belanja</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-500">
                    ...{order.id.slice(-8)}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{order.user?.name || "Tanpa Nama"}</p>
                    <p className="text-xs text-gray-500">{order.address?.recipient}</p>
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    Rp {order.totalAmount.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      order.status === "PAID" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Belum ada pesanan yang masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}