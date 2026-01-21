"use client"
import { useState, useEffect, JSX } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

interface Banner {
  _id: string;
  title: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  socialLinks: {
    website?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  isActive: boolean;
  order: number;
}

const BusinessBannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners?active=true');
      const data = await response.json();
      
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    const icons: { [key: string]: JSX.Element } = {
      website: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
      twitter: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      facebook: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      instagram: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      linkedin: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    };
    return icons[platform] || null;
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];
  const socialLinks = Object.entries(currentBanner.socialLinks).filter(([_, url]) => url);

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center md:text-left mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-3 sm:mb-4">
            <div className="hidden md:block w-6 h-6 bg-green-500 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900 leading-tight">
              Grow Your Brand Where It Matters
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            We showcase businesses that believe in growth, trust, and real impact.
          </p>
        </div>

        <div className="relative mb-8 sm:mb-12 md:mb-16">
          <div className="bg-black rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 sm:border-4 border-purple-200">
            <div className="relative w-full h-64 sm:h-80 lg:h-[200px] xl:h-[650px]">
              <img
                src={currentBanner.image.url}
                alt={currentBanner.title}
                className="w-full object-contain h-94"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-6">
                <div className="w-full md:max-w-3xl space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg leading-tight line-clamp-2 sm:line-clamp-3">
                    {currentBanner.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                    {currentBanner.description}
                  </p>

                  {/* Social Links */}
                  {socialLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2">
                      {socialLinks.map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition-all duration-300 hover:scale-105"
                        >
                          {getSocialIcon(platform)}
                          <span className="text-xs sm:text-sm font-medium capitalize">{platform}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dots Indicator */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'w-6 sm:w-8 bg-white' 
                          : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to banner ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Want Your Brand Featured Here?
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-white/90 mb-5 sm:mb-6 w-full max-w-2xl mx-auto leading-relaxed">
            We offer premium banner placements for student-businesses looking to increase visibility and reach.
          </p>
          <a
            href="https://forms.gle/owXUvwan9sKcEH5k7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white hover:bg-gray-100 text-purple-600 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>Become a Brand Partner</span>
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BusinessBannerCarousel;