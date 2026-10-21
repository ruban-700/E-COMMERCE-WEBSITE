import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  MessageCircle,
  ExternalLink,
  Search,
  RefreshCw,
  AlertCircle,
  X,
  UserCheck,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useStoreSettings } from '../context/StoreSettingsContext.tsx';
import { Product, Order, CustomRequest, Coupon, StoreSettings } from '../types/index.ts';

interface AdminDashboardProps {
  onBackToStore: () => void;
  initialEditingProduct?: any;
  onClearInitialEditingProduct?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  initialEditingProduct,
  onClearInitialEditingProduct,
}) => {
  const { user, isAdmin, adminKey, setAdminKey, signInWithGoogle, getAuthHeaders } = useAuth();
  const { refreshSettings } = useStoreSettings();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'custom' | 'coupons' | 'settings'>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [customList, setCustomList] = useState<CustomRequest[]>([]);
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Settings State
  const [storeSettingsData, setStoreSettingsData] = useState({
    free_shipping_threshold: '999',
    standard_shipping_fee: '79',
    cod_enabled: 'true',
    announcement_banner: 'DIWALI SALE IS LIVE',
    whatsapp_number: '+91 98765 43210',
  });

  // Product Modal State (Add / Edit)
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Show Toast
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Load Data
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    const headers = getAuthHeaders();

    try {
      // 1. Metrics
      const mRes = await fetch('/api/admin/metrics', { headers });
      if (mRes.ok) {
        setMetrics(await mRes.json());
      } else if (mRes.status === 401 || mRes.status === 403) {
        setErrorMsg('Admin authorization required. Please sign in or use the demo admin key.');
      }

      // 2. Products
      const pRes = await fetch('/api/admin/products', { headers });
      if (pRes.ok) setProductsList(await pRes.json());

      // 3. Orders
      const oRes = await fetch('/api/admin/orders', { headers });
      if (oRes.ok) setOrdersList(await oRes.json());

      // 4. Custom Requests
      const cRes = await fetch('/api/admin/custom-requests', { headers });
      if (cRes.ok) setCustomList(await cRes.json());

      // 5. Coupons
      const cpRes = await fetch('/api/admin/coupons', { headers });
      if (cpRes.ok) setCouponsList(await cpRes.json());

      // 6. Settings
      const sRes = await fetch('/api/admin/settings', { headers });
      if (sRes.ok) {
        const sArr = await sRes.json();
        const sMap = Object.fromEntries(sArr.map((s: any) => [s.key, s.value]));
        setStoreSettingsData((prev) => ({ ...prev, ...sMap }));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, isAdmin, adminKey]);

  useEffect(() => {
    if (initialEditingProduct) {
      setActiveTab('products');
      setEditingProduct({
        ...initialEditingProduct,
        imageUrl: initialEditingProduct.primaryImage || initialEditingProduct.imageUrl || '',
      });
      setIsProductModalOpen(true);
      if (onClearInitialEditingProduct) {
        onClearInitialEditingProduct();
      }
    }
  }, [initialEditingProduct, onClearInitialEditingProduct]);

  // Order status update
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string, courier?: string, tracking?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          orderStatus: newStatus,
          courierPartner: courier,
          trackingNumber: tracking,
        }),
      });

      if (res.ok) {
        triggerToast(`Order status updated to ${newStatus}`);
        loadDashboardData();
      }
    } catch {
      alert('Failed to update order');
    }
  };

  // Custom request status update
  const handleUpdateCustomRequest = async (id: number, status: string, notes?: string) => {
    try {
      const res = await fetch(`/api/admin/custom-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      if (res.ok) {
        triggerToast(`Custom request updated to ${status}`);
        loadDashboardData();
      }
    } catch {
      alert('Failed to update custom request');
    }
  };

  // Delete product (archive)
  const handleArchiveProduct = async (id: number) => {
    if (!confirm('Are you sure you want to archive this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        triggerToast('Product archived successfully');
        loadDashboardData();
      }
    } catch {
      alert('Failed to archive product');
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingProduct?.id;
    const url = isEdit ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        triggerToast(isEdit ? 'Product updated successfully' : 'New craft created successfully');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        loadDashboardData();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to save product');
      }
    } catch {
      alert('Network error while saving product');
    }
  };

  // Create Coupon
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('10');
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [newCouponMin, setNewCouponMin] = useState('0');

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          code: newCouponCode.trim().toUpperCase(),
          discountType: newCouponType,
          discountValue: Number(newCouponDiscount),
          minOrderValue: Number(newCouponMin),
        }),
      });

      if (res.ok) {
        triggerToast(`Coupon ${newCouponCode.toUpperCase()} created!`);
        setNewCouponCode('');
        loadDashboardData();
      }
    } catch {
      alert('Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        triggerToast('Coupon deleted');
        loadDashboardData();
      }
    } catch {
      alert('Failed to delete coupon');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ settings: storeSettingsData }),
      });

      if (res.ok) {
        triggerToast('Store settings updated successfully!');
        await refreshSettings();
        loadDashboardData();
      }
    } catch {
      alert('Failed to save settings');
    }
  };

  // Reset all orders for fresh client launch
  const handleResetOrders = async () => {
    if (
      !confirm(
        'Are you sure you want to reset all orders? This will delete all test orders and custom requests, and reset stock levels to 15 so the store is completely clean and ready for real clients.'
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/admin/reset-orders', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast('All test orders cleared! The store is clean and ready for client launch.');
        loadDashboardData();
      } else {
        alert(data.error || 'Failed to reset orders');
      }
    } catch {
      alert('Network error while resetting orders');
    }
  };

  // Filtered orders
  const filteredOrders = ordersList.filter((o) => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.guestName.toLowerCase().includes(q) ||
        o.guestEmail.toLowerCase().includes(q) ||
        o.guestPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE3D4]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#254A3B] text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#254A3B]">
                BeePri Studio Administration
              </h1>
              <p className="text-xs text-gray-500">
                Manage handmade catalogue, fulfill customer orders, review custom requests & store settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Admin Demo Key button for instant verification */}
          {!isAdmin && (
            <button
              onClick={() => {
                setAdminKey('buzz-admin-secret-2026');
                triggerToast('Authorized with Admin Access Key');
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Click to activate admin permissions in sandbox"
            >
              <Key className="w-3.5 h-3.5" />
              Enable Sandbox Admin Key
            </button>
          )}

          {isAdmin && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Admin Verified
            </span>
          )}

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="p-2 rounded-lg bg-white border border-[#EDE3D4] text-[#254A3B] hover:bg-[#EDE3D4] transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onBackToStore}
            className="px-4 py-2 rounded-xl bg-[#254A3B] text-[#F6F0E6] text-xs font-semibold hover:bg-[#1e3c30] transition"
          >
            Back to Storefront
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setAdminKey('buzz-admin-secret-2026')}
            className="px-3 py-1 rounded-lg bg-amber-800 text-white font-semibold text-xs ml-4"
          >
            Authorize with Key
          </button>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EDE3D4]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#254A3B] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-[#EDE3D4]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Overview
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#254A3B] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-[#EDE3D4]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Products ({productsList.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#254A3B] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-[#EDE3D4]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Orders ({ordersList.length})
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'custom'
              ? 'bg-[#254A3B] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-[#EDE3D4]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Custom Requests ({customList.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-[#254A3B] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-[#EDE3D4]'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          Coupons
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#254A3B] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-[#EDE3D4]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Store Settings
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-2">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="text-3xl font-extrabold text-[#254A3B]">
                ₹{metrics?.totalRevenue ?? ordersList.reduce((acc, o) => acc + o.totalAmount, 0)}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Pan-India Sales</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-2">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
                Total Orders
              </span>
              <div className="text-3xl font-extrabold text-[#254A3B]">
                {metrics?.totalOrders ?? ordersList.length}
              </div>
              <span className="text-[11px] text-gray-500">Fulfilled & in-progress</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-2">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
                Handmade Crafts in Catalogue
              </span>
              <div className="text-3xl font-extrabold text-[#254A3B]">
                {metrics?.totalProducts ?? productsList.length}
              </div>
              <span className="text-[11px] text-[#8B5A3E] font-medium">Active studio designs</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-2">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
                Custom Bespoke Requests
              </span>
              <div className="text-3xl font-extrabold text-[#C87D55]">
                {customList.length}
              </div>
              <span className="text-[11px] text-gray-500">Awaiting quotes or in craft</span>
            </div>
          </div>

          {/* Recent Orders in Studio */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE3D4] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#254A3B]">
                Recent Orders
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-[#8B5A3E] hover:underline"
              >
                View All Orders →
              </button>
            </div>

            {ordersList.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No orders placed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F6F0E6] text-[#254A3B] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="p-3 rounded-l-lg">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ordersList.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-[#254A3B]">{o.orderNumber}</td>
                        <td className="p-3">
                          <span className="font-semibold block">{o.guestName}</span>
                          <span className="text-gray-400 text-[10px]">{o.guestEmail}</span>
                        </td>
                        <td className="p-3 text-gray-600">{o.city}, {o.state}</td>
                        <td className="p-3 font-bold text-[#254A3B]">₹{o.totalAmount}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {o.paymentStatus.toUpperCase()} ({o.paymentMethod})
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#254A3B]/10 text-[#254A3B] uppercase">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="text-[11px] p-1 border rounded bg-white cursor-pointer"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="crafting">Crafting</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#254A3B]">
              Handmade Catalogue ({productsList.length})
            </h3>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  sku: `BBP-${Date.now().toString().slice(-4)}`,
                  price: 299,
                  salePrice: '',
                  stock: 10,
                  isMadeToOrder: false,
                  productionDays: '2-3 business days',
                  materials: '100% Cotton Yarn, Ceramic Clay',
                  dimensions: 'Standard size',
                  description: 'Handcrafted with love by BeePri in India.',
                  imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
                  variants: [{ name: 'Default Palette', colorHex: '#E8B4B8', priceDelta: 0, stock: 10 }],
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#254A3B] text-[#F6F0E6] text-xs font-semibold hover:bg-[#1e3c30] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Handmade Craft</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#EDE3D4] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F6F0E6] text-[#254A3B] uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Craft</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Made to Order</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productsList.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.primaryImage || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=100&q=80'}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#F6F0E6]"
                          />
                          <div>
                            <span className="font-semibold text-[#254A3B] block">{p.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-medium text-gray-700">{p.sku}</td>
                      <td className="p-3 text-gray-600">{p.categoryName || 'General'}</td>
                      <td className="p-3 font-bold text-[#254A3B]">
                        ₹{p.salePrice ?? p.price}
                        {p.salePrice && <span className="text-gray-400 line-through text-[10px] ml-1">₹{p.price}</span>}
                      </td>
                      <td className="p-3">
                        <span className={`font-semibold ${p.stock < 5 ? 'text-amber-700' : 'text-gray-700'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3">
                        {p.isMadeToOrder ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#EDE3D4] text-[#8B5A3E] font-medium">
                            Yes ({p.productionDays || '2-3d'})
                          </span>
                        ) : (
                          <span className="text-gray-400">Ready to ship</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {p.isActive ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingProduct({
                              ...p,
                              imageUrl: p.primaryImage || '',
                            });
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#254A3B]"
                          title="Edit Craft"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleArchiveProduct(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                          title="Archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#254A3B]">
                Order Fulfillment ({filteredOrders.length})
              </h3>
              <p className="text-xs text-gray-500">Live order queue from store customers</p>
            </div>

            {/* Filter buttons, search & reset */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by Order # or Name..."
                className="px-3 py-1.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none"
              />

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] bg-white cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="crafting">Crafting</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                type="button"
                onClick={handleResetOrders}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-1 transition cursor-pointer"
                title="Reset all orders and restore full catalogue stock"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Orders</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-3xl p-6 border border-[#EDE3D4] shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#EDE3D4]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-[#254A3B]">{o.orderNumber}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 block">
                      Recipient: <strong>{o.guestName}</strong> ({o.guestPhone}) • {o.guestEmail}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#254A3B]">₹{o.totalAmount}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.paymentStatus.toUpperCase()} ({o.paymentMethod})
                    </span>
                  </div>
                </div>

                {/* Address & Gift note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                      Delivery Address
                    </span>
                    <p className="text-[#254A3B]">
                      {o.addressLine1}, {o.addressLine2 ? `${o.addressLine2}, ` : ''}
                      {o.city}, {o.state} - <strong>{o.pincode}</strong>
                    </p>
                  </div>

                  {o.giftNote && (
                    <div className="p-2.5 rounded-xl bg-[#F6F0E6] text-xs text-[#8B5A3E]">
                      <span className="font-bold block text-[10px]">Handwritten Gift Note:</span>
                      <p className="italic">"{o.giftNote}"</p>
                    </div>
                  )}
                </div>

                {/* Status Updater & Courier Tracking */}
                <div className="pt-3 border-t border-[#EDE3D4] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Order Status:</span>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      className="px-2.5 py-1.5 border border-[#254A3B]/20 rounded-lg text-xs font-semibold text-[#254A3B] bg-white cursor-pointer"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="crafting">Crafting / Making</option>
                      <option value="dispatched">Dispatched with Courier</option>
                      <option value="delivered">Delivered to Customer</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-gray-500">
                      Tracking AWB: {o.trackingNumber || 'Not generated'}
                    </span>
                    <a
                      href={`https://wa.me/91${o.guestPhone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(o.guestName)}!%20Update%20regarding%20your%20Buzz%20by%20BeePri%20order%20${o.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-[#25D366] text-white font-semibold text-[11px] flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp Customer
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOM REQUESTS */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#254A3B]">
            Bespoke Custom Orders ({customList.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customList.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 border border-[#EDE3D4] shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8B4B8]/40 text-[#254A3B] uppercase">
                        {req.itemType}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#254A3B] mt-1">
                        {req.customerName}
                      </h4>
                    </div>

                    <select
                      value={req.status}
                      onChange={(e) => handleUpdateCustomRequest(req.id, e.target.value)}
                      className="px-2 py-1 rounded-lg border text-xs font-semibold cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="in_review">In Review</option>
                      <option value="quoted">Quoted</option>
                      <option value="accepted">Accepted / In Craft</option>
                      <option value="completed">Completed</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>

                  <p className="text-xs text-gray-700 bg-[#F6F0E6]/50 p-3 rounded-xl border border-[#EDE3D4] leading-relaxed">
                    "{req.description}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                    {req.personalizationText && (
                      <div>
                        <strong>Custom Text:</strong> {req.personalizationText}
                      </div>
                    )}
                    {req.colorPreferences && (
                      <div>
                        <strong>Colors:</strong> {req.colorPreferences}
                      </div>
                    )}
                    {req.budgetRange && (
                      <div>
                        <strong>Budget:</strong> {req.budgetRange}
                      </div>
                    )}
                    {req.needByDate && (
                      <div>
                        <strong>Need By:</strong> {req.needByDate}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EDE3D4] flex items-center justify-between text-xs">
                  <div className="text-gray-500">
                    <span>{req.phone}</span> • <span>{req.email}</span>
                  </div>

                  <a
                    href={`https://wa.me/91${req.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(req.customerName)}!%20This%20is%20BeePri%20regarding%20your%20custom%20order%20for%20${encodeURIComponent(req.itemType)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Coupon Form */}
            <div className="bg-white rounded-3xl p-6 border border-[#EDE3D4] shadow-2xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#254A3B] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#C87D55]" />
                Create New Coupon
              </h3>

              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FESTIVE20"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#254A3B]/20 uppercase font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-[#254A3B]/20 bg-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Flat (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">Value</label>
                    <input
                      type="number"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-[#254A3B]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#254A3B]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#254A3B] text-white font-semibold hover:bg-[#1e3c30] transition cursor-pointer"
                >
                  Create Coupon
                </button>
              </form>
            </div>

            {/* Existing Coupons List (2 cols) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-[#EDE3D4] shadow-2xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#254A3B]">
                Active Coupons ({couponsList.length})
              </h3>

              <div className="space-y-3">
                {couponsList.map((cp) => (
                  <div
                    key={cp.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F0E6]/50 border border-[#EDE3D4] text-xs"
                  >
                    <div>
                      <span className="font-mono text-sm font-bold text-[#254A3B]">{cp.code}</span>
                      <p className="text-gray-500">
                        {cp.discountType === 'percentage' ? `${cp.discountValue}% OFF` : `₹${cp.discountValue} FLAT OFF`}
                        {cp.minOrderValue ? ` on orders above ₹${cp.minOrderValue}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-[11px]">Used {cp.usageCount} times</span>
                      <button
                        onClick={() => handleDeleteCoupon(cp.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE3D4] shadow-2xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#254A3B]">
            Store & Shipping Configurations
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Free Shipping Threshold (in ₹)
              </label>
              <input
                type="number"
                value={storeSettingsData.free_shipping_threshold}
                onChange={(e) =>
                  setStoreSettingsData({ ...storeSettingsData, free_shipping_threshold: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs"
              />
              <span className="text-[10px] text-gray-500">
                Orders equal or exceeding this amount receive free Pan-India delivery.
              </span>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Standard Shipping Fee (in ₹)
              </label>
              <input
                type="number"
                value={storeSettingsData.standard_shipping_fee}
                onChange={(e) =>
                  setStoreSettingsData({ ...storeSettingsData, standard_shipping_fee: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Cash on Delivery (COD) Available
              </label>
              <select
                value={storeSettingsData.cod_enabled}
                onChange={(e) =>
                  setStoreSettingsData({ ...storeSettingsData, cod_enabled: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs bg-white cursor-pointer"
              >
                <option value="true">Enabled (Accept COD)</option>
                <option value="false">Disabled (Online Payment Only)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Announcement Top Banner Text
              </label>
              <input
                type="text"
                value={storeSettingsData.announcement_banner}
                onChange={(e) =>
                  setStoreSettingsData({ ...storeSettingsData, announcement_banner: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Studio WhatsApp Support Number
              </label>
              <input
                type="text"
                value={storeSettingsData.whatsapp_number}
                onChange={(e) =>
                  setStoreSettingsData({ ...storeSettingsData, whatsapp_number: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#254A3B] text-white font-semibold text-xs hover:bg-[#1e3c30] transition cursor-pointer"
            >
              Save Store Settings
            </button>
          </form>

          {/* Clean Slate & Client Launch Reset */}
          <div className="pt-6 border-t border-red-100 space-y-3">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Danger Zone: Client Handover & Clean Slate</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Before handing this website over to the client or launching, you can wipe all test orders, test custom requests, and restore full initial stock levels.
            </p>
            <button
              type="button"
              onClick={handleResetOrders}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              Reset All Orders & Prepare Clean Slate for Client
            </button>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#EDE3D4] shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE3D4]">
              <h3 className="font-serif text-lg font-bold text-[#254A3B]">
                {editingProduct?.id ? 'Edit Craft Details' : 'Add New Handmade Craft'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Product Title</label>
                  <input
                    type="text"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#254A3B]/20"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">SKU</label>
                  <input
                    type="text"
                    value={editingProduct?.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#254A3B]/20 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct?.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#254A3B]/20"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Sale Price (Optional ₹)</label>
                  <input
                    type="number"
                    value={editingProduct?.salePrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#254A3B]/20"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct?.stock ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#254A3B]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct?.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#254A3B]/20"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description</label>
                <textarea
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-[#254A3B]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Materials</label>
                  <input
                    type="text"
                    value={editingProduct?.materials || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, materials: e.target.value })}
                    placeholder="e.g. 100% Cotton Yarn, Brass"
                    className="w-full px-3 py-2 rounded-xl border border-[#254A3B]/20"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Production Time</label>
                  <input
                    type="text"
                    value={editingProduct?.productionDays || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productionDays: e.target.value })}
                    placeholder="e.g. 2-3 business days"
                    className="w-full px-3 py-2 rounded-xl border border-[#254A3B]/20"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.isMadeToOrder || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isMadeToOrder: e.target.checked })}
                    className="accent-[#254A3B]"
                  />
                  <span>Made to Order</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="accent-[#254A3B]"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.isBestSeller || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="accent-[#254A3B]"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#EDE3D4] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#254A3B] text-white font-semibold hover:bg-[#1e3c30]"
                >
                  Save Craft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
