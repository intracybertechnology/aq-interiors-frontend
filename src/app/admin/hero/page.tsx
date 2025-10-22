'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  Image,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { heroImageApi } from '@/services/heroImageApi';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface HeroImage {
  _id: string;
  title: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface FormData {
  title: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

const AdminHeroPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    imageUrl: '',
    order: 1,
    isActive: true
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !authLoading && !isAuthenticated) {
      router.replace('/admin/login?from=/admin/hero');
    }
  }, [isAuthenticated, authLoading, isMounted, router]);

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      fetchHeroImages();
    }
  }, [isMounted, isAuthenticated]);

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      const data = await heroImageApi.getAdminHeroImages({ page: 1, limit: 100 });
      setHeroImages(data.images || []);
    } catch (error) {
      console.error('Failed to fetch hero images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
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
      formDataUpload.append('images', file);

      const response = await fetch(`${BACKEND_URL}/api/upload/multiple`, {
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

      const imageUrl = `${BACKEND_URL}${data.data.files[0].path}`;
      setFormData(prev => ({
        ...prev,
        imageUrl
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

    if (!formData.title || !formData.imageUrl) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await heroImageApi.updateHeroImage(editingId, formData);
        alert('Hero image updated successfully');
      } else {
        await heroImageApi.createHeroImage(formData);
        alert('Hero image created successfully');
      }
      resetForm();
      fetchHeroImages();
    } catch (error) {
      console.error('Failed to save hero image:', error);
      alert('Failed to save hero image');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (image: HeroImage) => {
    setFormData({
      title: image.title,
      imageUrl: image.imageUrl,
      order: image.order,
      isActive: image.isActive
    });
    setEditingId(image._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) {
      return;
    }

    try {
      setLoading(true);
      await heroImageApi.deleteHeroImage(id);
      alert('Hero image deleted successfully');
      fetchHeroImages();
    } catch (error) {
      console.error('Failed to delete hero image:', error);
      alert('Failed to delete hero image');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (image: HeroImage) => {
    try {
      await heroImageApi.updateHeroImage(image._id, { isActive: !image.isActive });
      fetchHeroImages();
    } catch (error) {
      console.error('Failed to update image status:', error);
      alert('Failed to update image status');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = heroImages.findIndex(img => img._id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroImages.length) return;

    const reorderedImages = [...heroImages];
    [reorderedImages[index], reorderedImages[newIndex]] = [reorderedImages[newIndex], reorderedImages[index]];

    try {
      const reorderData = reorderedImages.map((img, idx) => ({
        id: img._id,
        order: idx + 1
      }));
      await heroImageApi.reorderHeroImages(reorderData);
      setHeroImages(reorderedImages);
    } catch (error) {
      console.error('Failed to reorder images:', error);
      alert('Failed to reorder images');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', imageUrl: '', order: 1, isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  if (!isMounted || authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Hero Images
          </h1>
          <p className="text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
            Manage your hero section images
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium mb-6 transition-all transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)', fontFamily: '"Lucida Bright", Georgia, serif' }}
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add New Hero Image'}
        </button>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              {editingId ? 'Edit Hero Image' : 'Add New Hero Image'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent"
                    placeholder="Enter image title"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B4F96] focus:border-transparent"
                    style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Image *
                </label>
                {formData.imageUrl && (
                  <div className="mb-4">
                    <img src={formData.imageUrl} alt="Preview" className="w-40 h-32 object-cover rounded" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit">
                  <Upload size={20} />
                  <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Active</span>
                </label>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #9B4F96 0%, #c96bb3 100%)', fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  {loading ? 'Saving...' : (editingId ? 'Update Image' : 'Create Image')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
              Hero Images ({heroImages.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#9B4F96] mx-auto mb-4" />
                <p className="text-gray-600" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                  Loading hero images...
                </p>
              </div>
            </div>
          ) : heroImages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {heroImages.map((image, index) => (
                    <tr key={image._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReorder(image._id, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <span className="w-6 text-center font-semibold">{index + 1}</span>
                          <button
                            onClick={() => handleReorder(image._id, 'down')}
                            disabled={index === heroImages.length - 1}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={image.imageUrl} alt={image.title} className="w-16 h-12 object-cover rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>{image.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(image)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: image.isActive ? '#dcfce7' : '#fee2e2',
                            color: image.isActive ? '#166534' : '#991b1b'
                          }}
                        >
                          {image.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                          {image.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(image)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(image._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500" style={{ fontFamily: '"Lucida Bright", Georgia, serif' }}>
                No hero images yet. Create one to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeroPage;