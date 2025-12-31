"use client"
import MobileHeroCarousel from './MobileHeroCarousel';
import HeroCarousel from './DesktopHeroCarousel';

export default function Hero() {
  return (
    <>
      <div className="block md:hidden">
        <MobileHeroCarousel />
      </div>
      <div className="hidden md:block">
        <HeroCarousel />
      </div>
    </>
  );
}