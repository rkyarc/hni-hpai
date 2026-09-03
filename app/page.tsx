import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/add-to-cart-button";
import { addToCart } from "@/lib/actions";

const prisma = new PrismaClient();

export default async function HomePage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true, 
    },
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Katalog Produk</h1>
        <p className="text-gray-600 mt-2">Temukan produk herbal terbaik untuk kesehatan Anda.</p>
      </div>

      {/* Grid untuk menampilkan produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <CardDescription>{product.category.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-600 line-clamp-3">
                {product.description}
              </p>
              
              {/* Menampilkan harga dari varian pertama */}
              {product.variants.length > 0 && (
                <p className="mt-4 font-bold text-lg text-blue-600">
                  Rp {product.variants[0].price.toLocaleString('id-ID')}
                </p>
              )}
            </CardContent>
            <CardFooter>
              {product.variants.length > 0 ? (
                <AddToCartButton variantId={product.variants[0].id} />
              ) : (
                <Button disabled className="w-full">Stok Kosong</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pesan jika produk kosong */}
      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">Belum ada produk yang tersedia saat ini.</p>
        </div>
      )}
    </div>
  );
}