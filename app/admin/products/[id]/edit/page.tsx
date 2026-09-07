import { PrismaClient } from "@prisma/client";
import { updateProduct } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: id },
    include: { variants: true },
  });

  if (!product || product.variants.length === 0) {
    notFound();
  }

  const defaultVariant = product.variants[0];

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-900 font-medium">
          ← Kembali
        </Link>
        <h1 className="text-3xl font-bold">Edit Produk ✏️</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form action={updateProduct} className="space-y-5">
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="variantId" value={defaultVariant.id} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
            <input 
              type="text" 
              name="name" 
              required 
              defaultValue={product.name}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 outline-none" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap</label>
            <textarea 
              name="description" 
              rows={4} 
              defaultValue={product.description || ""}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-yellow-500 outline-none" 
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input type="number" name="price" required defaultValue={defaultVariant.price} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Saat Ini</label>
              <input type="number" name="stock" required defaultValue={defaultVariant.stock} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Berat (gram)</label>
              <input type="number" name="weight" required defaultValue={defaultVariant.weight || 0} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          <div className="pt-4 border-t mt-6 flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}