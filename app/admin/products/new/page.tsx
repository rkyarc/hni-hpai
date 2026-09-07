import { createProduct } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-900 font-medium">
          ← Kembali
        </Link>
        <h1 className="text-3xl font-bold">Tambah Produk Baru 🍯</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {/* Form ini akan otomatis memanggil fungsi createProduct saat di-submit */}
        <form action={createProduct} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 outline-none" 
              placeholder="Cth: Kopi HNI Sehat" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap</label>
            <textarea 
              name="description" 
              rows={4} 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 outline-none" 
              placeholder="Jelaskan khasiat dan detail produk Anda di sini..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input type="number" name="price" required className="w-full border border-gray-300 rounded-md p-2" placeholder="150000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
              <input type="number" name="stock" required className="w-full border border-gray-300 rounded-md p-2" placeholder="50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Berat (gram)</label>
              <input type="number" name="weight" required className="w-full border border-gray-300 rounded-md p-2" placeholder="250" />
            </div>
          </div>

          <div className="pt-4 border-t mt-6 flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Simpan Produk
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}