'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatDate } from '@/lib/utils';
import { Search, Mail, Phone, Building2, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';

const buildApiBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const normalized = raw.replace(/\/+$/, '');
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
};

const API_BASE_URL = buildApiBaseUrl();

interface Dealership {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  email: string;
  city?: string;
  state?: string;
  district?: string;
  company?: string;
  businessType?: string;
  capacityInvestment?: string;
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
}

export default function DealershipsPage() {
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [filteredDealerships, setFilteredDealerships] = useState<Dealership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealership, setSelectedDealership] = useState<Dealership | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchDealerships();
  }, []);

  useEffect(() => {
    let filtered = dealerships;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.phone.includes(searchQuery)
      );
    }

    setFilteredDealerships(filtered);
  }, [searchQuery, dealerships, statusFilter]);

  const fetchDealerships = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dealership`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setDealerships(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching dealerships:', error);
      toast.error('Failed to load dealership applications');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dealership/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status, notes }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Status updated successfully');
        fetchDealerships();
        setSelectedDealership(null);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dealership Applications</h1>
          <div className="flex items-center gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredDealerships.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No dealership applications found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Applied On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDealerships.map((dealership) => (
                    <tr key={dealership._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {dealership.firstName} {dealership.lastName}
                            </div>
                            <div className="text-sm text-gray-500">Age: {dealership.age}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 mb-1">
                            <Mail size={14} className="text-gray-400" />
                            <a href={`mailto:${dealership.email}`} className="text-blue-600 hover:underline">
                              {dealership.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone size={14} className="text-gray-400" />
                            <a href={`tel:${dealership.phone}`} className="text-gray-600">
                              {dealership.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400" />
                            <span>{dealership.city || 'N/A'}, {dealership.state || 'N/A'}</span>
                          </div>
                          {dealership.district && (
                            <div className="text-xs text-gray-500 mt-1">{dealership.district}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Building2 size={14} className="text-gray-400" />
                            <span>{dealership.company || 'N/A'}</span>
                          </div>
                          {dealership.businessType && (
                            <div className="text-xs text-gray-500 mt-1">{dealership.businessType}</div>
                          )}
                          {dealership.capacityInvestment && (
                            <div className="text-xs text-gray-500">Investment: {dealership.capacityInvestment}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(dealership.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(dealership.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedDealership(dealership)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedDealership && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Dealership Application Details
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <p><strong>Name:</strong> {selectedDealership.firstName} {selectedDealership.lastName}</p>
                    <p><strong>Age:</strong> {selectedDealership.age}</p>
                    <p><strong>Email:</strong> {selectedDealership.email}</p>
                    <p><strong>Phone:</strong> {selectedDealership.phone}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p><strong>City:</strong> {selectedDealership.city || 'N/A'}</p>
                    <p><strong>State:</strong> {selectedDealership.state || 'N/A'}</p>
                    <p><strong>District:</strong> {selectedDealership.district || 'N/A'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p><strong>Company:</strong> {selectedDealership.company || 'N/A'}</p>
                    <p><strong>Business Type:</strong> {selectedDealership.businessType || 'N/A'}</p>
                    <p><strong>Investment Capacity:</strong> {selectedDealership.capacityInvestment || 'N/A'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Update Status</h3>
                  <select
                    value={selectedDealership.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSelectedDealership({ ...selectedDealership, status: newStatus as any });
                    }}
                    className="w-full px-4 py-2 border rounded-lg mb-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <textarea
                    value={selectedDealership.notes || ''}
                    onChange={(e) => setSelectedDealership({ ...selectedDealership, notes: e.target.value })}
                    placeholder="Add notes..."
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setSelectedDealership(null)}
                    className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateStatus(selectedDealership._id, selectedDealership.status, selectedDealership.notes)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
