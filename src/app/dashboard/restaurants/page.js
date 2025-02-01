'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { API_URL } from '@/config'

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRestaurant, setEditingRestaurant] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  })

  // Restoranları getir
  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${API_URL}/api/restaurants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setRestaurants(data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      toast.error('Restoranlar yüklenirken bir hata oluştu')
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingRestaurant 
        ? `${API_URL}/api/restaurants/${editingRestaurant.id}`
        : `${API_URL}/api/restaurants`
      
      const method = editingRestaurant ? 'PUT' : 'POST'
      
      console.log('Sending request with data:', formData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('Received response:', data);
      
      if (response.ok) {
        toast.success(editingRestaurant ? 'Restoran güncellendi' : 'Restoran oluşturuldu')
        setIsModalOpen(false)
        setEditingRestaurant(null)
        setFormData({
          name: '',
          address: '',
          phone: ''
        })
        fetchRestaurants()
      } else {
        toast.error(data.message || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Bir hata oluştu: ' + error.message)
    }
  }

  // Restoran silme
  const handleDelete = async (id) => {
    if (window.confirm('Bu restoranı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`${API_URL}/api/restaurants/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.ok) {
          toast.success('Restoran silindi')
          fetchRestaurants()
        } else {
          const data = await response.json()
          toast.error(data.message)
        }
      } catch (error) {
        console.error('Error deleting restaurant:', error)
        toast.error('Restoran silinirken bir hata oluştu')
      }
    }
  }

  return (
    <div>
      {/* Başlık ve Yeni Ekle Butonu */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Restoranlar</h1>
          <p className="mt-2 text-sm text-gray-700">
            Sistemdeki tüm restoranların listesi
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingRestaurant(null)
              setFormData({
                name: '',
                address: '',
                phone: ''
              })
              setIsModalOpen(true)
            }}
            className="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
          >
            Yeni Restoran Ekle
          </button>
        </div>
      </div>

      {/* Restoranlar Tablosu */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Restoran Adı
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Adres
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Telefon
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Durum
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {restaurant.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{restaurant.address}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{restaurant.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          restaurant.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {restaurant.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => {
                            setEditingRestaurant(restaurant)
                            setFormData({
                              name: restaurant.name,
                              address: restaurant.address,
                              phone: restaurant.phone
                            })
                            setIsModalOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(restaurant.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {editingRestaurant ? 'Restoran Düzenle' : 'Yeni Restoran Ekle'}
                    </h3>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Restoran Adı
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Adres
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:col-start-2"
                    >
                      {editingRestaurant ? 'Güncelle' : 'Ekle'}
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
    </div>
  )
}
