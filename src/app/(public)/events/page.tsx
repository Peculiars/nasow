"use client"
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Search, Filter, ArrowRight, Loader2, Star, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const NewsEventsPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: ''
  });
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'news'>('all');

  useEffect(() => {
    fetchItems();
  }, [filters.type, filters.category]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.category !== 'all') params.append('category', filters.category);
      params.append('published', 'true');
      params.append('limit', '50');

      const response = await fetch(`/api/news-events?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'all' | 'events' | 'news') => {
    setActiveTab(tab);
    setFilters(prev => ({ ...prev, type: tab === 'all' ? 'all' : tab === 'events' ? 'event' : 'news' }));
  };

  const filteredItems = items.filter(item => {
    const searchLower = filters.search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  });

  const featuredItems = filteredItems.filter(item => item.featured);
  const regularItems = filteredItems.filter(item => !item.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const CATEGORY_COLORS: Record<string, string> = {
    News: 'bg-green-100 text-green-700',
    Campaign: 'bg-purple-100 text-purple-700',
    Social: 'bg-pink-100 text-pink-700',
    Workshop: 'bg-blue-100 text-blue-700',
    Seminar: 'bg-orange-100 text-orange-700',
    Competition: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-inter">
      <div className="bg-gradient-to-br from-[#4a368f] to-[#9179E0] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
            <div className="hidden md:block size-6 bg-white" />
            <h1 className="text-4xl md:text-5xl font-bold">News & Events</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Stay updated with the latest happenings, events, and achievements in NASOWS UNILAG
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news and events..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-3 border border-gray-300 text-gray-800 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="News">News</option>
              <option value="Campaign">Campaign</option>
              <option value="Social">Social</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Competition">Competition</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'all' ? 'bg-[#9179E0] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => handleTabChange('events')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'events' ? 'bg-[#9179E0] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Events
            </button>
            <button
              onClick={() => handleTabChange('news')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'news' ? 'bg-[#9179E0] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              News
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#9179E0] animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No items found matching your criteria</p>
          </div>
        ) : (
          <>
            {featuredItems.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-[#4a368f] mb-6 flex items-center gap-2">
                  <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                  Featured
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredItems.map((item) => (
                    <Link
                      key={item._id}
                      href={`/events/${item.type}s/${item.slug}`}
                      className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#9179E0]/30 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-64 bg-gray-100 overflow-hidden">
                        <Image
                          src={item.image.url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        <div className="absolute top-4 left-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[item.category]}`}>
                            {item.category}
                          </span>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#9179E0]" />
                            <span>{formatDate(item.date)}</span>
                          </div>
                          {item.time && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-[#9179E0]" />
                              <span>{item.time}</span>
                            </div>
                          )}
                          {item.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-[#9179E0]" />
                              <span className="line-clamp-1">{item.location}</span>
                            </div>
                          )}
                          {item.maxAttendees && (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-[#9179E0]" />
                              <span>{item.attendees || 0}/{item.maxAttendees}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {item.description}
                        </p>

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.tags.slice(0, 3).map((tag: string, idx: number) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-center gap-2 w-full bg-[#9179E0]/10 hover:bg-[#9179E0] text-[#9179E0] hover:text-white font-semibold text-sm py-3 rounded-lg transition-all duration-300 group-hover:gap-3">
                          Learn More
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {regularItems.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-[#4a368f] mb-6">
                  {featuredItems.length > 0 ? 'More Updates' : 'All Updates'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularItems.map((item) => (
                    <Link
                      key={item._id}
                      href={`/events/${item.type}s/${item.slug}`}
                      className="group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#9179E0]/30 transition-all duration-300"
                    >
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <Image
                          src={item.image.url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[item.category]}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h4 className="text-lg font-bold text-[#4a368f] mb-2 line-clamp-2 group-hover:text-[#9179E0] transition-colors">
                          {item.title}
                        </h4>

                        <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#9179E0]" />
                            <span>{formatDate(item.date)}</span>
                          </div>
                          {item.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#9179E0]" />
                              <span>{item.time}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="inline-flex items-center gap-1.5 text-[#9179E0] hover:text-[#7E6BDB] font-semibold text-sm group-hover:gap-2.5 transition-all">
                          Read More
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsEventsPage;