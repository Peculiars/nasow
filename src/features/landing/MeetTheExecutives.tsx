import { ArrowRight, Mail, Phone, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MeetTheExecutives = () => {
  const executives = [
    {
      id: 1,
      name: "Ezechukwu Naomi Onyinyechi",
      position: "President",
      level: "400 Level",
      image: "/assets/excos/naomi.png",
      bio: "Leading NASOWS with vision and dedication to student welfare",
      email: "president@nasows.com",
      phone: "+234 801 234 5678",
      instagram: "@eze_naomi",
      linkedin: "ezechukwu-naomi"
    },
    {
      id: 2,
      name: "Oluwafemi Philip Oreoluwa",
      position: "Vice President",
      level: "400 Level",
      image: "/assets/excos/philip.png",
      bio: "Supporting the president and coordinating departmental activities",
      email: "vp@nasows.com",
      phone: "+234 802 345 6789",
      instagram: "@oluwafemi_nasows",
      linkedin: "oluwafemi-philip"
    },
    {
      id: 3,
      name: "Joshua Joy Temitope",
      position: "General Secretary",
      level: "300 Level",
      image: "/assets/excos/joy.png",
      bio: "Managing records, communications, and administrative duties",
      email: "secretary@nasows.com",
      phone: "+234 803 456 7890",
      instagram: "@joy_nasows",
      linkedin: "joshua-joy"
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white font-inter w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center md:text-left mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
            <div className="hidden md:block size-6 bg-green-500" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">
              Meet The 2025/2026 Executive Team
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Dedicated student leaders committed to excellence, service, and unity in NASOWS UNILAG
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {executives.map((exec) => (
            <div
              key={exec.id}
              className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#9179E0]/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-80 bg-gray-100 overflow-hidden">
                <Image
                  src={exec.image}
                  alt={exec.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4a368f]/90 via-[#4a368f]/50 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="mb-3">
                    <h3 className="text-2xl font-bold mb-1">{exec.name}</h3>
                    <p className="text-lg font-semibold text-white/90">{exec.position}</p>
                    <p className="text-sm text-white/70">{exec.level}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href={`mailto:${exec.email}`}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="w-5 h-5 text-white" />
                    </Link>
                    <Link
                      href={`tel:${exec.phone}`}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-5 h-5 text-white" />
                    </Link>
                    <Link
                      href={`https://instagram.com/${exec.instagram.replace('@', '')}`}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </Link>
                    <Link
                      href={`https://linkedin.com/in/${exec.linkedin}`}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin className="w-5 h-5 text-white" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {exec.bio}
                </p>

                <Link
                  href={`/executives/${exec.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-[#9179E0]/10 hover:bg-[#9179E0] text-[#9179E0] hover:text-white font-semibold text-sm py-3 rounded-lg transition-all duration-300 group/link"
                >
                  View Full Profile
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mb-16">
          <Link
            href="/executives"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#9179E0] hover:bg-[#7E6BDB] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            View Complete Executive Team
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="bg-gradient-to-br from-[#4a368f] to-[#9179E0] rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Our Mission
            </h3>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              To foster academic excellence, promote professional development, and create a supportive community for all Social Work students at UNILAG. Together, we are building a legacy of service, leadership, and social impact.
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-6 border-t border-white/20">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-1">15+</p>
                <p className="text-sm text-white/80">Executive Members</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-1">500+</p>
                <p className="text-sm text-white/80">Students Served</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-1">20+</p>
                <p className="text-sm text-white/80">Events Annually</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-1">100%</p>
                <p className="text-sm text-white/80">Commitment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetTheExecutives;