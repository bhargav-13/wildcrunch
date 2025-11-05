'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Calendar, Users, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import CouponModal from '@/components/CouponModal';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/coupons');
      setCoupons(response.data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch coupons');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCoupon(null);
    setShowModal(true);
  };

  const handleEdit = (coupon: any) => {
    setSelectedCoupon(coupon);
    setShowModal(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedCoupon) {
        await api.put(`/coupons/${selectedCoupon._id}`, data);
        toast.success('Coupon updated successfully');
      } else {
        await api.post('/coupons', data);
        toast.success('Coupon created successfully');
      }
      fetchCoupons();
      setShowModal(false);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
      console.error(error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-1">Manage discount coupons and promotional codes</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Coupons</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{coupons.length}</p>
            </div>
            <Tag className="text-primary-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Coupons</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {coupons.filter((c: any) => c.isActive && !isExpired(c.validUntil)).length}
              </p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Uses</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {coupons.reduce((sum: number, c: any) => sum + (c.usageCount || 0), 0)}
              </p>
            </div>
            <Users className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {coupons.filter((c: any) => isExpired(c.validUntil)).length}
              </p>
            </div>
            <Calendar className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="card text-center py-12">
          <Tag className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No coupons yet</h3>
          <p className="text-gray-600 mb-4">Create your first coupon to offer discounts to customers</p>
          <button onClick={handleCreate} className="btn-primary">
            Create Coupon
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon: any) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Tag className="text-primary-500 mr-2" size={16} />
                        <span className="font-mono font-semibold text-gray-900">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{coupon.description}</div>
                      {coupon.minimumPurchase > 0 && (
                        <div className="text-xs text-gray-500">Min: ₹{coupon.minimumPurchase}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </div>
                      {coupon.maximumDiscount && (
                        <div className="text-xs text-gray-500">Max: ₹{coupon.maximumDiscount}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(coupon.validUntil)}</div>
                      {isExpired(coupon.validUntil) && (
                        <span className="text-xs text-red-600">Expired</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.usageCount || 0}
                        {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                      </div>
                      <div className="text-xs text-gray-500">{coupon.usedBy?.length || 0} users</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`badge ${
                          coupon.isActive && !isExpired(coupon.validUntil)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {coupon.isActive && !isExpired(coupon.validUntil) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CouponModal
          coupon={selectedCoupon}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}
