"use client"
import { useState, useEffect } from 'react';
import { ExternalLink, Loader2, Globe, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

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
    const iconClass = "w-4 h-4";
    const icons: { [key: string]: any } = {
      website: <Globe className={iconClass} />,
      twitter: <Twitter className={iconClass} />,
      facebook: <Facebook className={iconClass} />,
      instagram: <Instagram className={iconClass} />,
      linkedin: <Linkedin className={iconClass} />
    };
    return icons[platform] || null;
  };

  if (loading) {
    return (
      <section className="py-12 bg-white w-full">
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
    <section className="py-12 md:py-16 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Featured Business Partners
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and support amazing student businesses
          </p>
        </div>

        {/* Banner Card */}
        <div className="relative mb-12">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative w-full aspect-[3/1] bg-gray-50">
              <img
                src={currentBanner.image.url}
                alt={currentBanner.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {currentBanner.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-gray-600 line-clamp-1 leading-relaxed">
                    {currentBanner.description}
                  </p>

                  {socialLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {socialLinks.map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-2 py-0.5 md:px-4 md:py-2 bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-purple-600 rounded-lg transition-all duration-200 text-sm font-medium"
                        >
                          {getSocialIcon(platform)}
                          <span className="capitalize">{platform}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {socialLinks.length > 0 && (
                  <a
                    href={socialLinks[0][1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors duration-200 whitespace-nowrap"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {banners.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-purple-600' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-purple-600 rounded-2xl shadow-lg p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Want Your Brand Featured Here?
          </h3>
          <p className="text-sm md:text-base text-purple-100 mb-6 max-w-2xl mx-auto">
            Join our growing community of student entrepreneurs and showcase your business to thousands of potential customers.
          </p>
          <a
            href="https://forms.gle/owXUvwan9sKcEH5k7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-purple-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span>Become a Partner</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BusinessBannerCarousel;