'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CouponModalProps {
  coupon?: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function CouponModal({ coupon, onClose, onSave }: CouponModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumPurchase: '',
    maximumDiscount: '',
    usageLimit: '',
    perUserLimit: '1',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        description: coupon.description || '',
        discountType: coupon.discountType || 'percentage',
        discountValue: coupon.discountValue?.toString() || '',
        minimumPurchase: coupon.minimumPurchase?.toString() || '',
        maximumDiscount: coupon.maximumDiscount?.toString() || '',
        usageLimit: coupon.usageLimit?.toString() || '',
        perUserLimit: coupon.perUserLimit?.toString() || '1',
        validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
        isActive: coupon.isActive !== false,
      });
    }
  }, [coupon]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.description || !formData.discountValue || !formData.validUntil) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.discountValue) <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }

    if (formData.discountType === 'percentage' && parseFloat(formData.discountValue) > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    setIsSubmitting(true);
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minimumPurchase: formData.minimumPurchase ? parseFloat(formData.minimumPurchase) : 0,
        maximumDiscount: formData.maximumDiscount ? parseFloat(formData.maximumDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        perUserLimit: parseInt(formData.perUserLimit) || 1,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        isActive: formData.isActive,
      };

      await onSave(couponData);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save coupon');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {coupon ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Coupon Code */}
          <div>
            <label htmlFor="code" className="label">Coupon Code *</label>
            <input
              id="code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
              className="input uppercase"
              placeholder="SUMMER50"
              required
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1">Code will be converted to uppercase</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows={2}
              placeholder="Get 50% off on all products"
              required
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountType" className="label">Discount Type *</label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label htmlFor="discountValue" className="label">
                Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                id="discountValue"
                name="discountValue"
                type="number"
                step="0.01"
                value={formData.discountValue}
                onChange={handleChange}
                className="input"
                placeholder={formData.discountType === 'percentage' ? '50' : '100'}
                required
                min="0"
                max={formData.discountType === 'percentage' ? '100' : undefined}
              />
            </div>
          </div>

          {/* Min Purchase & Max Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="minimumPurchase" className="label">Minimum Purchase (₹)</label>
              <input
                id="minimumPurchase"
                name="minimumPurchase"
                type="number"
                step="0.01"
                value={formData.minimumPurchase}
                onChange={handleChange}
                className="input"
                placeholder="0"
                min="0"
              />
            </div>

            {formData.discountType === 'percentage' && (
              <div>
                <label htmlFor="maximumDiscount" className="label">Maximum Discount (₹)</label>
                <input
                  id="maximumDiscount"
                  name="maximumDiscount"
                  type="number"
                  step="0.01"
                  value={formData.maximumDiscount}
                  onChange={handleChange}
                  className="input"
                  placeholder="No limit"
                  min="0"
                />
              </div>
            )}
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="usageLimit" className="label">Total Usage Limit</label>
              <input
                id="usageLimit"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleChange}
                className="input"
                placeholder="Unlimited"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
            </div>

            <div>
              <label htmlFor="perUserLimit" className="label">Per User Limit *</label>
              <input
                id="perUserLimit"
                name="perUserLimit"
                type="number"
                value={formData.perUserLimit}
                onChange={handleChange}
                className="input"
                placeholder="1"
                required
                min="1"
              />
            </div>
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="validFrom" className="label">Valid From *</label>
              <input
                id="validFrom"
                name="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="validUntil" className="label">Valid Until *</label>
              <input
                id="validUntil"
                name="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
              Active (visible and usable by customers)
            </label>
          </div>

          {/* Usage Info (if editing) */}
          {coupon && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Usage Statistics</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Total uses: {coupon.usageCount || 0}</p>
                <p>Unique users: {coupon.usedBy?.length || 0}</p>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : coupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
