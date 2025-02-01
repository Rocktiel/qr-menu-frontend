'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BuildingStorefrontIcon, UsersIcon, TableCellsIcon, CurrencyDollarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { API_URL } from '@/config'

const iconMap = {
  BuildingStorefrontIcon,
  UsersIcon,
  TableCellsIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const userData = JSON.parse(userStr)
      setUser(userData)
      fetchStats()
    }
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setStats(data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('İstatistikler yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const renderActionButton = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <button
            type="button"
            onClick={() => router.push('/dashboard/restaurants')}
            className="inline-flex items-center gap-x-2 rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Restoranları Yönet
          </button>
        )
      case 'restaurant_owner':
        return (
          <button
            type="button"
            onClick={() => router.push('/dashboard/tables')}
            className="inline-flex items-center gap-x-2 rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Masaları Yönet
          </button>
        )
      case 'staff':
        return (
          <button
            type="button"
            onClick={() => router.push('/dashboard/orders')}
            className="inline-flex items-center gap-x-2 rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Siparişleri Yönet
          </button>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">Dashboard</h3>
        <div className="mt-3 sm:ml-4 sm:mt-0">
          {renderActionButton()}
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-black p-3">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
