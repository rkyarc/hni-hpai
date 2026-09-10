"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login } from "@/lib/actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function clientAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* Kolom Kiri: Banner Promosi (Hanya muncul di layar laptop/desktop) */}
      <div className="hidden lg:flex w-1/2 bg-emerald-700 items-center justify-center relative overflow-hidden">
        {/* Dekorasi Background Abstrak */}
        <div className="absolute inset-0 bg-emerald-800 opacity-20" style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-900 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative z-10 p-12 text-center text-white max-w-lg">
          <div className="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center mb-8 shadow-2xl">
            <span className="text-5xl">🌿</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Selamat Datang Kembali di HNI Store</h1>
          <p className="text-emerald-100 text-lg">
            Masuk untuk mengakses keranjang kuning Anda, melacak pesanan, dan menemukan produk herbal terbaik untuk gaya hidup sehat.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            {/* Logo untuk tampilan Mobile */}
            <Link href="/" className="inline-block lg:hidden mb-6">
              <span className="text-2xl font-black text-emerald-700 tracking-tight">
                HNI<span className="text-emerald-500">Store</span>
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Masuk ke Akun</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Masukkan email dan kata sandi Anda untuk melanjutkan.
            </p>
          </div>

          <form action={clientAction} className="space-y-6 mt-8">
            
            {/* Pesan Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-semibold">Alamat Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="nama@email.com" 
                required 
                disabled={isPending}
                className="rounded-xl px-4 py-6 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-700 font-semibold">Kata Sandi</Label>
                <Link href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Lupa sandi?
                </Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••"
                required 
                disabled={isPending}
                className="rounded-xl px-4 py-6 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 font-semibold text-lg transition-all shadow-md shadow-emerald-200" 
              disabled={isPending}
            >
              {isPending ? "Mengecek Kredensial..." : "Masuk ke Sistem"}
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}