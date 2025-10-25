import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view profile');
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setUserData(response.data.data);
        setAddresses(response.data.data.addresses || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await authAPI.deleteAddress(addressId);
      toast.success('Address deleted successfully');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7E5]">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C06441]"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#F8F7E5]">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-jost">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7E5]">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-24">
        <div className="max-w-6xl mx-auto">
          {/* Profile Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2 font-suez">
                  {userData.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-700">
                  {userData.phone && (
                    <>
                      <span className="font-jost">{userData.phone}</span>
                      <span className="hidden sm:block">•</span>
                    </>
                  )}
                  <span className="font-jost">{userData.email}</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-[#F1B213] text-white text-xs rounded-full font-jost">
                    {userData.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-4 sm:mt-0">
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded-full font-medium hover:bg-red-600 transition-colors font-suez flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  LOGOUT
                </button>
              </div>
            </div>
            
            <div className="border-b border-dashed border-black"></div>
          </div>

          {/* Manage Addresses Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black font-suez">
                Manage Addresses
              </h2>
              <button
                onClick={() => navigate('/address')}
                className="bg-[#F1B213] text-white px-4 py-2 rounded-full font-medium hover:bg-[#E5A612] transition-colors font-suez flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New
              </button>
            </div>
            
            {/* Address Grid */}
            {addresses.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-black p-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-jost text-gray-600 mb-4">No addresses added yet</p>
                <button
                  onClick={() => navigate('/address')}
                  className="bg-[#F1B213] text-white px-6 py-2 rounded-full font-suez hover:bg-[#E5A612] transition-colors"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((addressItem: any) => (
                  <div 
                    key={addressItem._id}
                    className={`border-2 border-dashed p-6 rounded-none bg-transparent hover:bg-white hover:shadow-sm transition-all ${
                      addressItem.isDefault ? 'border-[#F1B213]' : 'border-black'
                    }`}
                  >
                    {addressItem.isDefault && (
                      <div className="mb-2">
                        <span className="inline-block px-2 py-1 bg-[#F1B213] text-white text-xs rounded font-jost">
                          Default
                        </span>
                      </div>
                    )}
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="h-5 w-5 text-black flex-shrink-0 mt-1" />
                      <div className="text-sm sm:text-base text-black leading-relaxed font-jost">
                        <p className="font-semibold mb-1">{addressItem.name}</p>
                        <p>{addressItem.phone}</p>
                        <p className="mt-2">
                          {addressItem.addressLine1}
                          {addressItem.addressLine2 && `, ${addressItem.addressLine2}`}
                        </p>
                        <p>
                          {addressItem.city}, {addressItem.state} - {addressItem.pincode}
                        </p>
                        <p>{addressItem.country}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <button 
                        onClick={() => handleDeleteAddress(addressItem._id)}
                        className="text-red-600 hover:text-red-700 font-medium transition-colors font-suez flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;