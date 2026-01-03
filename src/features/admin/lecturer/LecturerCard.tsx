'use client';

import Image from 'next/image';
import { Edit2, Trash2, Mail, MapPin, BookOpen } from 'lucide-react';
import { Lecturer } from '@/src/lib/types/lecturer';

interface LecturerCardProps {
  lecturer: Lecturer;
  onEdit: (lecturer: Lecturer) => void;
  onDelete: (lecturer: Lecturer) => void;
}

export default function LecturerCard({ lecturer, onEdit, onDelete }: LecturerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-64 bg-gray-100">
        <Image
          src={lecturer.image}
          alt={lecturer.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onEdit(lecturer)}
            className="p-2 bg-white/90 backdrop-blur-sm text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(lecturer)}
            className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              lecturer.status === 'active'
                ? 'bg-green-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {lecturer.status}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#9179E0] transition-colors">
          {lecturer.name}
        </h3>
        <p className="text-sm text-[#9179E0] font-semibold mb-1">{lecturer.title}</p>
        <p className="text-xs text-gray-500 font-medium mb-3">{lecturer.qualifications}</p>

        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-sm text-gray-700 line-clamp-2">{lecturer.specialization}</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{lecturer.email}</span>
          </div>
          {lecturer.officeLocation && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{lecturer.officeLocation}</span>
            </div>
          )}
        </div>

        {lecturer.courses.length > 0 && (
          <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}