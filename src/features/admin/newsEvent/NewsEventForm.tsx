import { useState, useEffect } from 'react';
import { X, Upload, ImagePlus, Loader2, Calendar, MapPin, Users, Link as LinkIcon, Tag } from 'lucide-react';

interface NewsEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any;
}

const NewsEventForm = ({ isOpen, onClose, onSuccess, editData }: NewsEventFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'News',
    type: 'news',
    description: '',
    content: '',
    date: '',
    time: '',
    endDate: '',
    location: '',
    maxAttendees: '',
    registrationLink: '',
    registrationDeadline: '',
    featured: false,
    published: false,
    tags: '',
    organizerName: '',
    organizerContact: ''
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [featuredPreview, setFeaturedPreview] = useState<string>('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        category: editData.category || 'News',
        type: editData.type || 'news',
        description: editData.description || '',
        content: editData.content || '',
        date: editData.date ? new Date(editData.date).toISOString().split('T')[0] : '',
        time: editData.time || '',
        endDate: editData.endDate ? new Date(editData.endDate).toISOString().split('T')[0] : '',
        location: editData.location || '',
        maxAttendees: editData.maxAttendees?.toString() || '',
        registrationLink: editData.registrationLink || '',
        registrationDeadline: editData.registrationDeadline ? new Date(editData.registrationDeadline).toISOString().split('T')[0] : '',
        featured: editData.featured || false,
        published: editData.published || false,
        tags: editData.tags?.join(', ') || '',
        organizerName: editData.organizer?.name || '',
        organizerContact: editData.organizer?.contact || ''
      });
      setFeaturedPreview(editData.image?.url || '');
      setGalleryPreviews(editData.gallery?.map((img: any) => img.url) || []);
    }
  }, [editData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setFeaturedPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryImages(files);
    setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          submitData.append(key, value.toString());
        }
      });

      if (featuredImage) {
        submitData.append('featuredImage', featuredImage);
      }

      galleryImages.forEach(file => {
        submitData.append('gallery', file);
      });

      const url = editData 
        ? `/api/news-events/${editData._id}`
        : '/api/news-events';
      
      const method = editData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'News',
      type: 'news',
      description: '',
      content: '',
      date: '',
      time: '',
      endDate: '',
      location: '',
      maxAttendees: '',
      registrationLink: '',
      registrationDeadline: '',
      featured: false,
      published: false,
      tags: '',
      organizerName: '',
      organizerContact: ''
    });
    setFeaturedImage(null);
    setGalleryImages([]);
    setFeaturedPreview('');
    setGalleryPreviews([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#4a368f]">
            {editData ? 'Edit' : 'Create'} {formData.type === 'event' ? 'Event' : 'News'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
              <select name="type" value={formData.type} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent">
                <option value="news">News</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent">
                <option value="News">News</option>
                <option value="Campaign">Campaign</option>
                <option value="Social">Social</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Competition">Competition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required maxLength={200} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" placeholder="Enter title" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description * (500 chars max)</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required maxLength={500} rows={3} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent resize-none" placeholder="Brief description" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
            <textarea name="content" value={formData.content} onChange={handleInputChange} required rows={6} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent resize-none" placeholder="Full content" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#9179E0]" />
                Date *
              </label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" />
            </div>

            {formData.type === 'event' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                <input type="text" name="time" value={formData.time} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" placeholder="e.g., 10:00 AM" />
              </div>
            )}
          </div>

          {formData.type === 'event' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#9179E0]" />
                    Location
                  </label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" placeholder="Event location" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#9179E0]" />
                    Max Attendees
                  </label>
                  <input type="number" name="maxAttendees" value={formData.maxAttendees} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" placeholder="Optional" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Deadline</label>
                  <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#9179E0]" />
                  Registration Link
                </label>
                <input type="url" name="registrationLink" value={formData.registrationLink} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" placeholder="https://..." />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#9179E0]" />
              Tags (comma separated)
            </label>
            <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" placeholder="e.g., social work, community, education" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organizer Name *</label>
              <input type="text" name="organizerName" value={formData.organizerName} onChange={handleInputChange} required className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" placeholder="Organizer name" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organizer Contact</label>
              <input type="text" name="organizerContact" value={formData.organizerContact} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" placeholder="Email or phone" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#9179E0]" />
              Featured Image * {editData && '(Upload new to replace)'}
            </label>
            <input type="file" accept="image/*" onChange={handleFeaturedImageChange} required={!editData} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" />
            {featuredPreview && (
              <img src={featuredPreview} alt="Preview" className="mt-3 w-full h-48 object-cover rounded-lg" />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
              <ImagePlus className="w-4 h-4 text-[#9179E0]" />
              Gallery Images (Multiple) {editData && '(Upload new to replace all)'}
            </label>
            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent" />
            {galleryPreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {galleryPreviews.map((preview, idx) => (
                  <img key={idx} src={preview} alt={`Gallery ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5 text-[#9179E0] border-gray-300  rounded focus:ring-[#9179E0]" />
              <span className="text-sm font-semibold text-gray-700">Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleInputChange} className="w-5 h-5 text-[#9179E0] border-gray-300 rounded focus:ring-[#9179E0]" />
              <span className="text-sm font-semibold text-gray-700">Published</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-[#9179E0] hover:bg-[#7E6BDB] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                editData ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsEventForm;