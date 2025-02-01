"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { API_URL } from "@/config";
import { useAuth } from "@/hooks/useAuth";
import { QRCodeCanvas } from "qrcode.react";
import { MdDelete, MdEdit, MdRestaurantMenu } from "react-icons/md";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: 4,
    minCapacity: 1,
    location: "",
    floor: "",
    shape: "square",
  });
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(null);

  // Masaları getir
  const fetchTables = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/tables/restaurants/${user.restaurantId}/with-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Masalar yüklenemedi");
      const data = await response.json();
      setTables(data);
    } catch (error) {
      toast.error("Masalar yüklenirken bir hata oluştu");
    }
  };

  useEffect(() => {
    if (user?.restaurantId) {
      fetchTables();
    }
  }, [user]);

  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTable
        ? `${API_URL}/api/tables/${editingTable.id}`
        : `${API_URL}/api/tables/restaurants/${user.restaurantId}/tables`;

      const method = editingTable ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingTable ? "Masa güncellendi" : "Masa oluşturuldu");
        setIsModalOpen(false);
        setEditingTable(null);
        setFormData({
          tableNumber: "",
          capacity: 4,
          minCapacity: 1,
          location: "",
          floor: "",
          shape: "square",
        });
        fetchTables();
      } else {
        toast.error(data.message || "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Bir hata oluştu");
    }
  };

  // Masa silme
  const handleDelete = async (id) => {
    if (window.confirm("Bu masayı silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`${API_URL}/api/tables/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          toast.success("Masa silindi");
          fetchTables();
        } else {
          const data = await response.json();
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error deleting table:", error);
        toast.error("Masa silinirken bir hata oluştu");
      }
    }
  };

  // QR Kodu göster
  const showQRCode = (table) => {
    setSelectedQRCode(table.qrCode);
    setIsQRModalOpen(true);
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
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">
            Masalar
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Restoranınızdaki tüm masaların listesi
          </p>
        </div>
        {(user?.role === "admin" || user?.role === "restaurant_owner") && (
          <button
            onClick={() => {
              setEditingTable(null);
              setFormData({
                tableNumber: "",
                capacity: 4,
                minCapacity: 1,
                location: "",
                floor: "",
                shape: "square",
              });
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
          >
            Yeni Masa Ekle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`relative flex flex-col rounded-lg border-2 ${
              table.status === "available"
                ? "border-green-200 bg-green-100"
                : table.status === "occupied"
                ? "border-red-200 bg-red-100"
                : table.status === "reserved"
                ? "border-yellow-200 bg-yellow-50"
                : "border-gray-200 bg-gray-50"
            } border-black p-6`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Masa {table.tableNumber}
                </h2>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Kapasite: {table.capacity} kişi
                  </p>
                  {table.location && (
                    <p className="text-sm text-gray-600">
                      Konum: {table.location}
                    </p>
                  )}
                  {table.floor && (
                    <p className="text-sm text-gray-600">Kat: {table.floor}</p>
                  )}
                </div>
                <p
                  className={`inline-block px-2 py-1 rounded-full text-sm  ${
                    table.status === "available"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800 "
                  }`}
                >
                  {table.status === "available" ? "Müsait" : "Dolu"}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowQR(table.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <QrCodeIcon className="h-5 w-5" />
                </button>
                {(user?.role === "admin" ||
                  user?.role === "restaurant_owner") && (
                  <>
                    <button
                      onClick={() => {
                        setEditingTable(table);
                        setFormData({
                          tableNumber: table.tableNumber,
                          capacity: table.capacity,
                          minCapacity: table.minCapacity,
                          location: table.location || "",
                          floor: table.floor || "",
                          shape: table.shape || "square",
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdDelete size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Aktif Sipariş Bilgileri */}
            {table.orders && table.orders.length > 0 && (
              <div className="mt-4 border-t border-t-black pt-4">
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  Aktif Sipariş
                </h3>
                {table.orders.map((order) => (
                  <div key={order.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Sipariş #{order.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm text-gray-600"
                        >
                          <span>
                            {item.quantity}x {item.product.name}
                          </span>
                          <span>
                            {(item.quantity * item.product.price).toFixed(2)} ₺
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="text-right font-bold text-gray-900">
                      Toplam: {order.totalAmount.toFixed(2)} ₺
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* QR Kod Modal */}
            {showQR === table.id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Masa {table.tableNumber} QR Kodu
                  </h3>
                  <div className="flex justify-center">
                    <QRCodeCanvas
                      value={`${process.env.NEXT_PUBLIC_CLIENT_URL}/menu/${user.restaurantId}/${table.tableNumber}`}
                      size={200}
                    />
                  </div>
                  <div className="mt-2 text-center text-sm text-gray-600">
                    {`${process.env.NEXT_PUBLIC_CLIENT_URL}/menu/${user.restaurantId}/${table.tableNumber}`}
                  </div>
                  <button
                    onClick={() => setShowQR(null)}
                    className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Masa Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {editingTable ? "Masa Düzenle" : "Yeni Masa Ekle"}
                    </h3>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="tableNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Masa Numarası
                      </label>
                      <input
                        type="text"
                        name="tableNumber"
                        id="tableNumber"
                        value={formData.tableNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tableNumber: e.target.value,
                          })
                        }
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="capacity"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Kapasite
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        id="capacity"
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            capacity: parseInt(e.target.value),
                          })
                        }
                        required
                        min={1}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Konum
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="Örn: Teras, İç Mekan, Bahçe"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="floor"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Kat
                      </label>
                      <input
                        type="text"
                        name="floor"
                        id="floor"
                        value={formData.floor}
                        onChange={(e) =>
                          setFormData({ ...formData, floor: e.target.value })
                        }
                        placeholder="Örn: Zemin Kat, 1. Kat"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:col-start-2"
                    >
                      {editingTable ? "Güncelle" : "Ekle"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Kod Modal */}
      {isQRModalOpen && selectedQRCode && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Masa QR Kodu
                    </h3>
                    <div className="mt-4">
                      <img
                        src={selectedQRCode}
                        alt="QR Code"
                        className="mx-auto"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => setIsQRModalOpen(false)}
                    className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
