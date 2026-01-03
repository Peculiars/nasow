import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LecturersGrid from '@/src/features/lecturer/LecturersGrid';

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
            <Loader2 className="w-8 h-8 animate-spin text-[#9179E0]" />
          </div>
        }
      >
        <LecturersGrid />
      </Suspense>
    </div>
  );
}