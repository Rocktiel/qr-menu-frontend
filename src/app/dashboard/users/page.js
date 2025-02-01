'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { API_URL } from '@/config'

export default function Users() {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: 'aaa@aaa.com',
    role: 'Rol Seçiniz',
    firstName: '',
    lastName: '',
    phone: '',
    restaurantId: ''
  })

  // Kullanıcıları getir
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setUsers(data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Kullanıcılar yüklenirken bir hata oluştu')
    }
  }

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
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    }
  }

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const userData = JSON.parse(userStr)
      setUser(userData)
    }
    fetchUsers()
    fetchRestaurants()
  }, [])

  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingUser 
        ? `${API_URL}/api/users/${editingUser.id}`
        : `${API_URL}/api/users`
      
      const method = editingUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success(editingUser ? 'Kullanıcı güncellendi' : 'Kullanıcı oluşturuldu')
        setIsModalOpen(false)
        setEditingUser(null)
        setFormData({
          username: '',
          password: '',
          email: '',
          role: 'staff',
          firstName: '',
          lastName: '',
          phone: '',
          restaurantId: ''
        })
        fetchUsers()
      } else {
        toast.error(data.message || 'Bir hata oluştu')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Bir hata oluştu: ' + error.message)
    }
  }

  // Kullanıcı silme
  const handleDelete = async (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.ok) {
          toast.success('Kullanıcı silindi')
          fetchUsers()
        } else {
          const data = await response.json()
          toast.error(data.message)
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error('Kullanıcı silinirken bir hata oluştu')
      }
    }
  }

  return (
    <div>
      {/* Başlık ve Yeni Ekle Butonu */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Kullanıcılar</h1>
          <p className="mt-2 text-sm text-gray-700">
            Sistemdeki tüm kullanıcıların listesi
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingUser(null)
              setFormData({
                username: '',
                password: '',
                email: '',
                role: 'staff',
                firstName: '',
                lastName: '',
                phone: '',
                restaurantId: ''
              })
              setIsModalOpen(true)
            }}
            className="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
          >
            Yeni Kullanıcı Ekle
          </button>
        </div>
      </div>

      {/* Kullanıcılar Tablosu */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Kullanıcı Adı
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Ad Soyad
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      E-posta
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Telefon
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Rol
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Restoran
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
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {user.username}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {`${user.firstName} ${user.lastName}`}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.role === 'admin' ? 'Yönetici' : 
                         user.role === 'restaurant_owner' ? 'Restoran Sahibi' : 
                         'Personel'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.restaurant?.name || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setFormData({
                              username: user.username,
                              email: user.email,
                              role: user.role,
                              firstName: user.firstName || '',
                              lastName: user.lastName || '',
                              phone: user.phone || '',
                              restaurantId: user.restaurantId || '',
                              isActive: user.isActive
                            })
                            setIsModalOpen(true)
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
                      {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
                    </h3>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Kullanıcı Adı
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>

                    {!editingUser && (
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Şifre
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required={!editingUser}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Rol
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={(e) => {
                          setFormData({ 
                            ...formData, 
                            role: e.target.value,
                            restaurantId: e.target.value !== 'restaurant_owner' ? '' : formData.restaurantId 
                          })
                        }}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      >
                        <option value="admin">Yönetici</option>
                        <option value="restaurant_owner">Restoran Sahibi</option>
                        {user.role === 'restaurant_owner' && <option value="staff">Personel</option>}
                      </select>
                    </div>

                    {formData.role === 'restaurant_owner' && (
                      <div>
                        <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700">
                          Restoran
                        </label>
                        <select
                          id="restaurantId"
                          name="restaurantId"
                          value={formData.restaurantId}
                          onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                          required={formData.role === 'restaurant_owner'}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                        >
                          <option value="">Restoran Seçin</option>
                          {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>
                              {restaurant.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Ad
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Soyad
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                      />
                    </div>

                    {editingUser && (
                      <div>
                        <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
                          Durum
                        </label>
                        <select
                          id="isActive"
                          name="isActive"
                          value={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm h-12 text-gray-900 px-4"
                        >
                          <option value="true">Aktif</option>
                          <option value="false">Pasif</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:col-start-2"
                    >
                      {editingUser ? 'Güncelle' : 'Ekle'}
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
