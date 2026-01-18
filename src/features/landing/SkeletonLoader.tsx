import React from 'react';

interface SkeletonProps {
  className?: string;
}

interface SkeletonCircleProps {
  size?: string;
}

interface SponsorCardSkeletonProps {
  tier?: 'platinum' | 'gold' | 'silver';
}

interface NewsEventCardSkeletonProps {
  featured?: boolean;
}

interface SkeletonSection {
  name: string;
  component: React.ReactNode;
}

type SkeletonKey = 'courses' | 'flashcards' | 'lecturers' | 'executives' | 'hod' | 'nasowite' | 'sponsors' | 'quiz' | 'news';

const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`} 
       style={{ animation: 'shimmer 2s infinite' }} />
);

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({ size = "w-12 h-12" }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded-full ${size}`}
       style={{ animation: 'shimmer 2s infinite' }} />
);

export const CourseCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden">
    <Skeleton className="h-48 rounded-none" />
    <div className="p-5 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
);

export const FlashcardSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-40 md:h-44 bg-white rounded-2xl border-2 border-gray-200 p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>
    ))}
  </div>
);

export const LecturerCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden">
    <Skeleton className="h-64 rounded-none" />
    <div className="p-5 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </div>
      <div className="space-y-2 py-4 border-t border-gray-100">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

export const ExecutiveCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
    <Skeleton className="h-80 rounded-none" />
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

export const HODSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
    <div className="lg:col-span-2 space-y-6">
      <Skeleton className="h-[500px] lg:h-[600px] rounded-2xl" />
      <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
    <div className="lg:col-span-3 space-y-6">
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6 space-y-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6 space-y-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-2xl border-2 border-gray-100 p-6 md:p-8 space-y-4">
          <Skeleton className="h-6 w-48" />
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-start gap-3">
              <Skeleton className="h-2 w-2 rounded-full mt-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const NasowiteCardSkeleton = () => (
  <section className="py-16 md:py-24 bg-gray-50 font-inter w-full">
    <div className="px-6 max-w-7xl mx-auto lg:px-8 animate-pulse">
      <div className="mb-12">
        <div className="h-10 w-72 bg-gray-200 rounded-lg mb-3" />
        <div className="h-5 w-96 bg-gray-200 rounded" />
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="h-[600px] bg-gray-200" />

        <div className="p-10 space-y-6">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-40 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>

          <div className="h-20 bg-gray-200 rounded" />

          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-5/6" />
            ))}
          </div>

          <div className="h-12 w-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
      <div className="lg:hidden h-[500px] bg-gray-200 rounded-3xl shadow-xl mt-8" />
    </div>
  </section>
);


export const SponsorCardSkeleton = () => (
  <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 font-inter w-full animate-pulse">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-4" />
        <div className="h-10 w-96 bg-gray-200 rounded mx-auto mb-4" />
        <div className="h-4 w-[520px] bg-gray-200 rounded mx-auto" />
      </div>

      {/* Platinum Skeleton */}
      <div className="mb-16">
        <div className="h-8 w-56 bg-gray-200 rounded mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
              <div className="h-48 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gold Skeleton */}
      <div className="mb-16">
        <div className="h-7 w-48 bg-gray-200 rounded mx-auto mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border-2 border-gray-200 shadow-lg">
              <div className="h-40 bg-gray-200" />
              <div className="p-5 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Silver Skeleton */}
      <div className="mb-16">
        <div className="h-6 w-40 bg-gray-200 rounded mx-auto mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200">
              <div className="h-32 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA + Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="h-64 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
      </div>

      <div className="h-48 bg-gray-200 rounded-3xl" />
    </div>
  </section>
)


export const QuizCardSkeleton = () => (
  <section className="py-16 md:py-24 bg-white w-full font-inter animate-pulse">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="mb-12">
        <div className="h-10 w-72 bg-gray-200 rounded mb-3" />
        <div className="h-5 w-96 bg-gray-200 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-md">
              <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
              <div className="h-12 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-5 bg-gray-100 rounded-xl">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-full bg-gray-200 rounded" />
              </div>
            </div>
          ))}

          <div className="bg-gray-100 rounded-2xl p-6">
            <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-200 rounded-xl mb-3" />
            ))}
          </div>

          <div className="h-14 bg-gray-200 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    </div>
  </section>
)


export const NewsEventCardSkeleton: React.FC<NewsEventCardSkeletonProps> = ({ featured = false }) => {
  if (featured) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <Skeleton className="h-64 rounded-none" />
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-5 space-y-4">
        <Skeleton className="h-6 w-full" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
};


const SkeletonLoaders: React.FC = () => {
  const [active, setActive] = React.useState<SkeletonKey>('courses');

  const skel: Record<SkeletonKey, SkeletonSection> = {
    courses: { name: 'Courses', component: <CourseCardSkeleton /> },
    flashcards: { name: 'Flashcards', component: <FlashcardSkeleton /> },
    lecturers: { name: 'Lecturers', component: <LecturerCardSkeleton /> },
    executives: { name: 'Executives', component: <ExecutiveCardSkeleton /> },
    hod: { name: 'HOD', component: <HODSkeleton /> },
    nasowite: { name: 'Nasowite', component: <NasowiteCardSkeleton /> },
    sponsors: { name: 'Sponsors', component: <SponsorCardSkeleton /> },
    quiz: { name: 'Quiz', component: <QuizCardSkeleton /> },
    news: { name: 'News/Events', component: <NewsEventCardSkeleton /> },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4a368f] mb-4">
            Beautiful Skeleton Loaders
          </h1>
          <p className="text-gray-600 mb-6">
            Professional animated loading states for all components with full TypeScript support
          </p>
          
          <div className="flex flex-wrap gap-2">
            {(Object.entries(skel) as [SkeletonKey, SkeletonSection][]).map(([key, { name }]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  active === key
                    ? 'bg-[#9179E0] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {skel[active].name} Skeleton
          </h2>
          {skel[active].component}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Implementation Guide
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p className="font-semibold">To use these skeletons in your TypeScript components:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Import the skeleton component you need</li>
              <li>Show it while loading is true</li>
              <li>Replace with actual content when data loads</li>
              <li>All components are fully typed with TypeScript interfaces</li>
            </ol>
            <div className="bg-gray-50 rounded-lg p-4 mt-4 font-mono text-xs space-y-2">
              <code className="block">{`import { CourseCardSkeleton } from './SkeletonLoaders';`}</code>
              <code className="block">{`{loading ? <CourseCardSkeleton /> : <CourseCard data={data} />}`}</code>
            </div>
            
            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">TypeScript Interfaces Available:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-blue-800">
                <li><code>SkeletonProps</code> - Base skeleton with className</li>
                <li><code>SkeletonCircleProps</code> - Circle skeleton with size</li>
                <li><code>SponsorCardSkeletonProps</code> - Sponsor with tier type</li>
                <li><code>NewsEventCardSkeletonProps</code> - News/Event with featured flag</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoaders;