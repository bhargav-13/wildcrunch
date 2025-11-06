'use client';

import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { X, Upload, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductModalProps {
  product?: any;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    pricing: {
      individual: {
        price: '',
        originalPrice: '',
      },
      packOf2: {
        price: '',
        originalPrice: '',
        discount: '5',
      },
      packOf4: {
        price: '',
        originalPrice: '',
        discount: '10',
      },
    },
    category: [] as string[],
    stock: '',
    weight: '',
    nutritionInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    },
    backgroundColor: '#FFFFFF',
    isActive: true,
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        ingredients: product.ingredients || '',
        pricing: {
          individual: {
            price: product.pricing?.individual?.price?.toString() || product.price?.toString() || '',
            originalPrice: product.pricing?.individual?.originalPrice?.toString() || product.originalPrice?.toString() || '',
          },
          packOf2: {
            price: product.pricing?.packOf2?.price?.toString() || '',
            originalPrice: product.pricing?.packOf2?.originalPrice?.toString() || '',
            discount: product.pricing?.packOf2?.discount?.toString() || '5',
          },
          packOf4: {
            price: product.pricing?.packOf4?.price?.toString() || '',
            originalPrice: product.pricing?.packOf4?.originalPrice?.toString() || '',
            discount: product.pricing?.packOf4?.discount?.toString() || '10',
          },
        },
        category: Array.isArray(product.category) ? product.category : (product.category ? [product.category] : []),
        stock: product.stock?.toString() || '',
        weight: product.weight?.toString() || '',
        nutritionInfo: {
          calories: product.nutritionInfo?.calories?.toString() || '',
          protein: product.nutritionInfo?.protein?.toString() || '',
          carbs: product.nutritionInfo?.carbs?.toString() || '',
          fat: product.nutritionInfo?.fat?.toString() || '',
        },
        backgroundColor: product.backgroundColor || '#FFFFFF',
        isActive: product.isActive !== false,
      });
      setImages(product.images || []);
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      // Handle nested response structure
      let categoriesData = response.data.categories || response.data.data || response.data || [];

      // Ensure it's an array
      if (!Array.isArray(categoriesData)) {
        categoriesData = [];
      }

      // Predefined categories to always show
      const predefinedCategories = ['Makhana', 'Plain Makhana', 'Protein Puffs', 'Popcorn', 'Combo'];
      
      // Merge predefined with existing categories (remove duplicates)
      const allCategories = [...new Set([...predefinedCategories, ...categoriesData])];

      setCategories(allCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to predefined categories if API fails
      setCategories(['Makhana', 'Plain Makhana', 'Protein Puffs', 'Popcorn', 'Combo']);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name.startsWith('nutrition.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        nutritionInfo: {
          ...prev.nutritionInfo,
          [field]: value,
        },
      }));
    } else if (name.startsWith('pricing.')) {
      const parts = name.split('.');
      const variant = parts[1]; // individual, packOf2, or packOf4
      const field = parts[2]; // price, originalPrice, or discount
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [variant]: {
            ...prev.pricing[variant as keyof typeof prev.pricing],
            [field]: value,
          },
        },
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (formData.category.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        ...formData,
        pricing: {
          individual: {
            price: parseFloat(formData.pricing.individual.price),
            originalPrice: formData.pricing.individual.originalPrice ? parseFloat(formData.pricing.individual.originalPrice) : 0,
          },
          packOf2: {
            price: parseFloat(formData.pricing.packOf2.price),
            originalPrice: formData.pricing.packOf2.originalPrice ? parseFloat(formData.pricing.packOf2.originalPrice) : 0,
            discount: parseFloat(formData.pricing.packOf2.discount),
          },
          packOf4: {
            price: parseFloat(formData.pricing.packOf4.price),
            originalPrice: formData.pricing.packOf4.originalPrice ? parseFloat(formData.pricing.packOf4.originalPrice) : 0,
            discount: parseFloat(formData.pricing.packOf4.discount),
          },
        },
        stock: parseInt(formData.stock),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        nutritionInfo: {
          calories: formData.nutritionInfo.calories ? parseFloat(formData.nutritionInfo.calories) : undefined,
          protein: formData.nutritionInfo.protein ? parseFloat(formData.nutritionInfo.protein) : undefined,
          carbs: formData.nutritionInfo.carbs ? parseFloat(formData.nutritionInfo.carbs) : undefined,
          fat: formData.nutritionInfo.fat ? parseFloat(formData.nutritionInfo.fat) : undefined,
        },
        backgroundColor: formData.backgroundColor,
        images,
      };

      if (product) {
        await productsAPI.update(product._id, productData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(productData);
        toast.success('Product created successfully');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="label">Product Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label mb-3">Categories * (Select one or more)</label>
              <div className="flex flex-wrap gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-white min-h-[80px]">
                {[...categories, 'Other'].map((cat) => {
                  const isSelected = formData.category.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setFormData(prev => ({ ...prev, category: prev.category.filter(c => c !== cat) }));
                        } else {
                          setFormData(prev => ({ ...prev, category: [...prev.category, cat] }));
                        }
                      }}
                      className={`
                        px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 transform hover:scale-105
                        ${isSelected
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-400 hover:text-primary-600'
                        }
                      `}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {cat}
                      </span>
                    </button>
                  );
                })}
              </div>
              {formData.category.length === 0 && (
                <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Please select at least one category</span>
                </div>
              )}
              {formData.category.length > 0 && (
                <div className="flex items-center gap-2 mt-2 text-green-600 text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{formData.category.length} {formData.category.length === 1 ? 'category' : 'categories'} selected: {formData.category.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows={4}
              required
            />
          </div>

          {/* Background Color Picker */}
          <div>
            <label htmlFor="backgroundColor" className="label">Product Background Color</label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  id="backgroundColor"
                  name="backgroundColor"
                  type="text"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  className="input font-mono"
                  placeholder="#FFFFFF"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  title="Enter a valid hex color code (e.g., #FF5733)"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <div
                  className="w-16 h-10 rounded border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: formData.backgroundColor }}
                  title="Color preview"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This color will be used as the background for the product card on the website
            </p>
          </div>

          <div>
            <label htmlFor="ingredients" className="label">Ingredients</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              className="input"
              rows={3}
              placeholder="e.g., Makhana (Fox Nuts), Rice Bran Oil, Habanero Chili Powder, Red Chili Flakes, Rock Salt, Black Pepper, Natural Spices"
            />
          </div>

          {/* Pricing Variants */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Pricing Variants</h3>
            
            {/* Individual Pricing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Individual</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pricing.individual.price" className="label">Price (₹) *</label>
                  <input
                    id="pricing.individual.price"
                    name="pricing.individual.price"
                    type="number"
                    step="0.01"
                    value={formData.pricing.individual.price}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pricing.individual.originalPrice" className="label">Original Price (₹)</label>
                  <input
                    id="pricing.individual.originalPrice"
                    name="pricing.individual.originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.pricing.individual.originalPrice}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Pack of 2 Pricing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Pack of 2</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pricing.packOf2.price" className="label">Price (₹) *</label>
                  <input
                    id="pricing.packOf2.price"
                    name="pricing.packOf2.price"
                    type="number"
                    step="0.01"
                    value={formData.pricing.packOf2.price}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pricing.packOf2.originalPrice" className="label">Original Price (₹)</label>
                  <input
                    id="pricing.packOf2.originalPrice"
                    name="pricing.packOf2.originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.pricing.packOf2.originalPrice}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="pricing.packOf2.discount" className="label">Discount (%)</label>
                  <input
                    id="pricing.packOf2.discount"
                    name="pricing.packOf2.discount"
                    type="number"
                    step="0.01"
                    value={formData.pricing.packOf2.discount}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Pack of 4 Pricing */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Pack of 4</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="pricing.packOf4.price" className="label">Price (₹) *</label>
                  <input
                    id="pricing.packOf4.price"
                    name="pricing.packOf4.price"
                    type="number"
                    step="0.01"
                    value={formData.pricing.packOf4.price}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pricing.packOf4.originalPrice" className="label">Original Price (₹)</label>
                  <input
                    id="pricing.packOf4.originalPrice"
                    name="pricing.packOf4.originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.pricing.packOf4.originalPrice}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="pricing.packOf4.discount" className="label">Discount (%)</label>
                  <input
                    id="pricing.packOf4.discount"
                    name="pricing.packOf4.discount"
                    type="number"
                    step="0.01"
                    value={formData.pricing.packOf4.discount}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="label">Stock *</label>
            <input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label htmlFor="weight" className="label">Weight (g)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="nutrition.calories" className="label">Calories</label>
              <input
                id="nutrition.calories"
                name="nutrition.calories"
                type="number"
                value={formData.nutritionInfo.calories}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="nutrition.protein" className="label">Protein (g)</label>
              <input
                id="nutrition.protein"
                name="nutrition.protein"
                type="number"
                step="0.1"
                value={formData.nutritionInfo.protein}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="nutrition.carbs" className="label">Carbs (g)</label>
              <input
                id="nutrition.carbs"
                name="nutrition.carbs"
                type="number"
                step="0.1"
                value={formData.nutritionInfo.carbs}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="nutrition.fat" className="label">Fat (g)</label>
              <input
                id="nutrition.fat"
                name="nutrition.fat"
                type="number"
                step="0.1"
                value={formData.nutritionInfo.fat}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="label">Product Images *</label>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <span className="absolute -bottom-6 left-0 text-xs text-blue-600 font-medium">
                        Main
                      </span>
                    )}
                  </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                  {uploading ? (
                    <Loader className="animate-spin text-primary-500" size={24} />
                  ) : (
                    <>
                      <Upload className="text-gray-400" size={24} />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 italic">
                Max 5MB per image. Supports JPG, PNG, WebP. See IMAGE_GUIDELINES.md for details.
              </p>
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
              Active (visible to customers)
            </label>
          </div>

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
              disabled={isSubmitting || uploading}
            >
              {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
