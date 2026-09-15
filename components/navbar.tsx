import Link from "next/link";
import { auth } from "@/auth"; 
import { logout } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-emerald-700 tracking-tight">
              HNI<span className="text-emerald-500">Store</span>
            </span>
          </Link>

          {/* Kolom Pencarian */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form action="/" method="GET" className="relative w-full">
              <input 
                type="text" 
                name="q"
                placeholder="Cari produk herbal..." 
                className="w-full bg-gray-100/50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-emerald-500 focus:border-emerald-500 block pl-4 pr-10 py-2 outline-none transition-all focus:bg-white"
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-emerald-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Menu Kanan */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {session?.user ? (
              <>
                {/* ✅ Sapaan asli dikembalikan */}
                <span className="text-sm font-medium text-gray-700 hidden lg:inline-block truncate max-w-[150px]">
                  Halo, {session.user.name}
                </span>

                {/* Tombol Admin Asli dengan sentuhan UI baru */}
                {(session.user as any).role === "ADMIN" || (session.user as any).role === "OWNER" ? (
                  <Link href="/admin" className="hidden sm:block">
                    <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-full">
                      🛡️ Admin
                    </Button>
                  </Link>
                ) : null}

                {/* Ikon Pesanan */}
                <Link href="/orders">
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full" title="Pesanan">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </Button>
                </Link>

                {/* Ikon Keranjang */}
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full" title="Keranjang">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.124a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </Button>
                </Link>
                
                {/* Tombol Logout (Menggunakan server action aslimu) */}
                <form action={logout}>
                  <Button variant="ghost" size="icon" type="submit" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full ml-1" title="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                    </svg>
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-emerald-700 font-medium hover:bg-emerald-50">Masuk</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-md shadow-emerald-200">Daftar</Button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}