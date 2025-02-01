"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import CategoryList from "@/components/menu/CategoryList";
import ProductList from "@/components/menu/ProductList";
import AddCategoryModal from "@/components/menu/AddCategoryModal";
import AddProductModal from "@/components/menu/AddProductModal";
import { API_URL } from "@/config";
import toast from "react-hot-toast";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (selectedCategory) {
      fetchProducts(selectedCategory.id);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      } else {
        toast.error(data.message || "Kategoriler yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
      toast.error("Kategoriler yüklenirken bir hata oluştu");
    }
  };

  const fetchProducts = async (categoryId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/products/categories/${categoryId}/products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        toast.error(data.message || "Ürünler yüklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Ürünler yüklenirken hata:", error);
      toast.error("Ürünler yüklenirken bir hata oluştu");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Menü Yönetimi</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni Kategori
          </button>
          <button
            onClick={() => {
              if (!selectedCategory) {
                toast.error("Lütfen önce bir kategori seçin");
                return;
              }
              setIsAddProductModalOpen(true);
            }}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              selectedCategory
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni Ürün
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onRefresh={fetchCategories}
          />
        </div>
        <div className="md:col-span-3">
          <ProductList
            products={products}
            selectedCategory={selectedCategory}
            onRefresh={() =>
              selectedCategory && fetchProducts(selectedCategory.id)
            }
          />
        </div>
      </div>

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSuccess={() => {
          fetchCategories();
          setIsAddCategoryModalOpen(false);
        }}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        categoryId={selectedCategory?.id}
        onSuccess={() => {
          fetchProducts(selectedCategory?.id);
          setIsAddProductModalOpen(false);
        }}
      />
    </div>
  );
}
