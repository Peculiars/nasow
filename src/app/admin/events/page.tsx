"use client"
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Calendar, MapPin, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import NewsEventForm from '@/src/features/admin/newsEvent/NewsEventForm';

const AdminNewsEventsPage = () => {
  const [newsEvents, setNewsEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: ''
  });

  useEffect(() => {
    fetchNewsEvents();
  }, [filters.type, filters.category]);

  const fetchNewsEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.category !== 'all') params.append('category', filters.category);
      params.append('limit', '100');

      const response = await fetch(`/api/news-events?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setNewsEvents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/news-events/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchNewsEvents();
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      alert('Error deleting item');
    }
  };

  const handleEdit = (item: any) => {
    setEditData(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditData(null);
  };

  const filteredNewsEvents = newsEvents.filter(item => {
    const searchLower = filters.search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#4a368f]">News & Events</h1>
            <p className="text-gray-600 mt-1">Manage all news and events</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#9179E0] hover:bg-[#7E6BDB] text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
              />
            </div>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="news">News Only</option>
              <option value="event">Events Only</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="News">News</option>
              <option value="Campaign">Campaign</option>
              <option value="Social">Social</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Competition">Competition</option>
            </select>

            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="w-5 h-5" />
              <span className="font-semibold">{filteredNewsEvents.length} Results</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#9179E0] animate-spin" />
          </div>
        ) : filteredNewsEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No news or events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNewsEvents.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <Image
                    src={item.image.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-[#9179E0]">
                      {item.type.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                      {item.category}
                    </span>
                  </div>

                  {item.featured && (
                    <div className="absolute top-3 right-3">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#9179E0]" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#9179E0]" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#9179E0]" />
                      <span>{item.views} views</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                    {item.gallery && item.gallery.length > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                        {item.gallery.length} photos
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#9179E0]/10 hover:bg-[#9179E0]/20 text-[#9179E0] font-semibold rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors"
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
      </div>

      <NewsEventForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={fetchNewsEvents}
        editData={editData}
      />
    </div>
  );
};

export default AdminNewsEventsPage;