"use client";
import { useState, useEffect } from "react";
import { Instagram, Twitter, Linkedin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NasowiteCardSkeleton } from "./SkeletonLoader";

interface Nasowite {
  _id: string;
  name: string;
  level: string;
  position: string;
  image: string;
  quote: string;
  socials: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    email: string;
    phone?: string;
  };
  achievements: string[];
}

const NasowiteOfWeek = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [nasowite, setNasowite] = useState<Nasowite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentNasowite();
  }, []);

  const fetchCurrentNasowite = async () => {
    try {
      const res = await fetch("/api/nasowites?current=true");
      const data = await res.json();
      if (data.success && data.data) {
        setNasowite(data.data);
      }
    } catch (error) {
      console.error("Failed to load current nasowite");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <NasowiteCardSkeleton />;
  }

  if (!nasowite) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50 font-inter w-full">
      <div className="px-6 max-w-7xl mx-auto lg:px-8">
        <div className="text-center md:text-left mb-12">
          <div className="flex space-x-2 items-baseline justify-center md:justify-start">
            <div className="size-6 bg-green-500 hidden md:block"/>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">Nasowite of the Week</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Celebrating outstanding members making a difference in our community
          </p>
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 gap-0 max-w-8xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-[600px] bg-gray-100">
            <Image
              src={nasowite.image}
              alt={nasowite.name}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>

          <div className="p-10 flex flex-col justify-center bg-white">
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {nasowite.name}
                </h3>
                <p className="text-lg text-[#9179E0] font-semibold mb-1">
                  {nasowite.position}
                </p>
                <p className="text-gray-600">{nasowite.level}</p>
              </div>

              <div className="py-4 border-t border-b border-gray-200">
                <p className="text-gray-700 italic leading-relaxed">
                  "{nasowite.quote}"
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {nasowite.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-[#9179E0] rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  Connect
                </h4>
                <div className="space-y-3">
                  {nasowite.socials.instagram && (
                    <a
                      href={`https://instagram.com/${nasowite.socials.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      <span>{nasowite.socials.instagram}</span>
                    </a>
                  )}
                  {nasowite.socials.twitter && (
                    <a
                      href={`https://twitter.com/${nasowite.socials.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                      <span>{nasowite.socials.twitter}</span>
                    </a>
                  )}
                  {nasowite.socials.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${nasowite.socials.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span>{nasowite.socials.linkedin}</span>
                    </a>
                  )}
                  <a
                    href={`mailto:${nasowite.socials.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{nasowite.socials.email}</span>
                  </a>
                  {nasowite.socials.phone && (
                    <a
                      href={`tel:${nasowite.socials.phone}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{nasowite.socials.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              <Link
                href="/nasowite-of-the-week"
                className="inline-block text-center bg-[#9179E0] text-white px-6 py-3 rounded-xl hover:bg-[#7d64c9] transition-colors font-semibold"
              >
                View All Honorees
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:hidden max-w-md mx-auto perspective">
          <div
            className="relative w-full h-[500px] cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className={`absolute inset-0 w-full h-full transition-all duration-700 ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                className="absolute inset-0 w-full h-full rounded-3xl shadow-xl overflow-hidden bg-gray-100"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src={nasowite.image}
                  alt={nasowite.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{nasowite.name}</h3>
                  <p className="text-white/90">{nasowite.position}</p>
                  <p className="text-sm text-white/80 mt-4">Tap to learn more</p>
                </div>
              </div>

              <div
                className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl p-8 overflow-y-auto"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)"
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {nasowite.name}
                    </h3>
                    <p className="text-[#9179E0] font-semibold mb-1">
                      {nasowite.position}
                    </p>
                    <p className="text-gray-600 text-sm">{nasowite.level}</p>
                  </div>

                  <div className="py-4 border-t border-b border-gray-200">
                    <p className="text-gray-700 italic text-sm leading-relaxed">
                      "{nasowite.quote}"
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {nasowite.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="inline-block w-1.5 h-1.5 bg-[#9179E0] rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">
                      Connect
                    </h4>
                    <div className="space-y-3">
                      {nasowite.socials.instagram && (
                        <a
                          href={`https://instagram.com/${nasowite.socials.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                        >
                          <Instagram className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{nasowite.socials.instagram}</span>
                        </a>
                      )}
                      {nasowite.socials.twitter && (
                        <a
                          href={`https://twitter.com/${nasowite.socials.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                        >
                          <Twitter className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{nasowite.socials.twitter}</span>
                        </a>
                      )}
                      {nasowite.socials.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${nasowite.socials.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                        >
                          <Linkedin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{nasowite.socials.linkedin}</span>
                        </a>
                      )}
                      <a
                        href={`mailto:${nasowite.socials.email}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                      >
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{nasowite.socials.email}</span>
                      </a>
                      {nasowite.socials.phone && (
                        <a
                          href={`tel:${nasowite.socials.phone}`}
                          className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                        >
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{nasowite.socials.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/nasowite-of-the-week"
                    className="block text-center bg-[#9179E0] text-white px-6 py-3 rounded-xl hover:bg-[#7d64c9] transition-colors font-semibold text-sm"
                  >
                    View All Honorees
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NasowiteOfWeek;