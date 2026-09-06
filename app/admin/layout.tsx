import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "OWNER")) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-yellow-500">HNI Admin</h2>
          <p className="text-sm text-gray-400 mt-1">Halo, {user.name}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors">
            📊 Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors">
            📦 Manajemen Produk
          </Link>
          <Link href="/admin/orders" className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors">
            📝 Daftar Pesanan
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <Link href="/" className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
            ← Kembali ke Toko
          </Link>
        </div>
      </aside>

      {/* Konten Utama Admin */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}