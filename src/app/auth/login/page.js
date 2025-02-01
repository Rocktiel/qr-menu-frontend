"use client";

import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sol taraf - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              QR Menu Sistemine Hoş Geldiniz
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Lütfen hesabınıza giriş yapın
            </p>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Sağ taraf - Görsel */}
      <div className="hidden lg:flex lg:flex-1 relative">
        <Image
          src="/authbg.jpg"
          alt="Restaurant"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-4">
              Modern QR Menü Yönetim Sistemi
            </h1>
            <p className="text-lg">
              Restoranınızı dijitalleştirin, müşteri deneyimini iyileştirin ve
              işletmenizi daha verimli hale getirin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
