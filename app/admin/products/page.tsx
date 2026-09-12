import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteProduct } from "@/lib/actions";
import DeleteProductButton from "@/components/delete-product-button";

const prisma = new PrismaClient();

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true, 
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      
      {/* Header Section dengan Card Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-3xl">📦</span> Manajemen Produk
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Kelola katalog etalase, pantau stok varian, dan sesuaikan harga jual toko Anda.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-6 font-semibold shadow-md shadow-emerald-200 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Produk
          </Button>
        </Link>
      </div>
      
      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Info Produk</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Varian (Harga & Stok)</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-xs uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                  
                  {/* Kolom Info Produk */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 p-1">
                         <img
                            src={`https://placehold.co/100x100/f3f4f6/10b981?text=${product.name.replace(/ /g, '+')}`}
                            alt={product.name}
                            className="object-contain h-full w-full mix-blend-multiply rounded"
                          />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">/{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Kolom Kategori */}
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {product.category?.name || "Tanpa Kategori"}
                    </span>
                  </td>

                  {/* Kolom Varian & Stok */}
                  <td className="px-6 py-5">
                    <div className="space-y-2 min-w-[200px]">
                      {product.variants.map(variant => (
                        <div key={variant.id} className="flex justify-between items-center gap-4 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                          <div>
                            <p className="text-xs font-bold text-gray-700">{variant.name}</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Rp {variant.price.toLocaleString("id-ID")}</p>
                          </div>
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${
                            variant.stock > 0 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            Stok: {variant.stock}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Kolom Status */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-semibold ${product.isActive ? "text-emerald-700" : "text-red-600"}`}>
                        {product.isActive ? "Tampil" : "Disembunyikan"}
                      </span>
                    </div>
                  </td>

                  {/* Kolom Aksi */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg text-gray-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50" title="Edit Produk">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </Button>
                      </Link>

                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        {/* ✅ Komponen Delete Asli (Tidak Disentuh) */}
                        <DeleteProductButton />
                      </form>

                    </div>
                  </td>
                  
                </tr>
              ))}
              
              {/* Pesan Jika Kosong */}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl mb-4">📭</span>
                      <p className="text-gray-900 font-bold text-lg mb-1">Katalog Masih Kosong</p>
                      <p className="text-gray-500 text-sm">Belum ada produk yang ditambahkan ke dalam database etalase Anda.</p>
                    </div>
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