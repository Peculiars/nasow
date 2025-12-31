"use client"
import { useEffect, useState } from 'react';
import MobileHeroCarousel from './MobileHeroCarousel';
import HeroCarousel from './DesktopHeroCarousel';

export default function Hero() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  if (isMobile === null) {
    return (
      <div className="relative w-full h-[90vh] md:h-[650px] bg-[#6B46C1]" />
    );
  }

  return isMobile ? <MobileHeroCarousel /> : <HeroCarousel />;
}