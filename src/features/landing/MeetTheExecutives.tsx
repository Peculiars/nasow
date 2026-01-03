"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Mail, Phone, Instagram, Linkedin, } from "lucide-react";
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
  };
}

const ExecutiveSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden animate-pulse">
    <div className="relative h-80 bg-gray-200" />

    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
      <div className="h-10 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

const MeetTheExecutives = () => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        const res = await fetch("/api/executives");
        if (!res.ok) throw new Error("Failed to fetch executives");

        const data = await res.json();
        setExecutives(data.data || []);
      } catch (error) {
        console.error("Error loading executives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutives();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white font-inter w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center md:text-left mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
            <div className="hidden md:block size-6 bg-green-500" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">
              Meet The Executive Team
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Dedicated student leaders committed to excellence, service, and unity
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ExecutiveSkeleton key={i} />
              ))
            : executives.map((exec) => (
                <div
                  key={exec._id}
                  className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#9179E0]/30 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-80 bg-gray-100 overflow-hidden">
                    <Image
                      src={exec.image.url}
                      alt={exec.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a368f]/90 via-[#4a368f]/50 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{exec.name}</h3>
                      <p className="text-lg font-semibold text-white/90">
                        {exec.position}
                      </p>
                      <p className="text-sm text-white/70">{exec.level}</p>

                      <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link
                          href={`mailto:${exec.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center"
                        >
                          <Mail className="w-5 h-5 text-white" />
                        </Link>
                        <Link
                          href={`tel:${exec.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center"
                        >
                          <Phone className="w-5 h-5 text-white" />
                        </Link>

                        {exec?.socialMedia?.instagram && (
                          <Link
                            href={`https://instagram.com/${exec?.socialMedia?.instagram.replace(
                              "@",
                              ""
                            )}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center"
                          >
                            <Instagram className="w-5 h-5 text-white" />
                          </Link>
                        )}

                        {exec?.socialMedia?.linkedin && (
                          <Link
                            href={`https://linkedin.com/in/${exec?.socialMedia?.linkedin}`}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center"
                          >
                            <Linkedin className="w-5 h-5 text-white" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {exec.bio}
                    </p>

                    <Link
                      href={`/executives/${exec._id}`}
                      className="flex items-center justify-center gap-2 w-full bg-[#9179E0]/10 hover:bg-[#9179E0] text-[#9179E0] hover:text-white font-semibold text-sm py-3 rounded-lg transition-all duration-300"
                    >
                      View Full Profile
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
        </div>
        <div className="text-center">
          <Link
            href="/executives"
            className="inline-flex items-center gap-3 px-4 py-3 md:px-8 md:py-4 bg-[#9179E0] hover:bg-[#7E6BDB] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            View Complete Executive Team
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MeetTheExecutives;