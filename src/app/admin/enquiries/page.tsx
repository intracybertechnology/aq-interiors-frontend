'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  LogOut,
  Menu,
  X,
  Trash2,
  Search,
  FileText,
  FolderKanban,
  Users
} from 'lucide-react';
import adminApiService from '@/services/adminApi';

interface Enquiry {
  _id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  serviceInterestedIn?: string;
  projectDetails?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

const AdminEnquiries = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [adminName, setAdminName] = useState('AQ Admin');

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const parsed = JSON.parse(adminInfo);
      setAdminName(parsed.name || 'AQ Admin');
    }

    fetchEnquiries();
  }, [statusFilter]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params: any = {
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await adminApiService.getEnquiries(params);
      setEnquiries(response.enquiries || []);
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    try {
      await adminApiService.updateEnquiryStatus(id, { status: newStatus });
      fetchEnquiries();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      await adminApiService.deleteEnquiry(id);
      fetchEnquiries();
    } catch (error) {
      console.error('Failed to delete enquiry:', error);
      alert('Failed to delete enquiry');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      router.push('/');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry =>
    enquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (enquiry.phoneNumber && enquiry.phoneNumber.includes(searchTerm))
  );

  const navLinks = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: false },
    { href: '/admin/enquiries', icon: Mail, label: 'Enquiries', active: true },
    { href: '/admin/blogs', icon: FileText, label: 'Blogs', active: false },
    { href: '/admin/projects', icon: FolderKanban, label: 'Projects', active: false },
    { href: '/admin/clients', icon: Users, label: 'Clients', active: false },
    { href: '/admin/hero', icon: FolderKanban, label: 'Hero Images', active: false }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b" style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)' }}>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              AQ Interiors
            </h1>
            <p className="text-sm text-white/80 mt-1" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Admin Panel
            </p>
          </div>

          <nav className="flex-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
                  link.active
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={link.active ? { backgroundColor: '#9B4F96' } : {}}
              >
                <link.icon size={20} />
                <span className="font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut size={20} />
              <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Enquiries
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  {adminName}
                </p>
                <p className="text-xs text-gray-500" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Administrator
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)' }}
              >
                {adminName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enquiries Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                All Enquiries ({filteredEnquiries.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Loading enquiries...
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEnquiries.length > 0 ? (
                      filteredEnquiries.map((enquiry) => (
                        <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{enquiry.fullName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{enquiry.emailAddress}</div>
                            <div className="text-sm text-gray-500">{enquiry.phoneNumber || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {enquiry.serviceInterestedIn || 'Not specified'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={enquiry.status}
                              onChange={(e) => handleStatusUpdate(enquiry._id, e.target.value as 'new' | 'contacted' | 'closed')}
                              className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(enquiry.status)} cursor-pointer border-0`}
                              style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDelete(enquiry._id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                          No enquiries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminEnquiries;