"use client";

import { useState, useEffect } from 'react';
import { Search, BookOpen, Loader2, GraduationCap, AlertCircle } from 'lucide-react';
import { showError } from '@/src/lib/toast';
import ProfileGuard from '@/src/features/students/components/ProfileGuard';
import CourseCard from '@/src/features/students/components/CourseCard';

interface Course {
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
}

interface StudentInfo {
  level: string;
  studentType: string;
  fullName: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(search.toLowerCase()) ||
        course.lecturerName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [search, courses]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/students/courses');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.data);
      setFilteredCourses(data.data);
      setStudentInfo(data.student);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      showError(error.message || 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileGuard>
      <div className="min-h-screen bg-gray-50 font-inter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
                {studentInfo && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{studentInfo.level}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{studentInfo.studentType}</span>
                  </div>
                )}
              </div>
              <div className="hidden sm:block">
                <div className="bg-[#9179E0] text-white px-6 py-3 rounded-xl shadow-lg">
                  <div className="text-sm opacity-90">Total Courses</div>
                  <div className="text-2xl font-bold">{courses.length}</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by title, code, or lecturer..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading your courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
              {search ? (
                <>
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-600 mb-4">
                    No courses match your search "{search}"
                  </p>
                  <button
                    onClick={() => setSearch('')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Clear Search
                  </button>
                </>
              ) : courses.length === 0 ? (
                <>
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses available yet</h3>
                  <p className="text-gray-600">
                    Courses for {studentInfo?.level} {studentInfo?.studentType} students will appear here once they're published.
                  </p>
                </>
              ) : null}
            </div>
          ) : (
            <>
              {search && (
                <div className="mb-4 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-700">
                    Found <span className="font-bold text-purple-600">{filteredCourses.length}</span> course
                    {filteredCourses.length !== 1 ? 's' : ''} matching "{search}"
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </>
          )}

          {!isLoading && courses.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-blue-900 mb-1">Course Access</p>
                  <p>You're viewing courses available for <span className="font-semibold">{studentInfo?.level} {studentInfo?.studentType}</span> students. If you need access to courses from other levels, please contact your administrator.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProfileGuard>
  );
}