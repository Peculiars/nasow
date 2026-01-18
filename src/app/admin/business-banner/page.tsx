"use client"
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Save, Image as ImageIcon } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGlobe } from 'react-icons/fa';
import Image from 'next/image';

interface Banner {
  _id: string;
  title: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  socialLinks: {
    website?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  isActive: boolean;
  order: number;
}

const AdminBannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    website: '',
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    isActive: true,
    order: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      alert('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      website: '',
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      isActive: true,
      order: 0
    });
    setImageFile(null);
    setImagePreview('');
    setEditingBanner(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      website: banner.socialLinks.website || '',
      twitter: banner.socialLinks.twitter || '',
      facebook: banner.socialLinks.facebook || '',
      instagram: banner.socialLinks.instagram || '',
      linkedin: banner.socialLinks.linkedin || '',
      isActive: banner.isActive,
      order: banner.order
    });
    setImagePreview(banner.image.url);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('website', formData.website);
      data.append('twitter', formData.twitter);
      data.append('facebook', formData.facebook);
      data.append('instagram', formData.instagram);
      data.append('linkedin', formData.linkedin);
      data.append('isActive', String(formData.isActive));
      data.append('order', String(formData.order));

      if (imageFile) {
        data.append('image', imageFile);
      }

      let response;
      if (editingBanner) {
        data.append('bannerId', editingBanner._id);
        response = await fetch('/api/banners', {
          method: 'PUT',
          body: data
        });
      } else {
        response = await fetch('/api/banners', {
          method: 'POST',
          body: data
        });
      }

      const result = await response.json();

      if (result.success) {
        alert(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
        setShowModal(false);
        resetForm();
        fetchBanners();
      } else {
        alert(result.error || 'Failed to save banner');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/banners?id=${bannerId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        alert('Banner deleted successfully!');
        fetchBanners();
      } else {
        alert(result.error || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete banner');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#9179E0] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#4a368f] mb-2">Sponsor Banners</h1>
            <p className="text-gray-600">Manage sponsor and partner visibility banners</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#9179E0] hover:bg-[#7E6BDB] text-white rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Banner
          </button>
        </div>

        {/* Banners Grid */}
        {banners.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No banners yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={banner.image.url}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                  {!banner.isActive && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Inactive
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#4a368f] mb-2 line-clamp-1">{banner.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{banner.description}</p>
                  
                  <div className="flex gap-2 mb-4">
                    {banner.socialLinks.website && <FaGlobe className="w-4 h-4 text-gray-500" />}
                    {banner.socialLinks.twitter && <FaTwitter className="w-4 h-4 text-gray-500" />}
                    {banner.socialLinks.facebook && <FaFacebook className="w-4 h-4 text-gray-500" />}
                    {banner.socialLinks.instagram && <FaInstagram className="w-4 h-4 text-gray-500" />}
                    {banner.socialLinks.linkedin && <FaLinkedin className="w-4 h-4 text-gray-500" />}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#4a368f]">
                  {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {imagePreview ? (
                      <div className="relative h-48 mb-3">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-lg" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-8 text-gray-400">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <p>Upload banner image (1200x400 recommended)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-gray-700"
                      required={!editingBanner}
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    required
                    maxLength={100}
                    placeholder='enter heading text'
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0] h-24"
                    required
                    maxLength={300}
                    placeholder='enter more details '
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">Social Links (Optional)</h3>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Twitter/X</label>
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                      placeholder="https://twitter.com/username"
                      className="w-full px-4 py-2 border rounded-lg placeholder:text-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Facebook</label>
                    <input
                      type="url"
                      value={formData.facebook}
                      onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                      placeholder="https://facebook.com/page"
                      className="w-full px-4 py-2 border rounded-lg placeholder:text-gray-500 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Instagram</label>
                    <input
                      type="url"
                      value={formData.instagram}
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                      placeholder="https://instagram.com/username"
                      className="w-full px-4 py-2 border placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      placeholder="https://linkedin.com/company/name"
                      className="w-full px-4 py-2 border placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 placeholder:text-gray-500 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                      min={0}
                    />
                  </div>

                  <div className="flex-1 flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="w-5 h-5 text-[#9179E0] rounded focus:ring-2 focus:ring-[#9179E0]"
                      />
                      <span className="text-sm text-gray-700 font-medium">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#9179E0] hover:bg-[#7E6BDB] text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingBanner ? 'Update Banner' : 'Create Banner'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBannersPage;