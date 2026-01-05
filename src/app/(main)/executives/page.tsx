"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Instagram, Linkedin, Twitter, Facebook, Users, Heart, Target, Award, Loader2, } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Executive {
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

export default function ExecutivesPage() {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState("2024/2025");

  useEffect(() => {
    fetchExecutives();
  }, []);

  const fetchExecutives = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/executives");

      if (!response.ok) {
        throw new Error("Failed to fetch executives");
      }

      const data = await response.json();
      setExecutives(data.data || []);
      if (data.session) setCurrentSession(data.session);
    } catch (error) {
      console.error("Error fetching executives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <section className="relative h-[350px] md:h-[450px] bg-gradient-to-br from-[#4a368f] to-[#9179E0] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] bg-repeat opacity-20" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Meet The {currentSession} Executive Team
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Dedicated student leaders committed to excellence, service, and unity
            </p>
          </div>
        </div>
      </section>


      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              Our executive team comprises passionate and dedicated individuals who have been elected to serve the NASOWS community with integrity, transparency, and commitment. Each executive brings unique skills, experiences, and perspectives that drive our mission forward.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading executives...</p>
            </div>
          ) : executives.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Executives Found</h3>
              <p className="text-gray-600">Executive team information will be available soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {executives.map((exec) => (
                <div
                  key={exec._id}
                  className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#9179E0]/30 transition-all duration-300"
                >
                  <div className="relative h-80 bg-gray-100 overflow-hidden">
                    <Image
                      src={exec.image.url}
                      alt={exec.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a368f]/90 via-[#4a368f]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{exec.name}</h3>
                      <p className="text-lg font-semibold text-white/90">{exec.position}</p>
                      <p className="text-sm text-white/70">{exec.level}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {exec.bio}
                    </p>

                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                      <Link
                        href={`mailto:${exec.email}`}
                        className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`tel:${exec.phone}`}
                        className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-4 h-4" />
                      </Link>
                      {exec.socialMedia?.instagram && (
                        <Link
                          href={`https://instagram.com/${exec.socialMedia.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Instagram className="w-4 h-4" />
                        </Link>
                      )}
                      {exec.socialMedia?.linkedin && (
                        <Link
                          href={`https://linkedin.com/in/${exec.socialMedia.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="w-4 h-4" />
                        </Link>
                      )}
                      {exec.socialMedia?.twitter && (
                        <Link
                          href={`https://twitter.com/${exec.socialMedia.twitter.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Twitter className="w-4 h-4" />
                        </Link>
                      )}
                      {exec.socialMedia?.facebook && (
                        <Link
                          href={`https://facebook.com/${exec.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-gray-800 text-white hover:bg-[#9179E0] rounded-lg flex items-center justify-center transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Facebook className="w-4 h-4" />
                        </Link>
                      )}
                    </div>

                    <Link
                      href={`/executives/${exec._id}`}
                      className="block w-full text-center py-2.5 bg-[#9179E0]/10 hover:bg-[#9179E0] text-[#9179E0] hover:text-white rounded-lg font-semibold text-sm transition-all duration-300"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a368f] mb-4">
              Our Leadership Principles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The values that guide our executive team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Service</h4>
              <p className="text-gray-600 text-sm">Dedicated to serving our members with integrity</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Unity</h4>
              <p className="text-gray-600 text-sm">Working together as one team for common goals</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Excellence</h4>
              <p className="text-gray-600 text-sm">Striving for the highest standards in all we do</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Accountability</h4>
              <p className="text-gray-600 text-sm">Transparent and responsible in our leadership</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}