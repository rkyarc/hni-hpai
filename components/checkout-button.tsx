"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { checkout } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function CheckoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCheckout = () => {
    startTransition(async () => {
      const result = await checkout();
      
      if (result?.error) {
        alert(result.error);
      } else if (result?.success) {
        alert(result.success);
        router.push("/"); 
      }
    });
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={isPending}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-md h-12 shadow-sm"
    >
      {isPending ? "Memproses Pesanan..." : "Checkout Sekarang"}
    </Button>
  );
}