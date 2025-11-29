"use client";
import { useState } from "react";
import { MoveRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/logo.svg";

const navItems = [
  { 
    id: "1", 
    name: "About", 
    url: "/about",
    dropdown: [
      { name: "About Us", url: "/about" },
      { name: "Meet the HOD", url: "/#hod" },
    ]
  },
  { 
    id: "2", 
    name: "Executives", 
    url: "/executives",
    dropdown: [
      { name: "Current Executives", url: "/executives" },
      { name: "Past Executives", url: "/past-executives" },
      { name: "Our Lecturers", url: "/lecturers" }
    ]
  },
  { 
    id: "3", 
    name: "Academics", 
    url: "/academics",
    dropdown: [
      { name: "Courses", url: "/courses" },
      { name: "Flashcards", url: "/flashcards" },
      { name: "Quizzes", url: "/quiz" },
      { name: "Study Resources", url: "/resources" }
    ]
  },
  { 
    id: "4", 
    name: "Community", 
    url: "/community",
    dropdown: [
      { name: "News & Events", url: "/events" },
      { name: "NASOWites of the Week", url: "/nasowites-week" },
      { name: "Our Sponsors", url: "/sponsors" },
      { name: "Photo Gallery", url: "/gallery" }
    ]
  },
  { id: "5", name: "Contact Us", url: "/contact" }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean | undefined>>({});

  const toggleMobileDropdown = (id: string) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="block group">
              <Image 
                src={logo} 
                alt="NASOWS UNILAG Chapter" 
                width={120} 
                height={120} 
                className="w-auto h-14 object-contain transition-transform duration-300 hover:scale-105" 
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div 
                key={item.id} 
                className="relative group"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href={item.url} 
                  className="flex items-center gap-1 text-gray-700 font-medium text-sm tracking-wide hover:text-[#9179E0] transition-colors duration-300 px-2 py-2"
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`}
                    />
                  )}
                </Link>
                
                {/* Underline Effect */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9179E0] group-hover:w-full transition-all duration-300" />

                {/* Desktop Dropdown */}
                {item.dropdown && (
                  <div 
                    className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
                      activeDropdown === item.id 
                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="py-2">
                      {item.dropdown.map((subItem, index) => (
                        <Link
                          key={index}
                          href={subItem.url}
                          className="block px-4 py-3 text-sm text-gray-700 hover:text-[#9179E0] hover:bg-purple-50 transition-colors duration-200"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Portal Button */}
            <Link 
              href="/portal" 
              className="ml-4 inline-flex items-center gap-2 rounded-xl bg-[#9179E0] px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-[#7E6BDB] transition-all duration-300 hover:scale-105"
            >
              Portal
              <MoveRight size={18} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-3 rounded-xl hover:bg-gray-50 transition-all duration-300" 
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1 left-0 w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : ''}`} />
              <span className={`absolute top-3 left-0 w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute top-5 left-0 w-full h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-2xl shadow-2xl border-t border-gray-100 transition-all duration-500 ease-out ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 py-6 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.id}>
              {/* Main Nav Item */}
              <div className="flex items-center justify-between">
                <Link 
                  href={item.url} 
                  onClick={() => !item.dropdown && setIsOpen(false)} 
                  className="flex-1 block px-4 py-3 text-base font-medium text-gray-800 hover:text-[#9179E0] hover:bg-purple-50 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </Link>
                
                {/* Mobile Dropdown Toggle */}
                {item.dropdown && (
                  <button
                    onClick={() => toggleMobileDropdown(item.id)}
                    className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    aria-label={`Toggle ${item.name} submenu`}
                  >
                    <ChevronDown 
                      size={18} 
                      className={`text-gray-600 transition-transform duration-300 ${
                        mobileDropdowns[item.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Mobile Dropdown Items */}
              {item.dropdown && (
                <div 
                  className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                    mobileDropdowns[item.id] 
                      ? 'max-h-96 opacity-100 mt-1' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  {item.dropdown.map((subItem, index) => (
                    <Link
                      key={index}
                      href={subItem.url}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:text-[#9179E0] hover:bg-purple-50 rounded-lg transition-colors duration-200"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Mobile Portal Button */}
          <div className="pt-4">
            <Link 
              href="/portal" 
              onClick={() => setIsOpen(false)} 
              className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-[#9179E0] px-8 py-3.5 text-white font-semibold shadow-xl hover:bg-[#7E6BDB] hover:scale-[1.02] transition-all duration-300"
            >
              Login to Portal
              <MoveRight size={20} />
            </Link>
          </div>
          
          {/* Footer Credits */}
          <div className="text-center pt-6 pb-2">
            <p className="text-xs text-gray-600">Designed by the</p>
            <p className="text-sm font-semibold text-[#9179E0]">
              2025/2026 Executives
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;