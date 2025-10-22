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
  FileText,
  FolderKanban,
  Save,
  ArrowLeft,
  Upload,
  Users
} from 'lucide-react';
import { clientApi } from '@/services/clientApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NewClientPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState('AQ Admin');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    logo: '',
    location: '',
    category: 'Healthcare'
  });

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const parsed = JSON.parse(adminInfo);
      setAdminName(parsed.name || 'AQ Admin');
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload/single`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      const imageUrl = `${API_BASE_URL.replace('/api', '')}${data.data.path}`;
      
      setFormData(prev => ({
        ...prev,
        logo: imageUrl
      }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.category) {
      alert('Please fill all required fields');
      return;
    }

    if (!formData.id) {
      alert('Client ID is required');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const clientData = {
        id: formData.id,
        name: formData.name,
        logo: formData.logo,
        location: formData.location,
        category: formData.category
      };

      await clientApi.createClient(clientData, token);
      alert('Client created successfully');
      router.push('/admin/clients');
    } catch (error) {
      console.error('Failed to save client:', error);
      alert('Failed to save client');
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

  const categories = [
    'Healthcare',
    'Retail',
    'Services',
    'Technology',
    'Sports',
    'Fashion',
    'Automotive',
    'Food & Beverage',
    'Electronics',
    'Hospitality'
  ];

  const navLinks = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: false },
    { href: '/admin/enquiries', icon: Mail, label: 'Enquiries', active: false },
    { href: '/admin/blogs', icon: FileText, label: 'Blogs', active: false },
    { href: '/admin/projects', icon: FolderKanban, label: 'Projects', active: false },
    { href: '/admin/clients', icon: Users, label: 'Clients', active: true },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b" style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)' }}>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>AQ Interiors</h1>
            <p className="text-sm text-white/80 mt-1" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Admin Panel</p>
          </div>

          <nav className="flex-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
                  link.active ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
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
            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
              <LogOut size={20} />
              <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Add Client
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{adminName}</p>
                <p className="text-xs text-gray-500" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)' }}>
                {adminName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/admin/clients" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft size={20} />
              <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Back to Clients</span>
            </Link>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Client ID *</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., client-001"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Client Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    maxLength={200}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter client name"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Dubai, UAE"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Client Logo</label>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit">
                      <Upload size={20} />
                      <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>

                    {formData.logo && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Current Logo:</p>
                        <img src={formData.logo} alt="Client Logo" className="w-32 h-32 object-contain border border-gray-200 rounded p-2" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)', fontFamily: '"Lucida Bright", Georgia, serif' }}
                  >
                    <Save size={20} />
                    <span>{loading ? 'Saving...' : 'Add Client'}</span>
                  </button>
                  <Link
                    href="/admin/clients"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}