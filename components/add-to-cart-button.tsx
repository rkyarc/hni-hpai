"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/actions";

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addToCart(variantId);
      
      if (result?.error) {
        alert(result.error);
      } else if (result?.success) {
        alert(result.success);
      }
    });
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isPending} 
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-sm"
    >
      {isPending ? "Memasukkan..." : "Masukkan Keranjang Kuning"}
    </Button>
  );
}