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
  Search,
  Edit,
  Trash2,
  Plus,
  FileText,
  FolderKanban,
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { projectApi } from '@/services/projectApi';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  location?: string;
  year?: string;
  createdAt?: string;
}

export default function AdminProjects() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [adminName, setAdminName] = useState('AQ Admin');

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const parsed = JSON.parse(adminInfo);
      setAdminName(parsed.name || 'AQ Admin');
    }
    fetchProjects();
  }, [categoryFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 100
      };

      if (categoryFilter !== 'All') {
        params.category = categoryFilter;
      }

      const data = await projectApi.getProjects(params);
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      alert('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Authentication required');
        return;
      }

      await projectApi.deleteProject(id, token);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      router.push('/');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [
    'All',
    'Food & Beverage',
    'Retail Fashion',
    'Electronics Retail',
    'Exhibition',
    'Custom Fixtures',
    'Service Center',
    'Office Interior',
    'Healthcare',
    'Hospitality'
  ];

  const navLinks = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', active: false },
    { href: '/admin/enquiries', icon: Mail, label: 'Enquiries', active: false },
    { href: '/admin/blogs', icon: FileText, label: 'Blogs', active: false },
    { href: '/admin/projects', icon: FolderKanban, label: 'Projects', active: true },
    { href: '/admin/clients', icon: Users, label: 'Clients', active: false },
    { href: '/admin/hero', icon: ImageIcon, label: 'Hero Images', active: false }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
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
            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
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
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                Projects
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
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)' }}>
                {adminName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Link
                  href="/admin/projects/new"
                  className="flex items-center space-x-2 px-6 py-2 rounded-lg text-white font-medium transition-all transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)', fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  <Plus size={20} />
                  <span>Create Project</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                All Projects ({filteredProjects.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Loading projects...
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {project.images && project.images.length > 0 ? (
                              <img src={project.images[0]} alt={project.title} className="w-16 h-16 object-cover rounded" />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <FolderKanban size={24} className="text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 max-w-xs truncate">{project.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                              {project.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {project.location || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {project.year || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(project.id, project.title)}
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
                          No projects found
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
}