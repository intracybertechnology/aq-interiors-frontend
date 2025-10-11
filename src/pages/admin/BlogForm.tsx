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
} from 'lucide-react';
import { blogApi } from '../../services/blogApi';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');



const AdminBlogForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [adminName, setAdminName] = useState('AQ Admin');
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: 'AQ Design Team',
        category: 'Design Trends',
        tags: '',
        readTime: '5 min read',
        featured: false,
        isPublished: true
    });

    useEffect(() => {
        const adminInfo = localStorage.getItem('adminInfo');
        if (adminInfo) {
            const parsed = JSON.parse(adminInfo);
            setAdminName(parsed.name || 'AQ Admin');
        }

        if (isEdit && id) {
            fetchBlog();
        }
    }, [id, isEdit]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const blog = await blogApi.getBlogById(id!);
            setFormData({
                title: blog.title,
                excerpt: blog.excerpt,
                content: blog.content,
                author: blog.author,
                category: blog.category,
                tags: blog.tags.join(', '),
                readTime: blog.readTime,
                featured: blog.featured,
                isPublished: blog.isPublished
            });
            const imageUrl = blog.image.startsWith('http')
                ? blog.image
                : `${BASE_URL}${blog.image}`;
            setImagePreview(imageUrl);
        } catch (error) {
            console.error('Failed to fetch blog:', error);
            alert('Failed to load blog');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Store the file
        setImageFile(file);

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.excerpt || !formData.content) {
            alert('Please fill all required fields');
            return;
        }

        if (!isEdit && !imageFile) {
            alert('Please select an image');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            if (!token) {
                alert('Authentication required');
                return;
            }

            // Create FormData
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('excerpt', formData.excerpt);
            submitData.append('content', formData.content);
            submitData.append('author', formData.author);
            submitData.append('category', formData.category);
            submitData.append('readTime', formData.readTime);
            submitData.append('featured', String(formData.featured));
            submitData.append('isPublished', String(formData.isPublished));

            // Add tags
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            submitData.append('tags', JSON.stringify(tagsArray));

            // Add image file if selected
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (isEdit && id) {
                await blogApi.updateBlog(id, submitData, token);
                alert('Blog updated successfully');
            } else {
                await blogApi.createBlog(submitData, token);
                alert('Blog created successfully');
            }

            navigate('/admin/blogs');
        } catch (error: any) {
            console.error('Failed to save blog:', error);
            alert(error.message || 'Failed to save blog');
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

    const categories = ['Design Trends', 'Tips & Guides', 'Retail Design', 'Sustainability', 'Office Design'];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
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
                        <Link to="/admin/blogs" className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mt-2" style={{ backgroundColor: '#9B4F96', color: 'white' }}>
                            <FileText size={20} />
                            <span className="font-medium" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Blogs</span>
                        </Link>
                        <Link to="/admin/projects" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors mt-2 text-gray-700">
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                                {isEdit ? 'Edit Blog' : 'Create Blog'}
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
                        <Link to="/admin/blogs" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6">
                            <ArrowLeft size={20} />
                            <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Back to Blogs</span>
                        </Link>

                        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        maxLength={300}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter blog title"
                                        style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Excerpt *</label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        required
                                        maxLength={500}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        placeholder="Short description (max 500 characters)"
                                        style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Content *</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        required
                                        rows={12}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        placeholder="Write your blog content here..."
                                        style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                                        Cover Image * {!isEdit && '(Required)'}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                            <Upload size={20} />
                                            <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                                                {imageFile ? 'Change Image' : 'Upload Image'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {imagePreview && (
                                            <div className="flex items-center gap-2">
                                                <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                                                <span className="text-sm text-green-600">✓ Image ready</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Author</label>
                                        <input
                                            type="text"
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Category</label>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Read Time</label>
                                        <input
                                            type="text"
                                            value={formData.readTime}
                                            onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                            placeholder="e.g., 5 min read"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="interior, design, tips"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Featured Blog</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isPublished}
                                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Publish Immediately</span>
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-6 border-t">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)', fontFamily: '"Lucida Bright", Georgia, serif' }}
                                    >
                                        <Save size={20} />
                                        <span>{loading ? 'Saving...' : (isEdit ? 'Update Blog' : 'Create Blog')}</span>
                                    </button>
                                    <Link
                                        to="/admin/blogs"
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

export default AdminBlogForm;