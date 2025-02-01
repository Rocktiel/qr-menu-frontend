'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SearchBar({ onSearch }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
        placeholder="Ürün ara..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
