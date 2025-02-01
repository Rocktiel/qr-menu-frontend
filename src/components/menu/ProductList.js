"use client";

import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function ProductList({ products, selectedCategory, onRefresh }) {
  const handleDeleteProduct = async (productId) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        onRefresh();
      } else {
        alert("Ürün silinirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Ürün silinirken hata:", error);
      alert("Ürün silinirken bir hata oluştu");
    }
  };

  const handleEditProduct = async (product) => {
    // Basit bir düzenleme için prompt kullanıyoruz
    // Gerçek uygulamada bir modal kullanılmalı
    const newName = prompt("Yeni ürün adı:", product.name);
    const newPrice = prompt("Yeni fiyat:", product.price);
    const newDescription = prompt("Yeni açıklama:", product.description);

    if (!newName || !newPrice) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: newName,
            price: parseFloat(newPrice),
            description: newDescription,
            categoryId: selectedCategory.id,
          }),
        }
      );

      if (response.ok) {
        onRefresh();
      } else {
        alert("Ürün güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Ürün güncellenirken hata:", error);
      alert("Ürün güncellenirken bir hata oluştu");
    }
  };

  if (!selectedCategory) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Lütfen bir kategori seçin
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">
          {selectedCategory.name} - Ürünler
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {product.description}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {product.price.toLocaleString("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                })}
              </p>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Bu kategoride henüz ürün bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
}
