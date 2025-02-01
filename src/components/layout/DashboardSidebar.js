"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdRestaurantMenu,
  MdPeople,
  MdTableBar,
} from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="w-64 bg-white h-full shadow-lg">
      <div className="p-4">
        <nav className="space-y-2">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
              pathname === "/dashboard" ? "bg-gray-100" : ""
            }`}
          >
            <MdDashboard className="mr-2" />
            Dashboard
          </Link>

          {/* Restoranlar (sadece admin için) */}
          {user?.role === "admin" && (
            <Link
              href="/dashboard/restaurants"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
                pathname === "/dashboard/restaurants" ? "bg-gray-100" : ""
              }`}
            >
              <MdRestaurantMenu className="mr-2" />
              Restoranlar
            </Link>
          )}

          {/* Kullanıcılar (sadece admin ve restoran sahibi için) */}
          {(user?.role === "admin" || user?.role === "restaurant_owner") && (
            <Link
              href="/dashboard/staff"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
                pathname === "/dashboard/staff" ? "bg-gray-100" : ""
              }`}
            >
              <MdPeople className="mr-2" />
              Personel
            </Link>
          )}

          {/* Masalar (restoran sahibi ve personel için) */}
          {(user?.role === "restaurant_owner" || user?.role === "staff") && (
            <Link
              href="/dashboard/tables"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
                pathname === "/dashboard/tables" ? "bg-gray-100" : ""
              }`}
            >
              <MdTableBar className="mr-2" />
              Masalar
            </Link>
          )}

          {/* Aktif Siparişler (restoran sahibi ve personel için) */}
          {(user?.role === "restaurant_owner" || user?.role === "staff") && (
            <Link
              href="/dashboard/active-orders"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
                pathname === "/dashboard/active-orders" ? "bg-gray-100" : ""
              }`}
            >
              <MdRestaurantMenu className="mr-2" />
              Aktif Siparişler
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
