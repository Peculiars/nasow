"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, ExternalLink, ArrowLeft, Tag, Eye, Heart, Share2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const NewsEventDetailPage = () => {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);

  useEffect(() => {
    if (params?.slug) {
      fetchItem();
    }
  }, [params?.slug]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/news-events?published=true&limit=100`);
      const data = await response.json();
      
      if (data.success) {
        const foundItem = data.data.find((i: any) => i.slug === params?.slug);
        if (foundItem) {
          setItem(foundItem);
          
          const related = data.data
            .filter((i: any) => i._id !== foundItem._id && i.category === foundItem.category)
            .slice(0, 3);
          setRelatedItems(related);
        }
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const CATEGORY_COLORS: Record<string, string> = {
    News: 'bg-green-100 text-green-700 border-green-200',
    Campaign: 'bg-purple-100 text-purple-700 border-purple-200',
    Social: 'bg-pink-100 text-pink-700 border-pink-200',
    Workshop: 'bg-blue-100 text-blue-700 border-blue-200',
    Seminar: 'bg-orange-100 text-orange-700 border-orange-200',
    Competition: 'bg-red-100 text-red-700 border-red-200'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#9179E0] animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Item Not Found</h1>
        <Link href="/events" className="flex items-center gap-2 text-[#9179E0] hover:text-[#7E6BDB] font-semibold">
          <ArrowLeft className="w-5 h-5" />
          Back to News & Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="relative h-[400px] md:h-[500px] bg-gray-900">
        <Image
          src={item.image.url}
          alt={item.title}
          fill
          className="object-cover opacity-80"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto w-full px-6 lg:px-8 pb-12">
            <Link href="/events" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to All
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${CATEGORY_COLORS[item.category]}`}>
                {item.category}
              </span>
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border-2 border-white/30">
                {item.type === 'event' ? 'Event' : 'News'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {item.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(item.date)}</span>
              </div>
              {item.time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{item.time}</span>
                </div>
              )}
              {/* <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{item.views} views</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${liked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-red-600' : ''}`} />
                    {item.likes + (liked ? 1 : 0)}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6 font-semibold">
                  {item.description}
                </p>
                
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </div>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        <Tag className="w-4 h-4" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.gallery && item.gallery.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-[#4a368f] mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {item.gallery.map((img: any, idx: number) => (
                      <div key={idx} className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={img.url}
                          alt={`Gallery ${idx + 1}`}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {item.type === 'event' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#4a368f] mb-4">Event Details</h3>
                <div className="space-y-4">
                  {item.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#9179E0] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Location</p>
                        <p className="text-gray-600">{item.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {item.maxAttendees && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-[#9179E0] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Capacity</p>
                        <p className="text-gray-600">{item.attendees || 0} / {item.maxAttendees} attendees</p>
                      </div>
                    </div>
                  )}
                  
                  {item.endDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#9179E0] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">End Date</p>
                        <p className="text-gray-600">{formatDate(item.endDate)}</p>
                      </div>
                    </div>
                  )}

                  {item.registrationDeadline && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#9179E0] flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Registration Deadline</p>
                        <p className="text-gray-600">{formatDate(item.registrationDeadline)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {item.registrationLink && (
                  <a
                    href={item.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full mt-6 px-6 py-3 bg-[#9179E0] hover:bg-[#7E6BDB] text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    Register Now
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#4a368f] mb-4">Organizer</h3>
              <div>
                <p className="font-semibold text-gray-900">{item.organizer.name}</p>
                {item.organizer.contact && (
                  <p className="text-sm text-gray-600 mt-1">{item.organizer.contact}</p>
                )}
              </div>
            </div>

            {relatedItems.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#4a368f] mb-4">Related Items</h3>
                <div className="space-y-4">
                  {relatedItems.map((related) => (
                    <Link
                      key={related._id}
                      href={`/events/${related.type}s/${related.slug}`}
                      className="group block"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={related.image.url}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[#9179E0] transition-colors">
                            {related.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(related.date)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsEventDetailPage;