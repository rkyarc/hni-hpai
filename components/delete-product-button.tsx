"use client";

import { Button } from "@/components/ui/button";

export default function DeleteProductButton() {
  return (
    <Button
      type="submit"
      variant="outline"
      size="sm"
      className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={(e) => {
        if (!confirm("Peringatan: Apakah Anda yakin ingin menghapus produk ini secara permanen?")) {
          e.preventDefault();
        }
      }}
    >
      Hapus
    </Button>
  );
}