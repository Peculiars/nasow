'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mail, BookOpen } from 'lucide-react';

interface Lecturer {
  _id: string;
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  email: string;
  image: string;
  courses: string[];
}

interface LecturerPublicCardProps {
  lecturer: Lecturer;
}

export default function LecturerPublicCard({ lecturer }: LecturerPublicCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#9179E0]/20 transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <Image
          src={lecturer.image}
          alt={lecturer.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            href={`mailto:${lecturer.email}`}
            className="flex items-center justify-center gap-2 w-full bg-white text-[#4a368f] px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact
          </Link>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#9179E0] transition-colors">
          {lecturer.name}
        </h3>
        <p className="text-sm text-[#9179E0] font-semibold mb-1">
          {lecturer.title}
        </p>
        <p className="text-xs text-gray-500 font-medium mb-3">
          {lecturer.qualifications}
        </p>

        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
            {lecturer.specialization}
          </p>
        </div>

        {lecturer.courses.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {lecturer.courses.slice(0, 3).map((course, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold bg-[#9179E0]/10 text-[#9179E0] px-2 py-1 rounded"
                >
                  {course}
                </span>
              ))}
              {lecturer.courses.length > 3 && (
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  +{lecturer.courses.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <Link
          href={`/lecturers/${lecturer._id}`}
          className="flex items-center justify-center gap-2 w-full text-gray-700 hover:text-[#9179E0] font-semibold text-sm py-2 transition-colors group/link"
        >
          View Profile
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}