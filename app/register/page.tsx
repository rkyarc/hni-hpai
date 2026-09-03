"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { register } from "@/lib/actions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function clientAction(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await register(formData);
      if (result?.error) setError(result.error);
      if (result?.success) setSuccess(result.success);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Daftar Akun Baru</CardTitle>
          <CardDescription className="text-center">
            Buat akun untuk mulai berbelanja di HNI Store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={clientAction} className="space-y-4">
            
            {/* Pesan Error / Sukses */}
            {error && <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md">{error}</div>}
            {success && <div className="p-3 bg-green-100 text-green-600 text-sm rounded-md">{success}</div>}

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" type="text" placeholder="Masukkan nama Anda" required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="nama@email.com" required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={isPending} />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Login di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}