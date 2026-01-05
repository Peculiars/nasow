"use client";
import { useState, useEffect } from "react";
import { Instagram, Twitter, Linkedin, Mail, Phone, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

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
  isCurrent: boolean;
  weekStartDate: string;
  weekEndDate: string;
}

const NasowiteOfTheWeekPage = () => {
  const [currentNasowite, setCurrentNasowite] = useState<Nasowite | null>(null);
  const [previousNasowites, setPreviousNasowites] = useState<Nasowite[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNasowites();
  }, []);

  const fetchNasowites = async () => {
    try {
      const res = await fetch("/api/nasowites");
      const data = await res.json();
      if (data.success) {
        const current = data.data.find((n: Nasowite) => n.isCurrent);
        const previous = data.data.filter((n: Nasowite) => !n.isCurrent);
        setCurrentNasowite(current);
        setPreviousNasowites(previous);
      }
    } catch (error) {
      console.error("Failed to load nasowites");
    } finally {
      setLoading(false);
    }
  };

  const displayedPrevious = showAll ? previousNasowites : previousNasowites.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9179E0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <section className="py-16 md:py-24 bg-white">
        <div className="px-6 max-w-7xl mx-auto lg:px-8">
          <div className="text-center md:text-left mb-12">
            <div className="flex space-x-2 items-baseline justify-center md:justify-start">
              <div className="size-6 bg-green-500 hidden md:block"/>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">Nasowite of the Week</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto md:mx-0 mt-2">
              Celebrating outstanding members making a difference in our community
            </p>
          </div>

          {currentNasowite ? (
            <>
              <div className="hidden lg:grid lg:grid-cols-2 gap-0 max-w-8xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100">
                <div className="relative h-[600px]">
                  <Image
                    src={currentNasowite.image}
                    alt={currentNasowite.name}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-[#9179E0]/10" />
                  <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Current Week
                  </div>
                </div>

                <div className="p-10 flex flex-col justify-center bg-white">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentNasowite.name}
                      </h2>
                      <p className="text-lg text-[#9179E0] font-semibold mb-1">
                        {currentNasowite.position}
                      </p>
                      <p className="text-gray-600">{currentNasowite.level}</p>
                    </div>

                    <div className="py-4 border-t border-b border-gray-200">
                      <p className="text-gray-700 italic leading-relaxed">
                        "{currentNasowite.quote}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <Calendar className="w-4 h-4 text-[#9179E0]" />
                      <span>{new Date(currentNasowite.weekStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(currentNasowite.weekEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {currentNasowite.achievements.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                          Key Achievements
                        </h3>
                        <ul className="space-y-2">
                          {currentNasowite.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 bg-[#9179E0] rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                        Connect
                      </h3>
                      <div className="space-y-3">
                        {currentNasowite.socials.instagram && (
                          <a
                            href={`https://instagram.com/${currentNasowite.socials.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                          >
                            <Instagram className="w-5 h-5" />
                            <span>{currentNasowite.socials.instagram}</span>
                          </a>
                        )}
                        {currentNasowite.socials.twitter && (
                          <a
                            href={`https://twitter.com/${currentNasowite.socials.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                          >
                            <Twitter className="w-5 h-5" />
                            <span>{currentNasowite.socials.twitter}</span>
                          </a>
                        )}
                        {currentNasowite.socials.linkedin && (
                          <a
                            href={`https://linkedin.com/in/${currentNasowite.socials.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                            <span>{currentNasowite.socials.linkedin}</span>
                          </a>
                        )}
                        <a
                          href={`mailto:${currentNasowite.socials.email}`}
                          className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                          <span>{currentNasowite.socials.email}</span>
                        </a>
                        {currentNasowite.socials.phone && (
                          <a
                            href={`tel:${currentNasowite.socials.phone}`}
                            className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                          >
                            <Phone className="w-5 h-5" />
                            <span>{currentNasowite.socials.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
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
                      className="absolute inset-0 w-full h-full rounded-3xl shadow-xl overflow-hidden"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <Image
                        src={currentNasowite.image}
                        alt={currentNasowite.name}
                        fill
                        className="object-contain"
                        sizes="80vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Current
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-2xl font-bold mb-1">{currentNasowite.name}</h2>
                        <p className="text-white/90">{currentNasowite.position}</p>
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
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {currentNasowite.name}
                          </h2>
                          <p className="text-[#9179E0] font-semibold mb-1">
                            {currentNasowite.position}
                          </p>
                          <p className="text-gray-600 text-sm">{currentNasowite.level}</p>
                        </div>

                        <div className="py-4 border-t border-b border-gray-200">
                          <p className="text-gray-700 italic text-sm leading-relaxed">
                            "{currentNasowite.quote}"
                          </p>
                        </div>

                        {currentNasowite.achievements.length > 0 && (
                          <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">
                              Key Achievements
                            </h3>
                            <ul className="space-y-2">
                              {currentNasowite.achievements.map((achievement, index) => (
                                <li key={index} className="flex items-start text-sm">
                                  <span className="inline-block w-1.5 h-1.5 bg-[#9179E0] rounded-full mt-1.5 mr-2 flex-shrink-0" />
                                  <span className="text-gray-700">{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">
                            Connect
                          </h3>
                          <div className="space-y-3">
                            {currentNasowite.socials.instagram && (
                              <a
                                href={`https://instagram.com/${currentNasowite.socials.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                              >
                                <Instagram className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{currentNasowite.socials.instagram}</span>
                              </a>
                            )}
                            {currentNasowite.socials.twitter && (
                              <a
                                href={`https://twitter.com/${currentNasowite.socials.twitter.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                              >
                                <Twitter className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{currentNasowite.socials.twitter}</span>
                              </a>
                            )}
                            {currentNasowite.socials.linkedin && (
                              <a
                                href={`https://linkedin.com/in/${currentNasowite.socials.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                              >
                                <Linkedin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{currentNasowite.socials.linkedin}</span>
                              </a>
                            )}
                            <a
                              href={`mailto:${currentNasowite.socials.email}`}
                              className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                            >
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{currentNasowite.socials.email}</span>
                            </a>
                            {currentNasowite.socials.phone && (
                              <a
                                href={`tel:${currentNasowite.socials.phone}`}
                                className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                              >
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{currentNasowite.socials.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No current Nasowite of the Week</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NasowiteOfTheWeekPage;