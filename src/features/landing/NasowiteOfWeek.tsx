"use client"
import { useState } from "react";
import { Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

const NasowiteOfWeek = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const nasowite = {
    name: "Ezechukwu Naomi Onyinyechi",
    level: "400 Level",
    position: "President, NASOWS UNILAG",
    image: "/assets/img-car-3.png", 
    quote: "Empowering social workers to create lasting change in our communities.",
    socials: {
      instagram: "@eze_naomi",
      twitter: "@naomi_sw",
      linkedin: "ezechukwu-naomi",
      email: "ezechukwu@nasows.com",
      phone: "+234 801 234 5678"
    },
    achievements: [
      "Led 5+ community outreach programs",
      "President's List for Academic Excellence",
      "Volunteer Coordinator, Red Cross"
    ]
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 font-inter w-full">
      <div className="px-6 max-w-7xl mx-auto lg:px-8">
        <div className="text-center md:text-left mb-12">
          <div className="flex space-x-2 items-baseline">
            <div className="size-6 bg-green-500 hidden md:block"/>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">NASOWITE of the Week</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Celebrating outstanding members making a difference in our community
          </p>
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 gap-0 max-w-8xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-[600px]">
            <Image
              src={nasowite.image}
              alt={nasowite.name}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-[#9179E0]/10" />
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
                  <a
                    href={`https://instagram.com/${nasowite.socials.instagram.replace('@', '')}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>{nasowite.socials.instagram}</span>
                  </a>
                  <a
                    href={`https://twitter.com/${nasowite.socials.twitter.replace('@', '')}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>{nasowite.socials.twitter}</span>
                  </a>
                  <a
                    href={`https://linkedin.com/in/${nasowite.socials.linkedin}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>{nasowite.socials.linkedin}</span>
                  </a>
                  <a
                    href={`mailto:${nasowite.socials.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{nasowite.socials.email}</span>
                  </a>
                  <a
                    href={`tel:${nasowite.socials.phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{nasowite.socials.phone}</span>
                  </a>
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
                      <a
                        href={`https://instagram.com/${nasowite.socials.instagram.replace('@', '')}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                      >
                        <Instagram className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{nasowite.socials.instagram}</span>
                      </a>
                      <a
                        href={`https://twitter.com/${nasowite.socials.twitter.replace('@', '')}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                      >
                        <Twitter className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{nasowite.socials.twitter}</span>
                      </a>
                      <a
                        href={`https://linkedin.com/in/${nasowite.socials.linkedin}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                      >
                        <Linkedin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{nasowite.socials.linkedin}</span>
                      </a>
                      <a
                        href={`mailto:${nasowite.socials.email}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                      >
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{nasowite.socials.email}</span>
                      </a>
                      <a
                        href={`tel:${nasowite.socials.phone}`}
                        className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#9179E0] transition-colors"
                      >
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{nasowite.socials.phone}</span>
                      </a>
                    </div>
                  </div>
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