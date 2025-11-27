"use client"
import { useEffect, useState } from 'react';
import MobileHeroCarousel from './MobileHeroCarousel';
import HeroCarousel from './DesktopHeroCarousel';


export default function Hero() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileHeroCarousel /> : <HeroCarousel />;
}