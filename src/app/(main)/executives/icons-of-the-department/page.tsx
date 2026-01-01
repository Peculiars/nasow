"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Instagram, Linkedin, Twitter, Facebook, Award, Users, Target, Heart, Loader2, X, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Icon {
  _id: string;
  name: string;
  position: string;
  level: string;
  image: {
    url: string;
    publicId: string;
  };
  bio: string;
  email: string;
  phone: string;
  socialMedia: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  achievements: string[];
  responsibilities: string[];
  order: number;
  session: string;
}

export default function IconsPage() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/executives/inactive');
      
      if (!response.ok) {
        throw new Error('Failed to fetch icons');
      }

      const data = await response.json();
      setIcons(data.data);
    } catch (error) {
      console.error('Error fetching icons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Hero Section */}
      <section className="relative h-[350px] md:h-[450px] bg-gradient-to-br from-[#4a368f] to-[#9179E0] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] bg-repeat opacity-20" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Icons of the Department
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Honoring the legendary past executives who built our legacy of excellence
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              These are the pioneers and visionaries — the Icons of our Department. Former executives whose leadership, dedication, and innovation continue to inspire generations of students. Their contributions have shaped our identity and set the standard for excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Icons Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading legendary icons...</p>
            </div>
          ) : icons.length === 0 ? (
            <div className="text-center py-20">
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Icons Listed Yet</h3>
              <p className="text-gray-600">The hall of legends will be unveiled soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {icons.map((icon) => (
                <div
                  key={icon._id}
                  className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#9179E0]/40 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedIcon(icon)}
                >
                  <div className="relative h-80 bg-gray-100 overflow-hidden">
                    <Image
                      src={icon.image.url}
                      alt={icon.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a368f]/90 via-[#4a368f]/30 to-transparent" />
                    
                    {/* Past Executive Badge */}
                    <div className="absolute top-4 right-4 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      PAST ICON
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{icon.name}</h3>
                      <p className="text-lg font-semibold text-white/90">{icon.position}</p>
                      <p className="text-sm text-white/70">{icon.session} • {icon.level}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {icon.bio}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Link
                        href={`mailto:${icon.email}`}
                        className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`tel:${icon.phone}`}
                        className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-4 h-4" />
                      </Link>
                      {icon.socialMedia.instagram && (
                        <Link
                          href={`https://instagram.com/${icon.socialMedia.instagram.replace('@', '')}`}
                          target="_blank"
                          className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Instagram className="w-4 h-4" />
                        </Link>
                      )}
                      {icon.socialMedia.linkedin && (
                        <Link
                          href={`https://linkedin.com/in/${icon.socialMedia.linkedin}`}
                          target="_blank"
                          className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="w-4 h-4" />
                        </Link>
                      )}
                      {icon.socialMedia.twitter && (
                        <Link
                          href={`https://twitter.com/${icon.socialMedia.twitter.replace('@', '')}`}
                          target="_blank"
                          className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Twitter className="w-4 h-4" />
                        </Link>
                      )}
                    </div>

                    <button className="w-full py-2.5 bg-[#9179E0]/10 hover:bg-[#9179E0] text-[#9179E0] hover:text-white rounded-lg font-semibold text-sm transition-all duration-300">
                      View Legacy Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Legacy Principles */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a368f] mb-4">
              The Enduring Legacy Principles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Values upheld by our Icons that continue to guide us today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Service</h4>
              <p className="text-gray-600 text-sm">Selfless dedication to the community</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Unity</h4>
              <p className="text-gray-600 text-sm">Bringing people together for progress</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Excellence</h4>
              <p className="text-gray-600 text-sm">Raising the bar in leadership</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Legacy</h4>
              <p className="text-gray-600 text-sm">Building something that lasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal - Icon Profile */}
      {selectedIcon && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIcon(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Icon Profile</h3>
                <p className="text-sm text-gray-600 mt-1">Past Executive • {selectedIcon.session}</p>
              </div>
              <button
                onClick={() => setSelectedIcon(null)}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="size-4"/>
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="relative w-full md:w-48 h-64 rounded-xl overflow-hidden flex-shrink-0 border-4 border-[#9179E0]/20">
                  <Image
                    src={selectedIcon.image.url}
                    alt={selectedIcon.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-3xl font-bold text-gray-900 mb-2">{selectedIcon.name}</h4>
                  <p className="text-xl text-[#9179E0] font-semibold mb-1">{selectedIcon.position}</p>
                  <p className="text-gray-600 mb-4">{selectedIcon.level} • Session {selectedIcon.session}</p>
                  <p className="text-gray-700 leading-relaxed">{selectedIcon.bio}</p>
                </div>
              </div>

              <div className="space-y-6">
                {selectedIcon.achievements.length > 0 && (
                  <div>
                    <h5 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#9179E0]" />
                      Landmark Achievements
                    </h5>
                    <ul className="space-y-2">
                      {selectedIcon.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedIcon.responsibilities.length > 0 && (
                  <div>
                    <h5 className="text-lg font-bold text-gray-900 mb-3">Key Responsibilities Held</h5>
                    <ul className="space-y-2">
                      {selectedIcon.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h5 className="text-lg font-bold text-gray-900 mb-3">Connect & Learn More</h5>
                  <div className="space-y-3">
                    <Link href={`mailto:${selectedIcon.email}`} className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors">
                      <Mail className="w-5 h-5" />
                      <span>{selectedIcon.email}</span>
                    </Link>
                    <Link href={`tel:${selectedIcon.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors">
                      <Phone className="w-5 h-5" />
                      <span>{selectedIcon.phone}</span>
                    </Link>
                    {selectedIcon.socialMedia.instagram && (
                      <Link href={`https://instagram.com/${selectedIcon.socialMedia.instagram.replace('@', '')}`} target="_blank" className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors">
                        <Instagram className="w-5 h-5" />
                        <span>{selectedIcon.socialMedia.instagram}</span>
                      </Link>
                    )}
                    {selectedIcon.socialMedia.linkedin && (
                      <Link href={`https://linkedin.com/in/${selectedIcon.socialMedia.linkedin}`} target="_blank" className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors">
                        <Linkedin className="w-5 h-5" />
                        <span>{selectedIcon.socialMedia.linkedin}</span>
                      </Link>
                    )}
                    {selectedIcon.socialMedia.twitter && (
                      <Link href={`https://twitter.com/${selectedIcon.socialMedia.twitter.replace('@', '')}`} target="_blank" className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors">
                        <Twitter className="w-5 h-5" />
                        <span>{selectedIcon.socialMedia.twitter}</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}