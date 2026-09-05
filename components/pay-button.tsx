"use client";

import { Button } from "@/components/ui/button";
import { updatePaymentSuccess } from "@/lib/actions";

export default function PayButton({ snapToken }: { snapToken: string }) {
  const handlePay = () => {
    if (typeof window !== "undefined") {
      // Cek apakah script Midtrans sudah ter-load
      if ((window as any).snap) {
        (window as any).snap.pay(snapToken, {
          onSuccess: async function (result: any) {
          // 1. Panggil action untuk update database
          await updatePaymentSuccess(snapToken);
          
          // 2. Beri tahu user dan refresh halaman
          alert("Hore! Pembayaran berhasil dan status telah di-update!");
          window.location.reload();
        },
          onPending: function (result: any) {
            alert("Menunggu pembayaran Anda...");
          },
          onError: function (result: any) {
            alert("Oops, pembayaran gagal.");
          },
          onClose: function () {
            alert("Anda menutup layar tanpa menyelesaikan pembayaran.");
          },
        });
      } else {
        // JIKA GAGAL, MUNCULKAN PESAN INI
        alert("Sistem Midtrans belum siap. Pastikan server sudah di-restart dan refresh halaman ini.");
        console.error("Midtrans Snap script is missing!");
      }
    }
  };

  return (
    <Button 
      onClick={handlePay} 
      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold"
    >
      💳 Bayar Sekarang
    </Button>
  );
}