import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LecturersGrid from '@/src/features/lecturer/LecturersGrid';
import { LecturerCardSkeleton } from '@/src/features/landing/SkeletonLoader';

export function LecturersSkeletonGrid() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 font-inter w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <LecturerCardSkeleton key={i} />
          ))}
        </div>

        <div className="flex justify-center">
          <div className="h-14 w-64 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export const metadata = {
  title: 'Our Lecturers | NASOW',
  description: 'Meet our experienced faculty members dedicated to excellence in social work education',
};

export default function LecturersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#4a368f] to-[#9179E0] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our Lecturers
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Meet our dedicated team of experienced professionals committed to shaping the next generation of social workers
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <LecturersSkeletonGrid/>
          </div>
        }
      >
        <LecturersGrid />
      </Suspense>
    </div>
  );
}