import { slides } from "@/src/Data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

const MobileHeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !mounted) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, mounted]);

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!mounted) {
    return (
      <div className="relative h-[90vh] overflow-hidden bg-black font-inter" />
    );
  }

  return (
    <div className="relative h-[90vh] overflow-hidden bg-black font-inter">
      {slides.map((slide: Slide, index: number) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 h-full w-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ filter: 'brightness(0.5)' }}
              priority={index === 0}
              quality={95}
            />
          </div>

          <div className="relative h-full flex flex-col justify-end px-5 pb-24">
            <div className="space-y-3 mb-2">
              <h1 className="text-2xl font-bold text-white leading-tight">
                {slide.title}
              </h1>
              <p className="text-sm text-gray-200 leading-relaxed">
                {slide.subtitle}
              </p>
              <Link
                href={slide.buttonLink}
                className="inline-block px-5 py-2.5 bg-white text-black font-semibold rounded-lg shadow-lg active:bg-gray-100 transition-all duration-300 text-sm mt-2"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm active:bg-white/30 transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm active:bg-white/30 transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_: Slide, index: number) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="absolute top-4 right-4 text-right z-10">
        <p className="text-xs text-white/70">Website designed by the</p>
        <p className="text-xs text-white font-semibold">2025/2026 excos</p>
      </div>
    </div>
  );
};

export default MobileHeroCarousel;