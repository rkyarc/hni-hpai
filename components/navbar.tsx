import Link from "next/link";
import { auth } from "@/auth"; 
import { logout } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-xl font-bold text-blue-600">
          HNI Store
        </Link>
        
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                Halo, {session.user.name}
              </span>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}