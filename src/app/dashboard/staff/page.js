"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/config";
import toast from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "staff",
  });

  // Kullanıcı bilgisini localStorage'dan al
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/staff`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setStaff(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Personel listesi yüklenirken bir hata oluştu");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingStaff
        ? `${API_URL}/api/users/${editingStaff.id}`
        : `${API_URL}/api/users`;

      const method = editingStaff ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          role: "staff",
          restaurantId: user.restaurantId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          editingStaff ? "Personel güncellendi" : "Personel eklendi"
        );
        setIsModalOpen(false);
        setEditingStaff(null);
        setFormData({
          username: "",
          password: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          role: "staff",
        });
        fetchStaff();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error saving staff:", error);
      toast.error("Personel kaydedilirken bir hata oluştu");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu personeli silmek istediğinize emin misiniz?")) {
      try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          toast.success("Personel silindi");
          fetchStaff();
        } else {
          const data = await response.json();
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error("Personel silinirken bir hata oluştu");
      }
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Personel Listesi
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Restoranınıza ait personel listesi
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingStaff(null);
              setFormData({
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                role: "staff",
              });
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
          >
            Personel Ekle
          </button>
        </div>
      </div>

      {/* Personel Listesi */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Ad Soyad
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Kullanıcı Adı
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      E-posta
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Telefon
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Durum
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staff.map((person) => (
                    <tr key={person.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {`${person.firstName} ${person.lastName}`}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.username}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            person.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {person.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3  text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => {
                              setEditingStaff(person);
                              setFormData({
                                username: person.username,
                                firstName: person.firstName,
                                lastName: person.lastName,
                                email: person.email,
                                phone: person.phone,
                                role: "staff",
                              });
                              setIsModalOpen(true);
                            }}
                            className="text-black hover:text-gray-700"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(person.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Personel Ekleme/Düzenleme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6 text-black">
              {editingStaff ? "Personel Düzenle" : "Yeni Personel Ekle"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                    required
                  />
                </div>

                {!editingStaff && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Şifre
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      required={!editingStaff}
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ad
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Soyad
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:col-start-2"
                >
                  {editingStaff ? "Güncelle" : "Ekle"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingStaff(null);
                    setFormData({
                      username: "",
                      password: "",
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      role: "staff",
                    });
                  }}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
