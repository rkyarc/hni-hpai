import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

export default async function AdminProductsPage() {
  // Ambil data produk, beserta kategori dan variannya (untuk harga & stok)
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true, 
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Manajemen Produk 📦</h1>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
          + Tambah Produk Baru
        </Button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm">Nama Produk</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Kategori</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Varian (Harga & Stok)</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{product.slug}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {product.category?.name || "Tanpa Kategori"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="space-y-1">
                      {product.variants.map(variant => (
                        <div key={variant.id} className="flex justify-between gap-4 border-b border-dashed border-gray-200 pb-1 last:border-0 last:pb-0">
                          <span>{variant.name}</span>
                          <span className="font-medium text-gray-900">Rp {variant.price.toLocaleString("id-ID")}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${variant.stock > 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            Stok: {variant.stock}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Belum ada produk di etalase Anda.
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