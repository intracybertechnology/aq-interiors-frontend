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
  TrendingUp,
  MessageSquare,
  Clock,
  FileText,
  FolderKanban,
  Users
} from 'lucide-react';

import adminApiService from '@/services/adminApi';
import { clientApi } from '@/services/clientApi';

interface EnquiryData {
  id: string;
  name: string;
  email: string;
  service: string;
  status: string;
  date: string;
}

interface StatsData {
  totalEnquiries: number;
  newEnquiries: number;
  monthlyEnquiries: number;
  weeklyEnquiries: number;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalEnquiries: 0,
    newEnquiries: 0,
    monthlyEnquiries: 0,
    weeklyEnquiries: 0
  });
  const [clientStats, setClientStats] = useState({
    totalClients: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState<EnquiryData[]>([]);
  const [adminName, setAdminName] = useState('AQ Admin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const parsed = JSON.parse(adminInfo);
      setAdminName(parsed.name || 'AQ Admin');
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, enquiriesData, clientsData] = await Promise.all([
        adminApiService.getDashboardStats(),
        adminApiService.getEnquiries({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        clientApi.getClients({ limit: 1 })
      ]);

      setStats(statsData.overview);
      setClientStats({
        totalClients: clientsData.pagination.totalClients || 0
      });
      setRecentEnquiries(enquiriesData.enquiries.map((enq: any) => ({
        id: enq._id,
        name: enq.fullName,
        email: enq.emailAddress,
        service: enq.serviceInterestedIn || 'Not specified',
        status: enq.status,
        date: new Date(enq.createdAt).toLocaleDateString()
      })));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
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

  const navLinks = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { href: '/admin/enquiries', icon: Mail, label: 'Enquiries', active: false },
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
                Dashboard
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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Loading dashboard...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#9B4F96' }}>
                      <Mail className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{stats.totalEnquiries}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Total Enquiries
                  </h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-blue-500">
                      <MessageSquare className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{stats.newEnquiries}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    New Enquiries
                  </h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-green-500">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{stats.monthlyEnquiries}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    This Month
                  </h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-orange-500">
                      <Clock className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{stats.weeklyEnquiries}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    This Week
                  </h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-purple-500">
                      <Users className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{clientStats.totalClients}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Total Clients
                  </h3>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Recent Enquiries
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentEnquiries.length > 0 ? (
                        recentEnquiries.map((enquiry) => (
                          <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{enquiry.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{enquiry.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{enquiry.service}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(enquiry.status)}`}>
                                {enquiry.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {enquiry.date}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            No enquiries yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-gray-200 text-center">
                  <Link href="/admin/enquiries" className="text-sm font-medium hover:underline"
                    style={{ color: '#9B4F96', fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    View All Enquiries →
                  </Link>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;