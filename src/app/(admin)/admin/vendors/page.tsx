'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import {
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Eye,
} from 'lucide-react'

type VendorStatus = 'pending' | 'approved' | 'rejected'

interface VendorRecord {
  uid: string
  displayName: string
  email: string
  phone?: string
  businessName: string
  businessAddress: string
  gstNumber?: string
  vendorStatus: VendorStatus
  createdAt?: { seconds: number } | null
  emailVerified: boolean
}

const TABS: { key: VendorStatus | 'all'; label: string; color: string }[] = [
  { key: 'pending',  label: 'Pending',  color: 'text-amber-600 border-amber-400 bg-amber-50' },
  { key: 'approved', label: 'Approved', color: 'text-green-600 border-green-400 bg-green-50' },
  { key: 'rejected', label: 'Rejected', color: 'text-red-600 border-red-400 bg-red-50' },
  { key: 'all',      label: 'All',      color: 'text-gray-600 border-gray-400 bg-gray-50' },
]

function statusBadge(status: VendorStatus) {
  const map: Record<VendorStatus, string> = {
    pending:  'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  }
  const icons: Record<VendorStatus, React.ReactNode> = {
    pending:  <Clock className="w-3 h-3" />,
    approved: <CheckCircle className="w-3 h-3" />,
    rejected: <XCircle className="w-3 h-3" />,
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function formatDate(ts?: { seconds: number } | null) {
  if (!ts?.seconds) return '—'
  return new Date(ts.seconds * 1000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function AdminVendorsPage() {
  const { role } = useAuth()
  const [vendors, setVendors] = useState<VendorRecord[]>([])
  const [tab, setTab] = useState<VendorStatus | 'all'>('pending')
  const [search, setSearch] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [actionUid, setActionUid] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchVendors = useCallback(async () => {
    setLoadingData(true)
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'vendor'),
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(q)
      setVendors(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as VendorRecord)))
    } catch (err) {
      console.error('Failed to fetch vendors:', err)
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => { fetchVendors() }, [fetchVendors])

  const updateVendorStatus = async (uid: string, newStatus: VendorStatus) => {
    setActionUid(uid)
    try {
      await updateDoc(doc(db, 'users', uid), {
        vendorStatus: newStatus,
        updatedAt: serverTimestamp(),
      })

      // If approving, also update Firebase custom claim via existing API
      if (newStatus === 'approved') {
        await fetch('/api/users/set-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, role: 'vendor' }),
        })
      }

      setVendors((prev) =>
        prev.map((v) => (v.uid === uid ? { ...v, vendorStatus: newStatus } : v))
      )
    } catch (err) {
      console.error('Failed to update vendor status:', err)
    } finally {
      setActionUid(null)
    }
  }

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-kokan-earth/40">Access denied.</p>
      </div>
    )
  }

  const filtered = vendors
    .filter((v) => tab === 'all' || v.vendorStatus === tab)
    .filter((v) => {
      if (!search.trim()) return true
      const s = search.toLowerCase()
      return (
        v.displayName?.toLowerCase().includes(s) ||
        v.email?.toLowerCase().includes(s) ||
        v.businessName?.toLowerCase().includes(s) ||
        v.businessAddress?.toLowerCase().includes(s)
      )
    })

  const counts = {
    pending:  vendors.filter((v) => v.vendorStatus === 'pending').length,
    approved: vendors.filter((v) => v.vendorStatus === 'approved').length,
    rejected: vendors.filter((v) => v.vendorStatus === 'rejected').length,
    all:      vendors.length,
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-kokan-earth font-playfair">Vendor Management</h1>
          <p className="text-sm text-kokan-earth/50 mt-0.5">Review and approve vendor applications</p>
        </div>
        <button
          onClick={fetchVendors}
          disabled={loadingData}
          className="flex items-center gap-2 text-sm text-kokan-earth/50 hover:text-kokan-earth transition-colors border border-kokan-sand rounded-xl px-4 py-2 hover:bg-kokan-sand/10"
        >
          <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending Review', count: counts.pending, color: 'border-l-amber-400', countColor: 'text-amber-600' },
          { label: 'Approved', count: counts.approved, color: 'border-l-green-400', countColor: 'text-green-600' },
          { label: 'Rejected', count: counts.rejected, color: 'border-l-red-400', countColor: 'text-red-600' },
          { label: 'Total Vendors', count: counts.all, color: 'border-l-kokan-green', countColor: 'text-kokan-earth' },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border border-kokan-sand/40 border-l-4 ${s.color} p-4`}>
            <p className={`text-2xl font-bold ${s.countColor}`}>{s.count}</p>
            <p className="text-xs text-kokan-earth/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                tab === t.key ? t.color : 'text-kokan-earth/40 border-kokan-sand/40 hover:bg-kokan-sand/10'
              }`}
            >
              {t.label}
              <span className="ml-1.5 opacity-70">({counts[t.key]})</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kokan-earth/30" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-kokan-sand rounded-xl bg-white text-kokan-earth focus:outline-none focus:ring-2 focus:ring-kokan-green/30 w-56 placeholder:text-kokan-earth/30"
          />
        </div>
      </div>

      {/* Table */}
      {loadingData ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-kokan-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-kokan-sand/40">
          <Building2 className="w-10 h-10 text-kokan-earth/20 mx-auto mb-3" />
          <p className="text-kokan-earth/40 text-sm">
            {search ? 'No vendors match your search.' : `No ${tab === 'all' ? '' : tab + ' '}vendors found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((vendor) => (
            <div
              key={vendor.uid}
              className="bg-white rounded-2xl border border-kokan-sand/40 overflow-hidden"
            >
              {/* Main row */}
              <div className="flex items-center gap-4 p-5">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-kokan-green/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-kokan-green font-bold text-sm">
                    {vendor.businessName?.charAt(0)?.toUpperCase() ?? 'V'}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-kokan-earth text-sm">{vendor.businessName}</p>
                    {statusBadge(vendor.vendorStatus)}
                    {!vendor.emailVerified && (
                      <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">
                        Email unverified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-kokan-earth/50 mt-0.5">{vendor.displayName}</p>
                  <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-kokan-earth/40">
                      <Mail className="w-3 h-3" /> {vendor.email}
                    </span>
                    {vendor.phone && (
                      <span className="flex items-center gap-1 text-xs text-kokan-earth/40">
                        <Phone className="w-3 h-3" /> {vendor.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-kokan-earth/40">
                      <MapPin className="w-3 h-3" /> {vendor.businessAddress || '—'}
                    </span>
                  </div>
                </div>

                {/* Date + actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-xs text-kokan-earth/30">Applied {formatDate(vendor.createdAt)}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpanded(expanded === vendor.uid ? null : vendor.uid)}
                      className="p-1.5 rounded-lg text-kokan-earth/30 hover:text-kokan-earth hover:bg-kokan-sand/10 transition-all"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {vendor.vendorStatus !== 'approved' && (
                      <button
                        disabled={actionUid === vendor.uid}
                        onClick={() => updateVendorStatus(vendor.uid, 'approved')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-semibold hover:bg-green-100 transition-all disabled:opacity-50"
                      >
                        {actionUid === vendor.uid ? (
                          <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                        Approve
                      </button>
                    )}

                    {vendor.vendorStatus !== 'rejected' && (
                      <button
                        disabled={actionUid === vendor.uid}
                        onClick={() => updateVendorStatus(vendor.uid, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                      >
                        {actionUid === vendor.uid ? (
                          <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        Reject
                      </button>
                    )}

                    {vendor.vendorStatus === 'approved' && (
                      <button
                        disabled={actionUid === vendor.uid}
                        onClick={() => updateVendorStatus(vendor.uid, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 text-xs font-semibold hover:bg-gray-100 transition-all disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === vendor.uid && (
                <div className="border-t border-kokan-sand/30 bg-kokan-cream/30 px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-kokan-earth/40 font-medium">UID</p>
                    <p className="text-xs text-kokan-earth font-mono mt-0.5 truncate">{vendor.uid}</p>
                  </div>
                  <div>
                    <p className="text-xs text-kokan-earth/40 font-medium">GST Number</p>
                    <p className="text-xs text-kokan-earth mt-0.5">{vendor.gstNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-kokan-earth/40 font-medium">Email Verified</p>
                    <p className={`text-xs font-semibold mt-0.5 ${vendor.emailVerified ? 'text-green-600' : 'text-red-500'}`}>
                      {vendor.emailVerified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-kokan-earth/40 font-medium">Applied On</p>
                    <p className="text-xs text-kokan-earth mt-0.5">{formatDate(vendor.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}