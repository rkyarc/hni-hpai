import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/add-to-cart-button";

const prisma = new PrismaClient();

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  const products = await prisma.product.findMany({
    where: { 
      isActive: true,
      ...(searchQuery ? { name: { contains: searchQuery } } : {}) 
    },
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. HERO BANNER SECTION */}
      {!searchQuery && (
        <section className="bg-emerald-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 space-y-6">
              <p className="text-emerald-200 font-semibold tracking-wider text-sm">HNI HPAI: HALAL & HERBAL SOLUTIONS</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Natural Products for <br /> a Healthier Life.
              </h1>
              <p className="text-emerald-100 text-lg max-w-md">
                Produk herbal alami, botani, dan gaya hidup sehat untuk Anda dan keluarga tercinta.
              </p>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 rounded-full font-semibold text-lg border-0 shadow-lg mt-4">
                Shop Now
              </Button>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
              <div className="w-80 h-80 bg-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-500/30 relative z-10 shadow-2xl">
                <span className="text-emerald-200 font-medium px-8 text-center">
                  ✨ Gambar Banner Utama ✨
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. FEATURED PRODUCTS GRID */}
      <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${searchQuery ? 'py-8' : 'py-16'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {/* ✅ 3. Tampilkan judul dinamis */}
            {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : "Featured"}
          </h2>
          {!searchQuery && (
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 shadow-sm">{"<"}</button>
              <button className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 shadow-sm">{">"}</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const defaultVariant = product.variants[0];
            return (
              <div key={product.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col group">
                
                {/* Badge Kategori & Wishlist */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-1 rounded-md">
                    {product.category?.name || "Herbal"}
                  </span>
                  <button className="text-gray-300 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>
                
                {/* Product Image Area */}
                <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center p-2">
                  <img 
                    src={`https://placehold.co/300x300/f3f4f6/10b981?text=${product.name.replace(/ /g, '+')}`} 
                    alt={product.name}
                    className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                  <div className="text-yellow-400 text-xs mb-2">★★★★★</div>
                  <p className="font-bold text-emerald-600 mb-5 text-lg">
                    Rp {defaultVariant?.price?.toLocaleString("id-ID") || "0"}
                  </p>
                  
                  <div className="mt-auto w-full">
                    {product.variants.length > 0 ? (
                      <div className="w-full">
                        <AddToCartButton variantId={defaultVariant.id} />
                      </div>
                    ) : (
                      <Button disabled className="w-full bg-gray-200 text-gray-500">Stok Kosong</Button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 mt-6">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-gray-900 font-bold text-lg">Produk Tidak Ditemukan</p>
            <p className="text-gray-500">Maaf, kami tidak dapat menemukan produk "{searchQuery}".</p>
          </div>
        )}
      </section>

    </div>
  );
}