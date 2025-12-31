import { BookOpen, User, FileText, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    courseCode: string;
    lecturerName: string;
    description?: string;
    coverImage: {
      url: string;
      publicId: string;
    };
    weeks: any[];
    createdAt: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const materialCount = course.weeks.reduce((total, week) => total + week.materials.length, 0);
  const weekCount = course.weeks.length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/portal/courses/${course._id}`}>
      <div className="group bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-purple-400 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
          {course.coverImage?.url ? (
            <Image
              src={course.coverImage.url}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-purple-300" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-purple-600">{course.courseCode}</span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {course.title}
          </h3>

          {course.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.description}
            </p>
          )}

          <div className="mt-auto space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{course.lecturerName}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(course.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium">{weekCount} weeks</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-green-500" />
                  <span className="font-medium">{materialCount} materials</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm font-semibold text-purple-600 group-hover:text-purple-700">
              View Course →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}