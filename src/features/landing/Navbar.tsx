
"use client";

import { useState, useEffect } from "react";
import { MoveRight, ChevronDown, User, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/logo.svg";
import unilagLogo from "@/public/assets/unilag-logo.png";

const navItems = [
  { id: "1", name: "Home", url: "/" },
  {
    id: "2",
    name: "About",
    url: "/about",
    dropdown: [
      { name: "About Us", url: "/about" },
      { name: "Meet the HOD", url: "/#hod" },
    ],
  },
  {
    id: "3",
    name: "Executives",
    url: "/executives",
    dropdown: [
      { name: "Current Executives", url: "/executives" },
      { name: "Icons Of the Department", url: "/executives/icons-of-the-department" },
      { name: "Our Lecturers", url: "/lecturers" },
    ],
  },
  {
    id: "4",
    name: "Academics",
    url: "/portal/courses",
    dropdown: [
      { name: "Courses", url: "/portal/courses" },
      { name: "Flashcards", url: "/flashcards" },
      { name: "Quizzes", url: "/quiz" },
    ],
  },
  {
    id: "5",
    name: "Community",
    url: "/events",
    dropdown: [
      { name: "News & Events", url: "/events" },
      { name: "NASOWites of the Week", url: "/nasowite-of-the-week" },
      { name: "Our Sponsors", url: "/#sponsors" },
    ],
  },
  { id: "6", name: "Contact Us", url: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePortalClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setPortalLoading(true);
      window.location.href = '/login';
    }
  };

  const toggleMobileDropdown = (id: string) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <Link href="/" className="group">
              <Image
                src={unilagLogo}
                alt="UNILAG logo"
                width={120}
                height={120}
                priority
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <Link href="/" className="group">
              <Image
                src={logo}
                alt="NASOWS UNILAG Chapter"
                width={120}
                height={120}
                priority
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  href={item.url}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 px-2 py-2 hover:text-[#9179E0] transition-colors"
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown
                      size={16}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  )}
                </Link>

                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#9179E0] group-hover:w-full transition-all duration-300" />

                {item.dropdown && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="py-2">
                        {item.dropdown.map((subItem, index) => (
                          <Link
                            key={index}
                            href={subItem.url}
                            className="block px-4 py-3 text-sm text-gray-700 hover:text-[#9179E0] hover:bg-purple-50 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Portal Button */}
            {authLoading ? (
              <div className="ml-4 inline-flex items-center gap-2 rounded-xl bg-gray-200 px-6 py-3 text-gray-400 font-semibold">
                <Loader2 size={18} className="animate-spin" />
                Loading...
              </div>
            ) : isAuthenticated ? (
              <Link
                href="/portal"
                className="ml-4 inline-flex items-center gap-2 rounded-xl bg-[#9179E0] px-6 py-3 text-white font-semibold shadow-lg hover:bg-[#7E6BDB] hover:scale-105 transition-all"
              >
                <User size={18} />
                Dashboard
              </Link>
            ) : (
              <button
                onClick={handlePortalClick}
                disabled={portalLoading}
                className="ml-4 inline-flex items-center gap-2 rounded-xl bg-[#9179E0] px-6 py-3 text-white font-semibold shadow-lg hover:bg-[#7E6BDB] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {portalLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Portal
                    <MoveRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-xl hover:bg-gray-50 transition"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute left-0 top-1 h-0.5 w-full bg-gray-800 transition-all ${
                  isOpen ? "rotate-45 top-3" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-full bg-gray-800 transition-all ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-5 h-0.5 w-full bg-gray-800 transition-all ${
                  isOpen ? "-rotate-45 top-3" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-2xl shadow-2xl border-t transition-all duration-500 ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 py-6 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.id}>
              <div className="flex items-center justify-between">
                <Link
                  href={item.url}
                  onClick={() => !item.dropdown && setIsOpen(false)}
                  className="flex-1 px-4 py-3 text-base font-medium text-gray-800 hover:bg-purple-50 rounded-lg"
                >
                  {item.name}
                </Link>

                {item.dropdown && (
                  <button
                    onClick={() => toggleMobileDropdown(item.id)}
                    className="p-3 rounded-lg text-gray-800 hover:bg-gray-50"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        mobileDropdowns[item.id] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {item.dropdown && (
                <div
                  className={`ml-4 overflow-hidden transition-all ${
                    mobileDropdowns[item.id] ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.dropdown.map((subItem, index) => (
                    <Link
                      key={index}
                      href={subItem.url}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-purple-50 rounded-lg"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Mobile Portal */}
          <div className="pt-4">
            {authLoading ? (
              <div className="w-full flex justify-center items-center gap-2 rounded-xl bg-gray-200 px-8 py-3.5 text-gray-400 font-semibold">
                <Loader2 size={20} className="animate-spin" />
                Loading...
              </div>
            ) : isAuthenticated ? (
              <Link
                href="/portal"
                onClick={() => setIsOpen(false)}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#9179E0] px-8 py-3.5 text-white font-semibold shadow-xl hover:bg-[#7E6BDB]"
              >
                <User size={20} />
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={(e) => {
                  handlePortalClick(e);
                  setIsOpen(false);
                }}
                disabled={portalLoading}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#9179E0] px-8 py-3.5 text-white font-semibold shadow-xl hover:bg-[#7E6BDB] disabled:opacity-50"
              >
                {portalLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Login to Portal
                    <MoveRight size={20} />
                  </>
                )}
              </button>
            )}
          </div>

          <div className="text-center pt-6">
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