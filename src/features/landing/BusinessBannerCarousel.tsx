"use client"
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGlobe } from 'react-icons/fa';
import Image from 'next/image';

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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

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

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
  };

  const getSocialIcon = (platform: string) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    switch (platform) {
      case 'website': return <FaGlobe className={iconClass} />;
      case 'twitter': return <FaTwitter className={iconClass} />;
      case 'facebook': return <FaFacebook className={iconClass} />;
      case 'instagram': return <FaInstagram className={iconClass} />;
      case 'linkedin': return <FaLinkedin className={iconClass} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50 font-inter w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#9179E0] animate-spin" />
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
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 font-inter w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center md:text-left mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-3 sm:mb-4">
            <div className="hidden md:block size-6 bg-green-500 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f] leading-tight">
              Grow Your Brand Where It Matters
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            We showcase businesses that believe in growth, trust, and real impact.
          </p>
        </div>

        {/* Banner Carousel */}
        <div className="relative mb-8 sm:mb-12 md:mb-16">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 sm:border-4 border-[#9179E0]/20">
            <div className="relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
              <Image
                src={currentBanner.image.url}
                alt={currentBanner.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-12">
                <div className="w-full md:max-w-3xl space-y-3 sm:space-y-4">
                  {/* Title - with responsive text sizing and line clamping */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg leading-tight line-clamp-2 sm:line-clamp-3">
                    {currentBanner.title}
                  </h3>
                  
                  {/* Description - with adaptive line clamping */}
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

              {/* Navigation Arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 group"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#9179E0]" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 group"
                    aria-label="Next banner"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#9179E0]" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setIsAutoPlaying(false);
                      }}
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
        <div className="bg-gradient-to-r from-[#9179E0] to-[#7E6BDB] rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Want Your Brand Featured Here?
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-white/90 mb-5 sm:mb-6 w-full max-w-2xl mx-auto leading-relaxed">
            We offer premium banner placements for student-businesses looking to increase visibility and reach.
          </p>
          <a
            href="https://forms.google.com/your-form-link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white hover:bg-gray-100 text-[#9179E0] rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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