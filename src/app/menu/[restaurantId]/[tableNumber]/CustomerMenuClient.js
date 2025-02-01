"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/config";
import { toast } from "react-hot-toast";
import {
  MdDarkMode,
  MdLightMode,
  MdPayments,
  MdCreditCard,
} from "react-icons/md";

export default function CustomerMenuClient({ restaurantId, tableNumber }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });

  useEffect(() => {
    fetchCategories();
    // Local storage'dan dark mode tercihini al
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    // Dark mode class'ını uygula
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory.id);
    }
  }, [selectedCategory]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Dark mode tercihini local storage'a kaydet
    localStorage.setItem("darkMode", !isDarkMode);
    // Dark mode class'ını toggle et
    document.documentElement.classList.toggle("dark");
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/categories/restaurants/${restaurantId}`
      );
      if (!response.ok) throw new Error("Kategoriler yüklenemedi");
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) setSelectedCategory(data[0]);
    } catch (error) {
      toast.error("Kategoriler yüklenirken bir hata oluştu");
    }
  };

  const fetchProducts = async (categoryId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/products/restaurants/${restaurantId}/categories/${categoryId}`
      );
      if (!response.ok) throw new Error("Ürünler yüklenemedi");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Ürünler yüklenirken bir hata oluştu");
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success("Ürün sepete eklendi");
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.success("Ürün sepetten çıkarıldı");
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const createOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId,
          tableNumber,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            notes: item.notes || "",
          })),
        }),
      });
      console.log("Sipariş oluşturma isteği:", response);
      if (!response.ok) throw new Error("Sipariş oluşturulamadı");

      toast.success("Siparişiniz başarıyla oluşturuldu");
      setCart([]);
    } catch (error) {
      toast.error("Sipariş oluşturulurken bir hata oluştu");
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePayment = async (method) => {
    if (method === "cash") {
      await createOrder();
      setShowPaymentModal(false);
    } else if (method === "card") {
      setPaymentMethod("card");
    }
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    // Burada kart ödeme işlemleri yapılacak
    await createOrder();
    setShowPaymentModal(false);
    setPaymentMethod(null);
    setCardInfo({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolderName: "",
    });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      >
        {isDarkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
      </button>

      {/* Kategoriler */}
      <div className="p-4 sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 border-b-2 dark:border-white">
        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory?.id === category.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ürünler */}
      <div className="p-4 pb-96 ">
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-bold text-gray-900 dark:text-white">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 break-words">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">
                  {product.price} TL
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sepet */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark"
              >
                Sipariş Ver (
                {cart.reduce((total, item) => total + item.quantity, 0)} Ürün)
              </button>
              <div className="text-right">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Toplam
                </span>
                <div className="font-bold text-xl text-gray-900 dark:text-white">
                  {calculateTotal()} ₺
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ödeme Yöntemi Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Ödeme Yöntemi Seçin
            </h2>
            {!paymentMethod ? (
              <div className="space-y-4">
                <button
                  onClick={() => handlePayment("cash")}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <MdPayments size={24} />
                  Kasada Öde
                </button>
                <button
                  onClick={() => handlePayment("card")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <MdCreditCard size={24} />
                  Şimdi Öde (Kredi/Banka Kartı)
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full border border-gray-300 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  İptal
                </button>
              </div>
            ) : (
              <form onSubmit={handleCardPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    value={cardInfo.cardHolderName}
                    onChange={(e) =>
                      setCardInfo({
                        ...cardInfo,
                        cardHolderName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    value={cardInfo.cardNumber}
                    onChange={(e) =>
                      setCardInfo({ ...cardInfo, cardNumber: e.target.value })
                    }
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength="19"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Son Kullanma Tarihi
                    </label>
                    <input
                      type="text"
                      value={cardInfo.expiryDate}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, expiryDate: e.target.value })
                      }
                      placeholder="AA/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardInfo.cvv}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, cvv: e.target.value })
                      }
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark"
                  >
                    Ödemeyi Tamamla
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod(null);
                      setCardInfo({
                        cardNumber: "",
                        expiryDate: "",
                        cvv: "",
                        cardHolderName: "",
                      });
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 dark:text-gray-200 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Geri
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sepet Detayı Modal */}
      {cart.length > 0 && (
        <div class="fixed bottom-20 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg max-h-[30vh] overflow-y-auto border-t-2 dark:border-white border-gray-300 rounded-tl-2xl rounded-tr-2xl">
          <div className="max-w-md mx-auto space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.price} TL
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
                  >
                    -
                  </button>
                  <span className="text-gray-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 ml-2"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
