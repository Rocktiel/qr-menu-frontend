"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/config";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.restaurantId) {
      fetchActiveOrders();
    }
  }, [user]);

  const fetchActiveOrders = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/orders/restaurants/${user.restaurantId}/active`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Siparişler yüklenemedi");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error("Siparişler yüklenirken bir hata oluştu");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`, // Eski durumu URL'ye eklemeye gerek yok
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }), // Yeni durumu body içinde gönder
        }
      );

      if (!response.ok) throw new Error("Sipariş durumu güncellenemedi");

      toast.success("Sipariş durumu güncellendi");
      fetchActiveOrders(); // Siparişleri yeniden yükle
    } catch (error) {
      toast.error("Sipariş durumu güncellenirken bir hata oluştu");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "preparing":
        return "Hazırlanıyor";
      case "ready":
        return "Hazır";
      case "delivered":
        return "Teslim Edildi";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold  text-gray-900">Aktif Siparişler</h1>
      <p className="mt-2 text-sm mb-7 text-gray-700">
        Restoranınıza ait aktif siparişleri görüntüleyebilirsiniz.
      </p>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl text-gray-900">
                  Masa {order.table.tableNumber}
                </h3>
                <span className="text-sm text-gray-900">
                  Sipariş No: {order.orderNumber}
                </span>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2 text-gray-900"
                >
                  <div>
                    <span className="font-medium text-gray-900">
                      {item.quantity}x {item.product.name}
                    </span>
                    {item.notes && (
                      <p className="text-sm text-gray-900">{item.notes}</p>
                    )}
                  </div>
                  <span>{item.price * item.quantity} TL</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="font-bold text-gray-900">
                Toplam: {order.totalAmount} TL
              </div>
              <div className="flex gap-2">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Hazırlanıyor
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Hazır
                  </button>
                )}
                {order.status === "ready" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "delivered")}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                  >
                    Teslim Edildi
                  </button>
                )}
                <button
                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  İptal Et
                </button>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Aktif sipariş bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
}
