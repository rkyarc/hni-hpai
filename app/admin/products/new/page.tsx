import { createProduct } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header Form */}
      <div className="flex items-center gap-5 mb-8">
        <Link href="/admin/products" className="p-3 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tambah Produk Baru</h1>
          <p className="text-gray-500 text-sm mt-1">
            Lengkapi informasi di bawah ini untuk menambahkan produk ke katalog etalase HNI-Store Anda.
          </p>
        </div>
      </div>

      <form action={createProduct} className="space-y-6">
        
        {/* BLOK 1: Informasi Dasar */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <span className="text-2xl">📝</span> Informasi Dasar
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Produk <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                placeholder="Cth: Kopi HNI Sehat Premium" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Lengkap <span className="text-red-500">*</span></label>
              <textarea 
                name="description" 
                rows={5} 
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-y" 
                placeholder="Jelaskan khasiat, komposisi, dan cara penggunaan produk Anda di sini..."
              ></textarea>
              <p className="text-xs text-gray-400 mt-2">Pastikan deskripsi menarik dan informatif untuk meningkatkan minat pembeli.</p>
            </div>
          </div>
        </div>

        {/* BLOK 2: Harga & Inventaris */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <span className="text-2xl">💰</span> Harga, Stok & Pengiriman
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Jual (Rp) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">Rp</span>
                </div>
                <input 
                  type="number" 
                  name="price" 
                  required 
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                  placeholder="150000" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stok Awal <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  name="stock" 
                  required 
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                  placeholder="50" 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">Pcs</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Berat Pengiriman <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="number" 
                  name="weight" 
                  required 
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                  placeholder="250" 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">Gram</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/admin/products">
            <Button variant="ghost" type="button" className="text-gray-500 font-medium hover:text-gray-700 rounded-xl px-6 py-6">
              Batalkan
            </Button>
          </Link>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-8 py-6 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Simpan & Publikasikan
          </Button>
        </div>

      </form>
    </div>
  );
}