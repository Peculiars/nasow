import { Instagram, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { PiTiktokLogoLight } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/logo.svg";

const Footer = () => {
  const footerLinks = {
    quickLinks: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "News & Events", href: "/events" }
    ],
    pages: [
      { name: "Executives", href: "/executives" },
      { name: "Icons Of The Department", href: "/executives/icons-of-the-department" },
      { name: "Meet the HOD", href: "/#hod" },
      { name: "Our Lecturers", href: "/lecturers" },
      { name: "Courses", href: "/portal/courses" },
      { name: "Flashcards", href: "/flashcards" },
      { name: "NASOWites of the Week", href: "/nasowite-of-the-week" }
    ],
    resources: [
      { name: "Academic Calendar", href: "/coming-soon" },
      { name: "Student Portal", href: "https://studentportal.unilag.edu.ng/" },
      { name: "Library Resources", href: "/coming-soon" },
      { name: "Career Guidance", href: "/coming-soon" }
    ]
  };

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/Nasows_unilag", color: "hover:bg-pink-600" },
    { name: "TikTok", icon: PiTiktokLogoLight, href: "https://www.tiktok.com/@nasows_unilag", color: "hover:bg-blue-400" }
  ];

  const contactInfo = [
    { icon: Mail, text: "unilagnasows@gmail.com", href: "mailto:unilagnasows@gmail.com" },
    { icon: Phone, text: "+234 814 650 6649", href: "tel:+2348146506649" },
    { icon: MapPin, text: "Faculty of Social Sciences, UNILAG, Akoka, Lagos", href: "https://maps.app.goo.gl/a6dL4hxwX8gkSFRe7" }
  ];

  return (
    <footer className="bg-gradient-to-br from-[#4a368f] via-[#5a4399] to-[#6a50a9] text-white font-inter w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                  <Link href="/" className="block group">
                    <Image src={logo} alt="NASOW UNILAG Chapter" width={120} height={120} className="w-auto h-16 object-contain transition-transform duration-300 hover:scale-105" priority/>
                  </Link>
                </div>
              <div>
                <h3 className="text-xl font-bold">NASOWS</h3>
                <p className="text-xs text-white/70">UNILAG Chapter</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              The Nigerian Association of Social Work Students (NASOWS), UNILAG Chapter, is dedicated to promoting academic excellence, professional growth, and social impact among Social Work students at the University of Lagos.
            </p>

            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white hover:text-[#4a368f] transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Pages</h4>
            <ul className="space-y-3">
              {footerLinks.pages.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10">
          <h4 className="text-lg font-bold mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <Link
                  key={index}
                  href={contact.href}
                  className="flex items-start gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm leading-relaxed pt-2">{contact.text}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} NASOWS UNILAG. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/coming-soon" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/coming-soon" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/coming-soon" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;