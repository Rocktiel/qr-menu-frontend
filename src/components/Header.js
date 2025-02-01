"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";

const getNavigationByRole = (role) => {
  switch (role) {
    case "admin":
      return [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Restoranlar", href: "/dashboard/restaurants" },
        { name: "Kullanıcılar", href: "/dashboard/users" },
        { name: "Ayarlar", href: "/dashboard/settings" },
      ];
    case "restaurant_owner":
      return [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Menü", href: "/dashboard/menu" },
        { name: "Masalar", href: "/dashboard/tables" },
        { name: "Personeller", href: "/dashboard/staff" },
        { name: "Aktif Siparişler", href: "/dashboard/active-orders" },
      ];
    case "staff":
      return [
        { name: "Masalar", href: "/dashboard/tables" },
        { name: "Aktif Siparişler", href: "/dashboard/active-orders" },
      ];
    default:
      return [];
  }
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [navigation, setNavigation] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setNavigation(getNavigationByRole(userData.role));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <header className="bg-white shadow">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a
            href={user?.role === "staff" ? "/dashboard/tables" : "/dashboard"}
            className="-m-1.5 p-1.5 text-xl font-bold text-black"
          >
            QR Menu
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {user?.username} (
              {user?.role === "admin"
                ? "Yönetici"
                : user?.role === "restaurant_owner"
                ? "Restoran Sahibi"
                : "Personel"}
              )
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Çıkış Yap <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/dashboard" className="-m-1.5 p-1.5 text-xl font-bold">
              QR Menu
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-500">
                    {user?.username} (
                    {user?.role === "admin"
                      ? "Yönetici"
                      : user?.role === "restaurant_owner"
                      ? "Restoran Sahibi"
                      : "Personel"}
                    )
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
