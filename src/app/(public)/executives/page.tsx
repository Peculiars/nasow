"use client"
import { useState } from "react";
import { Mail, Phone, Instagram, Linkedin, Twitter, Award, Users, Target, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ExecutivesPage = () => {
  interface Executive {
    id: number;
    name: string;
    position: string;
    level: string;
    image: string;
    bio: string;
    email: string;
    phone: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    achievements: string[];
    responsibilities: string[];
  }

  const [selectedExec, setSelectedExec] = useState<Executive | null>(null);

  const executives: Executive[] = [
    {
      id: 1,
      name: "Ezechukwu Naomi Onyinyechi",
      position: "President",
      level: "400 Level",
      image: "/assets/excos/naomi.png",
      bio: "Ezechukwu Naomi Onyinyechi is a dedicated leader passionate about student welfare and community development. With a strong background in social advocacy, she leads NASOWS with vision and commitment to excellence.",
      email: "president@nasows.com",
      phone: "+234 801 234 5678",
      instagram: "@chiamaka_nasows",
      linkedin: "chiamaka-adebayo",
      twitter: "@chiamaka_sw",
      achievements: [
        "Increased student participation by 40%",
        "Launched 5 major community outreach programs",
        "Recipient of UNILAG Leadership Excellence Award 2024"
      ],
      responsibilities: [
        "Overall leadership and strategic direction",
        "Representing NASOWS in university and external forums",
        "Coordinating all executive activities"
      ]
    },
    {
      id: 2,
      name: "Oluwafemi Philip Oreoluwa",
      position: "Vice President",
      level: "400 Level",
      image: "/assets/excos/philip.png",
      bio: "Oluwafemi Philip Oreoluwa brings exceptional organizational skills and a passion for student empowerment. He supports the president and ensures smooth coordination of departmental activities.",
      email: "vp@nasows.com",
      phone: "+234 802 345 6789",
      instagram: "@chidinma_nasows",
      linkedin: "chidinma-okonkwo",
      twitter: "@chidinma_vp",
      achievements: [
        "Coordinated 15+ successful events",
        "Established mentorship program for 100 level students",
        "Dean's List for Academic Excellence"
      ],
      responsibilities: [
        "Supporting the President in all duties",
        "Coordinating between different portfolios",
        "Acting President in the President's absence"
      ]
    },
    {
      id: 3,
      name: "Joshua Joy Temitope",
      position: "General Secretary",
      level: "300 Level",
      image: "/assets/excos/joy.png",
      bio: "Joshua Joy Temitope is meticulous and detail-oriented, ensuring all NASOWS records and communications are properly managed. His organizational prowess keeps the association running smoothly.",
      email: "secretary@nasows.com",
      phone: "+234 803 456 7890",
      instagram: "@tunde_nasows",
      linkedin: "tunde-adeyemi",
      twitter: "@tunde_sec",
      achievements: [
        "Digitized all NASOWS records",
        "Improved communication efficiency by 60%",
        "Published quarterly newsletters"
      ],
      responsibilities: [
        "Managing all official correspondence",
        "Keeping minutes of meetings",
        "Maintaining membership database"
      ]
    },
    {
      id: 4,
      name: "Bamigboye Basirat Eniola",
      position: "Treasurer",
      level: "400 Level",
      image: "/assets/excos/basira.png",
      bio: "Basirat brings financial expertise and transparency to NASOWS. She ensures all financial matters are handled with integrity and accountability.",
      email: "trasurer@nasows.com",
      phone: "+234 804 567 8901",
      instagram: "@trasurer_nasow",
      linkedin: "trasurer-230",
      twitter: "@trasurer_tre",
      achievements: [
        "Maintained 100% financial transparency",
        "Secured ₦2M in funding for projects",
        "Implemented digital payment systems"
      ],
      responsibilities: [
        "Managing NASOWS finances and budget",
        "Preparing financial reports",
        "Overseeing fundraising activities"
      ]
    },
    {
      id: 5,
      name: "Ogami Janet Segbuyota",
      position: "Social Secretary",
      level: "300 Level",
      image: "/assets/excos/janet.png",
      bio: "Janet is creative and energetic, bringing fun and engagement to NASOWS events. She ensures every social activity is memorable and meaningful.",
      email: "socials@nasows.com",
      phone: "+234 805 678 9012",
      instagram: "@janet_nasows",
      linkedin: "janet_ogami",
      twitter: "@janet_ogami",
      achievements: [
        "Organized 20+ successful social events",
        "Increased event attendance by 70%",
        "Created NASOWS social media strategy"
      ],
      responsibilities: [
        "Planning and executing social events",
        "Managing social media presence",
        "Building student engagement"
      ]
    },
    {
      id: 6,
      name: "Aina Christiana Olajumoke",
      position: "Public Relations Officer",
      level: "400 Level",
      image: "/assets/excos/jumoke.png",
      bio: "Christiana is eloquent and strategic in managing NASOWS's public image. She ensures effective communication with all stakeholders.",
      email: "pro@nasows.com",
      phone: "+234 806 789 0123",
      instagram: "@jumoke_nasows",
      linkedin: "jumoke-aina",
      twitter: "@jumoke-aina",
      achievements: [
        "Increased NASOWS visibility by 85%",
        "Secured partnerships with 5 NGOs",
        "Featured in 3 major publications"
      ],
      responsibilities: [
        "Managing external communications",
        "Building partnerships and collaborations",
        "Representing NASOWS in media"
      ]
    },
    {
      id: 7,
      name: "Olawore Faith Olamide",
      position: "Welfare Secretary",
      level: "400 Level",
      image: "/assets/excos/faith.png",
      bio: "Faith is compassionate and proactive in addressing student welfare issues. She ensures every member feels supported and valued.",
      email: "welfare@nasows.com",
      phone: "+234 807 890 1234",
      instagram: "@faith_nasows",
      linkedin: "faith-olawore",
      twitter: "@faith_welfare",
      achievements: [
        "Established student support fund",
        "Organized health and wellness programs",
        "Created peer support network"
      ],
      responsibilities: [
        "Addressing student welfare concerns",
        "Organizing welfare programs",
        "Liaising with university health services"
      ]
    },
    {
      id: 8,
      name: "Iyiade Adenike Oluwadamilola",
      position: "P.R.O",
      level: "300 Level",
      image: "/assets/excos/adenike.png",
      bio: "Adenike is athletic and team-oriented, promoting sports and fitness among NASOWS members. She believes in the power of sports for community building.",
      email: "pro@nasows.com",
      phone: "+234 808 901 2345",
      instagram: "@adenike_nasows",
      linkedin: "adenike-iyiade",
      twitter: "@adenike_sports",
      achievements: [
        "Led team to win inter-departmental championship",
        "Organized 10+ sports tournaments",
        "Increased sports participation by 90%"
      ],
      responsibilities: [
        "Organizing sports activities",
        "Coordinating inter-departmental competitions",
        "Promoting fitness and wellness"
      ]
    },
    {
      id: 9,
      name: "Balogun Malik Olamilekan",
      position: "Sports Secretary",
      level: "400 Level",
      image: "/assets/excos/malik.png",
      bio: "Malik is academically excellent and committed to helping students excel. He organizes study groups and academic support programs.",
      email: "sports@nasows.com",
      phone: "+234 809 012 3456",
      instagram: "@malik_nasows",
      linkedin: "malik-balogun",
      twitter: "@malik_sports",
      achievements: [
        "Improved class average by 15%",
        "Organized 8 successful study bootcamps",
        "Created comprehensive study materials"
      ],
      responsibilities: [
        "Organizing academic programs",
        "Coordinating study groups",
        "Liaising with lecturers on academic matters"
      ]
    },
    {
      id: 10,
      name: "Adebisi Anjolaoluwa Priscilla",
      position: "Asst. General Secretary",
      level: "300 Level",
      image: "/assets/excos/anjola.png",
      bio: "Priscilla is organized and detail-oriented, supporting the General Secretary in managing communications and documentation.",
      email: "asstgensec@nasows.com",
      phone: "+234 809 012 3456",
      instagram: "@anjola_nasows",
      linkedin: "anjola-adebisi",
      twitter: "@anjola_priscilla",
      achievements: [
        "Improved class average by 15%",
        "Organized 8 successful study bootcamps",
        "Created comprehensive study materials"
      ],
      responsibilities: [
        "Organizing academic programs",
        "Coordinating study groups",
        "Liaising with lecturers on academic matters"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-inter">
      <section className="relative h-[350px] md:h-[450px] bg-gradient-to-br from-[#4a368f] to-[#9179E0] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] bg-repeat opacity-20" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Meet The 2025/2026 Executive Team
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {executives.map((exec) => (
              <div
                key={exec.id}
                className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#9179E0]/30 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedExec(exec)}
              >
                <div className="relative h-80 bg-gray-100 overflow-hidden">
                  <Image
                    src={exec.image}
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
                  <div className="flex items-center gap-2 mb-4">
                    <Link
                      href={`mailto:${exec.email}`}
                      className="w-9 h-9 bg-black hover:bg-[#9179E0] hover:text-white rounded-lg flex items-center justify-center transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`tel:${exec.phone}`}
                      className="w-9 h-9 bg-black hover:bg-[#9179E0] hover:text-white rounded-lg flex items-center justify-center transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`https://instagram.com/${exec.instagram.replace('@', '')}`}
                      className="w-9 h-9 bg-black hover:bg-[#9179E0] hover:text-white rounded-lg flex items-center justify-center transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Instagram className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`https://linkedin.com/in/${exec.linkedin}`}
                      className="w-9 h-9 bg-black hover:bg-[#9179E0] hover:text-white rounded-lg flex items-center justify-center transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Linkedin className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`https://twitter.com/${exec.twitter.replace('@', '')}`}
                      className="w-9 h-9 bg-black hover:bg-[#9179E0] hover:text-white rounded-lg flex items-center justify-center transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Twitter className="w-4 h-4" />
                    </Link>
                  </div>

                  <button 
                    className="w-full py-2.5 bg-[#9179E0]/10 hover:bg-[#9179E0] text-[#9179E0] hover:text-white rounded-lg font-semibold text-sm transition-all duration-300"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              <p className="text-gray-600 text-sm">
                Dedicated to serving our members with integrity
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Unity</h4>
              <p className="text-gray-600 text-sm">
                Working together as one team for common goals
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Excellence</h4>
              <p className="text-gray-600 text-sm">
                Striving for the highest standards in all we do
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Accountability</h4>
              <p className="text-gray-600 text-sm">
                Transparent and responsible in our leadership
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Executive Details */}
      {selectedExec && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedExec(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Executive Profile</h3>
              <button
                onClick={() => setSelectedExec(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="relative w-full md:w-48 h-64 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedExec.image}
                    alt={selectedExec.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-3xl font-bold text-gray-900 mb-2">{selectedExec.name}</h4>
                  <p className="text-xl text-[#9179E0] font-semibold mb-1">{selectedExec.position}</p>
                  <p className="text-gray-600 mb-4">{selectedExec.level}</p>
                  <p className="text-gray-700 leading-relaxed">{selectedExec.bio}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="text-lg font-bold text-gray-900 mb-3">Key Achievements</h5>
                  <ul className="space-y-2">
                    {selectedExec.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="inline-block w-2 h-2 bg-[#9179E0] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-lg font-bold text-gray-900 mb-3">Responsibilities</h5>
                  <ul className="space-y-2">
                    {selectedExec.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-3">
                    <a href={`mailto:${selectedExec.email}`} className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors">
                      <Mail className="w-5 h-5" />
                      <span>{selectedExec.email}</span>
                    </a>
                    <a href={`tel:${selectedExec.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors">
                      <Phone className="w-5 h-5" />
                      <span>{selectedExec.phone}</span>
                    </a>
                    <a href={`https://instagram.com/${selectedExec.instagram.replace('@', '')}`} className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors">
                      <Instagram className="w-5 h-5" />
                      <span>{selectedExec.instagram}</span>
                    </a>
                    <a href={`https://linkedin.com/in/${selectedExec.linkedin}`} className="flex items-center gap-3 text-gray-700 hover:text-[#9179E0] transition-colors">
                      <Linkedin className="w-5 h-5" />
                      <span>{selectedExec.linkedin}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutivesPage;