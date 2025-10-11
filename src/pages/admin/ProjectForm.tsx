import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  Trash2
} from 'lucide-react';
import { projectApi } from '../../services/projectApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState('AQ Admin');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'Food & Beverage',
    description: '',
    location: '',
    year: new Date().getFullYear().toString(),
    images: [] as string[]
  });

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const parsed = JSON.parse(adminInfo);
      setAdminName(parsed.name || 'AQ Admin');
    }

    if (isEdit && id) {
      fetchProject();
    }
  }, [id, isEdit]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const project = await projectApi.getProjectById(id!);
      setFormData({
        id: project.id,
        title: project.title,
        category: project.category,
        description: project.description,
        location: project.location || '',
        year: project.year || new Date().getFullYear().toString(),
        images: project.images || []
      });
    } catch (error) {
      console.error('Failed to fetch project:', error);
      alert('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select image files');
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
      imageFiles.forEach(file => {
        formDataUpload.append('images', file);
      });

      const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
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

      const imageUrls = data.data.files.map((file: any) => 
        `${API_BASE_URL.replace('/api', '')}${file.path}`
      );
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || formData.images.length === 0) {
      alert('Please fill all required fields and upload at least one image');
      return;
    }

    if (!isEdit && !formData.id) {
      alert('Project ID is required');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const projectData = {
        id: formData.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        year: formData.year,
        images: formData.images
      };

      if (isEdit && id) {
        await projectApi.updateProject(id, projectData, token);
        alert('Project updated successfully');
      } else {
        await projectApi.createProject(projectData, token);
        alert('Project created successfully');
      }

      navigate('/admin/projects');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/');
    }
  };

  const categories = [
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

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b" style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)' }}>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>AQ Interiors</h1>
            <p className="text-sm text-white/80 mt-1" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Admin Panel</p>
          </div>

          <nav className="flex-1 p-4">
            <Link to="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
              <LayoutDashboard size={20} />
              <span className="font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Dashboard</span>
            </Link>
            <Link to="/admin/enquiries" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors mt-2 text-gray-700">
              <Mail size={20} />
              <span className="font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Enquiries</span>
            </Link>
            <Link to="/admin/blogs" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors mt-2 text-gray-700">
              <FileText size={20} />
              <span className="font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Blogs</span>
            </Link>
            <Link to="/admin/projects" className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mt-2" style={{ backgroundColor: '#9B4F96', color: 'white' }}>
              <FolderKanban size={20} />
              <span className="font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Projects</span>
            </Link>
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
                {isEdit ? 'Edit Project' : 'Create Project'}
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
            <Link to="/admin/projects" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft size={20} />
              <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Back to Projects</span>
            </Link>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Project ID *</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                      disabled={isEdit}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="e.g., project-001"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Project Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    maxLength={200}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter project title"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    maxLength={1000}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Describe the project..."
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Dubai, UAE"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Year</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 2024"
                      style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Project Images * (Upload multiple)</label>
                  <div className="mb-4">
                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit">
                      <Upload size={20} />
                      <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{uploading ? 'Uploading...' : 'Upload Images'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img src={image} alt={`Project ${index + 1}`} className="w-full h-32 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)', fontFamily: '"Lucida Bright", Georgia, serif' }}
                  >
                    <Save size={20} />
                    <span>{loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}</span>
                  </button>
                  <Link
                    to="/admin/projects"
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
};

export default AdminProjectForm;