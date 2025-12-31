import { slides } from "@/src/Data";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!mounted) {
    return (
      <div className="relative w-full bg-[#6B46C1] min-h-[550px] md:min-h-[600px] lg:min-h-[650px]" />
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#6B46C1]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
        >
          <div className="relative min-h-[550px] md:min-h-[600px] lg:min-h-[650px]">
            <div className="max-w-8xl mx-auto h-full flex items-center px-6 md:px-12 py-12 lg:py-16">
              <div className="max-w-xl w-full h-full flex flex-col justify-center pl-16 lg:justify-start lg:pt-24">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.buttonLink}
                  className="inline-block px-8 py-3.5 w-fit bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>

            <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="50vw"
                className="object-cover"
                style={{ objectPosition: 'left center' }}
                priority={index === 0}
                quality={75}
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;