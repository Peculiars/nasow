import { ArrowRight, Award, Heart, Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const OurSponsors = () => {
  const sponsors = {
    platinum: [
      {
        id: 1,
        name: "UNICEF Nigeria",
        logo: "/assets/img-car-3.png",
        description: "Supporting child welfare and development initiatives",
        website: "https://unicef.org",
        tier: "Platinum"
      },
      {
        id: 2,
        name: "MTN Foundation",
        logo: "/assets/img-car-3.png",
        description: "Empowering education and youth development",
        website: "https://mtn.com",
        tier: "Platinum"
      }
    ],
    gold: [
      {
        id: 3,
        name: "Access Bank",
        logo: "/assets/img-car-3.png",
        description: "Financial literacy and student support programs",
        website: "https://accessbank.com",
        tier: "Gold"
      },
      {
        id: 4,
        name: "Dangote Foundation",
        logo: "/assets/img-car-3.png",
        description: "Community development and social impact",
        website: "https://dangote.com",
        tier: "Gold"
      },
      {
        id: 5,
        name: "Tony Elumelu Foundation",
        logo: "/assets/img-car-3.png",
        description: "Entrepreneurship and leadership development",
        website: "https://tonyelumelufoundation.org",
        tier: "Gold"
      }
    ],
    silver: [
      {
        id: 6,
        name: "Sterling Bank",
        logo: "/assets/img-car-3.png",
        description: "Youth empowerment initiatives",
        website: "https://sterling.com",
        tier: "Silver"
      },
      {
        id: 7,
        name: "Shell Nigeria",
        logo: "/assets/img-car-3.png",
        description: "Educational scholarships and grants",
        website: "https://shell.com.ng",
        tier: "Silver"
      },
      {
        id: 8,
        name: "FCMB Foundation",
        logo: "/assets/img-car-3.png",
        description: "Skills acquisition and capacity building",
        website: "https://fcmb.com",
        tier: "Silver"
      },
      {
        id: 9,
        name: "Coca-Cola Foundation",
        logo: "/assets/img-car-3.png",
        description: "Community outreach programs",
        website: "https://coca-cola.com",
        tier: "Silver"
      }
    ]
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      Platinum: "from-slate-400 to-slate-600",
      Gold: "from-yellow-400 to-yellow-600",
      Silver: "from-gray-300 to-gray-500"
    };
    return colors[tier] || "from-gray-400 to-gray-600";
  };

  const getTierBadgeColor = (tier: string) => {
    const colors: Record<string, string> = {
      Platinum: "bg-slate-100 text-slate-700 border-slate-300",
      Gold: "bg-yellow-50 text-yellow-700 border-yellow-300",
      Silver: "bg-gray-100 text-gray-700 border-gray-300"
    };
    return colors[tier] || "bg-gray-100 text-gray-700";
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 font-inter w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-[#9179E0]" />
            <span className="text-sm font-semibold text-[#9179E0] uppercase tracking-wider">
              Our Valued Partners
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f] mb-4">
            Our Sponsors & Partners
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            We are grateful to our amazing sponsors and partners who support our mission to empower social work students and create lasting impact in our communities
          </p>
        </div>

        {/* Platinum Sponsors */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300" />
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-400 to-slate-600 text-white rounded-full">
              <Award className="w-5 h-5" />
              <span className="font-bold text-sm">Platinum Sponsors</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {sponsors.platinum.map((sponsor) => (
              <Link
                key={sponsor.id}
                href={sponsor.website}
                target="_blank"
                className="group bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl hover:border-slate-400 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={200}
                    height={100}
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border ${getTierBadgeColor(sponsor.tier)}`}>
                    {sponsor.tier}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#4a368f] mb-2 group-hover:text-[#9179E0] transition-colors">
                    {sponsor.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {sponsor.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-300" />
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full">
              <Award className="w-5 h-5" />
              <span className="font-bold text-sm">Gold Sponsors</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-300" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.gold.map((sponsor) => (
              <Link
                key={sponsor.id}
                href={sponsor.website}
                target="_blank"
                className="group bg-white rounded-xl shadow-lg border-2 border-yellow-200 overflow-hidden hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-40 bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={150}
                    height={80}
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border ${getTierBadgeColor(sponsor.tier)}`}>
                    {sponsor.tier}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#4a368f] mb-2 group-hover:text-[#9179E0] transition-colors">
                    {sponsor.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {sponsor.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-full">
              <Award className="w-5 h-5" />
              <span className="font-bold text-sm">Silver Sponsors</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sponsors.silver.map((sponsor) => (
              <Link
                key={sponsor.id}
                href={sponsor.website}
                target="_blank"
                className="group bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-400 transition-all duration-300"
              >
                <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={120}
                    height={60}
                    className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-[#4a368f] mb-1 group-hover:text-[#9179E0] transition-colors line-clamp-1">
                    {sponsor.name}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {sponsor.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-[#4a368f] to-[#9179E0] rounded-3xl p-8 md:p-10 text-white">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Handshake className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  Become a Sponsor
                </h3>
                <p className="text-white/90 leading-relaxed mb-6">
                  Partner with NASOWS UNILAG to empower the next generation of social workers and create lasting impact in communities across Nigeria.
                </p>
                <Link
                  href="/become-sponsor"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4a368f] rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Partner With Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-gray-200 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-[#9179E0]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-7 h-7 text-[#9179E0]" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#4a368f] mb-3">
                  Sponsorship Benefits
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#9179E0] rounded-full mt-2 flex-shrink-0" />
                    <span>Brand visibility across our events and platforms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#9179E0] rounded-full mt-2 flex-shrink-0" />
                    <span>Direct engagement with 500+ social work students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#9179E0] rounded-full mt-2 flex-shrink-0" />
                    <span>Corporate social responsibility opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#9179E0] rounded-full mt-2 flex-shrink-0" />
                    <span>Tax-deductible contributions and recognition</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-[#4a368f] to-[#9179E0] rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Our Impact Together
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">15+</p>
              <p className="text-white/80 text-sm">Active Sponsors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">₦5M+</p>
              <p className="text-white/80 text-sm">Funds Raised</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">30+</p>
              <p className="text-white/80 text-sm">Events Sponsored</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">500+</p>
              <p className="text-white/80 text-sm">Students Impacted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSponsors;