"use client";

import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  onRefresh,
}) {
  const handleDeleteCategory = async (categoryId) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/categories/${categoryId}`,
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
        alert("Kategori silinirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Kategori silinirken hata:", error);
      alert("Kategori silinirken bir hata oluştu");
    }
  };

  const handleEditCategory = async (category) => {
    const newName = prompt("Yeni kategori adı:", category.name);
    if (!newName) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (response.ok) {
        onRefresh();
      } else {
        alert("Kategori güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Kategori güncellenirken hata:", error);
      alert("Kategori güncellenirken bir hata oluştu");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Kategoriler</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {categories.map((category) => (
          <li
            key={category.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center ${
              selectedCategory?.id === category.id ? "bg-blue-50" : ""
            }`}
            onClick={() => onSelectCategory(category)}
          >
            <span className="text-sm font-medium text-gray-900">
              {category.name}
            </span>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategory(category);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(category.id);
                }}
                className="text-red-400 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="p-4 text-sm text-gray-500 text-center">
            Henüz kategori bulunmuyor
          </li>
        )}
      </ul>
    </div>
  );
}
