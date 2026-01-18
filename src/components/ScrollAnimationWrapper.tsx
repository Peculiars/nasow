"use client"
import { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once !== false) {
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options.threshold, options.rootMargin, options.once]);

  return [elementRef, isVisible] as const;
}

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
}

interface AnimationStyle {
  initial: CSSProperties;
  animate: CSSProperties;
}

export default function ScrollAnimationWrapper({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  duration = 0.9,
  threshold = 0.1
}: ScrollAnimationWrapperProps) {
  const [ref, isVisible] = useScrollAnimation({ threshold });

  const animations: Record<AnimationType, AnimationStyle> = {
    'fade-up': { 
      initial: { opacity: 1, transform: 'translateY(30px)' }, 
      animate: { opacity: 1, transform: 'translateY(0)' } 
    },
    'fade-down': { 
      initial: { opacity: 1, transform: 'translateY(-30px)' }, 
      animate: { opacity: 1, transform: 'translateY(0)' } 
    },
    'fade-left': { 
      initial: { opacity: 1, transform: 'translateX(30px)' }, 
      animate: { opacity: 1, transform: 'translateX(0)' } 
    },
    'fade-right': { 
      initial: { opacity: 1, transform: 'translateX(-30px)' }, 
      animate: { opacity: 1, transform: 'translateX(0)' } 
    },
    'zoom-in': { 
      initial: { opacity: 1, transform: 'scale(0.9)' }, 
      animate: { opacity: 1, transform: 'scale(1)' } 
    }
  };

  const selected = animations[animation];

  return (
    <div className='bg-white'
      ref={ref} 
      style={{
        ...selected.initial,
        ...(isVisible ? selected.animate : {}),
        transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`
      }}
    >
      {children}
    </div>
  );
}