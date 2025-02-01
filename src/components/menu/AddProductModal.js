"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { API_URL } from "@/config";
import toast from "react-hot-toast";

export default function AddProductModal({
  isOpen,
  onClose,
  categoryId,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/products/categories/${categoryId}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Ürün başarıyla eklendi");
        setFormData({
          name: "",
          price: "",
          description: "",
          image: "",
        });
        onSuccess();
      } else {
        toast.error(data.message || "Ürün eklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Ürün eklenirken hata:", error);
      toast.error("Ürün eklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Kapat</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold pb-5 leading-6 text-gray-900"
                    >
                      Yeni Ürün Ekle
                    </Dialog.Title>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Ürün Adı
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                            placeholder="Örn: Karışık Pizza"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Fiyat (TL)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                            placeholder="0.00"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Açıklama
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-auto text-gray-900 px-4 resize-none"
                            placeholder="Ürün açıklaması..."
                            style={{ minHeight: "3rem", resize: "none" }} // resize özelliğini kontrol ediyoruz
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Görsel URL (opsiyonel)
                          </label>
                          <input
                            type="url"
                            name="image"
                            id="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                            placeholder="https://..."
                          />
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                          >
                            {isLoading ? "Ekleniyor..." : "Ekle"}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={onClose}
                          >
                            İptal
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
