"use client"
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Users, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const UpcomingNewsAndEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  const fetchNewsEvents = async () => {
    try {
      const response = await fetch('/api/news-events?published=true&limit=6');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch news/events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const CATEGORY_COLORS: Record<string, string> = {
    Workshop: 'bg-blue-100 text-blue-700',
    Social: 'bg-pink-100 text-pink-700',
    News: 'bg-green-100 text-green-700',
    Campaign: 'bg-purple-100 text-purple-700',
    Seminar: 'bg-orange-100 text-orange-700',
    Competition: 'bg-red-100 text-red-700'
  };

  const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';
  };

  const featuredEvents = events.filter(e => e.featured);
  const regularItems = events.filter(e => !e.featured);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white font-inter w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#9179E0] animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white font-inter w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center md:text-left mb-12">
            <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
              <div className="hidden md:block size-6 bg-green-500" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">
                Upcoming News & Events
              </h2>
            </div>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
              Stay updated with the latest happenings, events, and achievements in NASOWS UNILAG
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No upcoming events or news at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white font-inter w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center md:text-left mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
            <div className="hidden md:block size-6 bg-green-500" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">
              Upcoming News & Events
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Stay updated with the latest happenings, events, and achievements in NASOWS UNILAG
          </p>
        </div>

        {featuredEvents.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[#4a368f] mb-6">Featured Events</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredEvents.map((item) => (
                <div
                  key={item._id}
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
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
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

                    <Link
                      href={`/${item.type}s/${item.slug}`}
                      className="flex items-center justify-center gap-2 w-full bg-[#9179E0]/10 hover:bg-[#9179E0] text-[#9179E0] hover:text-white font-semibold text-sm py-3 rounded-lg transition-all duration-300 group/link"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {regularItems.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#4a368f] mb-6">More Updates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularItems.map((item) => (
                <div
                  key={item._id}
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
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
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

                    <Link
                      href={`/${item.type}s/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-[#9179E0] hover:text-[#7E6BDB] font-semibold text-sm group/link transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#9179E0] hover:bg-[#7E6BDB] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            View All Events & News
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default UpcomingNewsAndEvents;