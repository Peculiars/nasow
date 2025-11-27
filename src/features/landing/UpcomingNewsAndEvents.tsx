import { Calendar, Clock, MapPin, ArrowRight, Users, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const UpcomingNewsAndEvents = () => {
  const events = [
    {
      id: 1,
      title: "Annual Career Development Workshop",
      category: "Workshop",
      date: "2025-12-15",
      time: "10:00 AM",
      location: "Social Work Auditorium, UNILAG",
      image: "/assets/img-car-3.png",
      attendees: 120,
      description: "Join industry professionals for insights on career paths in social work, resume building, and interview preparation.",
      featured: true,
      type: "event"
    },
    {
      id: 2,
      title: "NASOWS End of Year Gala Night",
      category: "Social",
      date: "2025-12-20",
      time: "6:00 PM",
      location: "Great Hall, UNILAG",
      image: "/assets/img-car-3.png",
      attendees: 300,
      description: "Celebrate the year's achievements with music, awards, and networking in an elegant evening of recognition.",
      featured: true,
      type: "event"
    },
    {
      id: 3,
      title: "Community Outreach Program Success",
      category: "News",
      date: "2025-11-25",
      location: "Makoko Community",
      image: "/assets/img-car-3.png",
      description: "NASOWS members successfully conducted health awareness campaign reaching over 500 community members.",
      type: "news"
    },
    {
      id: 4,
      title: "Mental Health Awareness Week",
      category: "Campaign",
      date: "2025-12-10",
      time: "9:00 AM",
      location: "UNILAG Campus Wide",
      image: "/assets/img-car-3.png",
      attendees: 200,
      description: "Week-long activities promoting mental wellness including seminars, therapy sessions, and peer support groups.",
      type: "event"
    },
    {
      id: 5,
      title: "New Partnership with UNICEF Announced",
      category: "News",
      date: "2025-11-20",
      location: "NASOWS Office",
      image: "/assets/img-car-3.png",
      description: "Exciting collaboration to provide internship opportunities and training programs for social work students.",
      type: "news"
    },
    {
      id: 6,
      title: "Freshers' Orientation & Welcome Party",
      category: "Social",
      date: "2025-12-05",
      time: "2:00 PM",
      location: "Faculty of Social Sciences",
      image: "/assets/img-car-3.png",
      attendees: 150,
      description: "Welcome new students to the NASOWS family with orientation sessions and an exciting welcome party.",
      type: "event"
    }
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const CATEGORY_COLORS = {
    Workshop: "bg-blue-100 text-blue-700",
    Social: "bg-pink-100 text-pink-700",
    News: "bg-green-100 text-green-700",
    Campaign: "bg-purple-100 text-purple-700"
  } as const;

  const getCategoryColor = (category: string): string => {
    return (CATEGORY_COLORS as Record<string, string>)[category] || "bg-gray-100 text-gray-700";
  };

  const featuredEvents = events.filter(e => e.featured);
  const regularItems = events.filter(e => !e.featured);

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

        {/* Featured Events Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[#4a368f] mb-6">Featured Events</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredEvents.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#9179E0]/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image}
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
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#9179E0]" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                    {item.attendees && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#9179E0]" />
                        <span>{item.attendees} Expected</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <Link
                    href={`/${item.type}s/${item.id}`}
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

        {/* Regular Items Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-[#4a368f] mb-6">More Updates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#9179E0]/30 transition-all duration-300"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image}
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
                    href={`/${item.type}s/${item.id}`}
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

        {/* View All Button */}
        <div className="text-center mb-16">
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#9179E0] hover:bg-[#7E6BDB] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            View All Events & News
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-br from-[#4a368f] to-[#9179E0] rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Don't Miss Out on Any Event!
                </h3>
                <p className="text-lg text-white/90 leading-relaxed mb-6">
                  Subscribe to our newsletter and get notified about upcoming events, news, and important announcements from NASOWS UNILAG.
                </p>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4a368f] rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Subscribe Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold mb-1">30+</p>
                  <p className="text-sm text-white/80">Events This Year</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold mb-1">1000+</p>
                  <p className="text-sm text-white/80">Total Participants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingNewsAndEvents;