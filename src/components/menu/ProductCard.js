'use client'

import { useState } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
        >
          {isFavorite ? (
            <HeartSolidIcon className="h-6 w-6 text-red-500" />
          ) : (
            <HeartIcon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <span className="text-lg font-bold text-green-600">₺{product.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {product.calories && (
            <span>{product.calories} kcal</span>
          )}
          {product.preparationTime && (
            <span>{product.preparationTime} dk</span>
          )}
        </div>
        {(product.isVegetarian || product.isVegan || product.isGlutenFree) && (
          <div className="flex gap-2 mt-2">
            {product.isVegetarian && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Vejetaryen</span>
            )}
            {product.isVegan && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Vegan</span>
            )}
            {product.isGlutenFree && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Gluten Free</span>
            )}
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-50 border-t">
        <button
          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => {/* Sipariş verme fonksiyonu */}}
        >
          Sipariş Ver
        </button>
      </div>
    </div>
  )
}
