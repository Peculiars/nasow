"use client";

import { useState, useEffect } from 'react';
import { Search, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { showError } from '@/src/lib/toast';
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
  level?: string;
  semester?: string;
}

export default function CoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | number>('all');
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'FIRST' | 'SECOND'>('all');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const getCourseLevel = (course: Course): number => {
    if (course.level) {
      const levelNum = parseInt(course.level);
      if (!isNaN(levelNum)) {
        return levelNum;
      }
    }
    
    const match = course.courseCode.match(/(\d)/);
    if (match) {
      const firstDigit = parseInt(match[1]);
      return firstDigit * 100;
    }
    return 0;
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => {
        const level = getCourseLevel(course);
        return level === selectedLevel;
      });
    }

    // Filter by semester
    if (selectedSemester !== 'all') {
      filtered = filtered.filter(course => 
        course.semester?.toUpperCase() === selectedSemester
      );
    }

    // Filter by search
    if (search.trim()) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(search.toLowerCase()) ||
        course.lecturerName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [search, courses, selectedLevel, selectedSemester]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/students/courses');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch courses');
      }

      const data = await response.json();
      console.log('data', data);
      setCourses(data.data);
      setFilteredCourses(data.data);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      showError(error.message || 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const getCoursesCountByLevel = (level: number) => {
    return courses.filter(course => {
      const courseLevel = getCourseLevel(course);
      return courseLevel === level;
    }).length;
  };

  const getCoursesCountBySemester = (semester: 'all' | 'FIRST' | 'SECOND') => {
    if (semester === 'all') return courses.length;
    return courses.filter(course => 
      course.semester?.toUpperCase() === semester
    ).length;
  };

  const levels: Array<{ value: 'all' | number; label: string; count: number }> = [
    { value: 'all' as const, label: 'All Levels', count: courses.length },
    { value: 100, label: '100 Level', count: getCoursesCountByLevel(100) },
    { value: 200, label: '200 Level', count: getCoursesCountByLevel(200) },
    { value: 300, label: '300 Level', count: getCoursesCountByLevel(300) },
    { value: 400, label: '400 Level', count: getCoursesCountByLevel(400) },
    { value: 500, label: '500 Level', count: getCoursesCountByLevel(500) },
  ];

  const semesters: Array<{ value: 'all' | 'FIRST' | 'SECOND'; label: string; count: number }> = [
    { value: 'all' as const, label: 'All Semesters', count: courses.length },
    { value: 'FIRST', label: 'First Semester', count: getCoursesCountBySemester('FIRST') },
    { value: 'SECOND', label: 'Second Semester', count: getCoursesCountBySemester('SECOND') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
              <p className="text-gray-600">Browse all available courses by level and semester</p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-[#9179E0] text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-sm opacity-90">Total Courses</div>
                <div className="text-2xl font-bold">{courses.length}</div>
              </div>
            </div>
          </div>

          {/* Filters Container */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#9179E0] rounded-full"></div>
              <h3 className="text-lg font-bold text-[#4a368f]">Filter Courses</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Level Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 block">
                  Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setSelectedLevel(level.value)}
                      className={`px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300 ${
                        selectedLevel === level.value
                          ? 'bg-[#9179E0] text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-[#9179E0]/40 hover:bg-purple-50'
                      }`}
                    >
                      {level.label}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        selectedLevel === level.value
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {level.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester Filter */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 block">
                  Semester
                </label>
                <div className="flex flex-wrap gap-2">
                  {semesters.map((semester) => (
                    <button
                      key={semester.value}
                      onClick={() => setSelectedSemester(semester.value)}
                      className={`px-4 py-2 rounded-lg font-medium text-xs transition-all duration-300 ${
                        selectedSemester === semester.value
                          ? 'bg-[#9179E0] text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-[#9179E0]/40 hover:bg-purple-50'
                      }`}
                    >
                      {semester.label}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        selectedSemester === semester.value
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {semester.count}
                      </span>
                    </button>
                  ))}
                </div>
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
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            {search || selectedLevel !== 'all' || selectedSemester !== 'all' ? (
              <>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">
                  {search && selectedLevel !== 'all' && selectedSemester !== 'all'
                    ? `No courses match your search "${search}" in ${levels.find(l => l.value === selectedLevel)?.label}, ${semesters.find(s => s.value === selectedSemester)?.label}`
                    : search && selectedLevel !== 'all'
                    ? `No courses match your search "${search}" in ${levels.find(l => l.value === selectedLevel)?.label}`
                    : search && selectedSemester !== 'all'
                    ? `No courses match your search "${search}" in ${semesters.find(s => s.value === selectedSemester)?.label}`
                    : search
                    ? `No courses match your search "${search}"`
                    : selectedLevel !== 'all' && selectedSemester !== 'all'
                    ? `No courses available for ${levels.find(l => l.value === selectedLevel)?.label}, ${semesters.find(s => s.value === selectedSemester)?.label}`
                    : selectedLevel !== 'all'
                    ? `No courses available for ${levels.find(l => l.value === selectedLevel)?.label}`
                    : `No courses available for ${semesters.find(s => s.value === selectedSemester)?.label}`
                  }
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedLevel('all');
                    setSelectedSemester('all');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses available yet</h3>
                <p className="text-gray-600">
                  Courses will appear here once they're published.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {(search || selectedLevel !== 'all' || selectedSemester !== 'all') && (
              <div className="mb-4 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-700">
                  Found <span className="font-bold text-purple-600">{filteredCourses.length}</span> course
                  {filteredCourses.length !== 1 ? 's' : ''}
                  {selectedLevel !== 'all' && ` in ${levels.find(l => l.value === selectedLevel)?.label}`}
                  {selectedSemester !== 'all' && ` in ${semesters.find(s => s.value === selectedSemester)?.label}`}
                  {search && ` matching "${search}"`}
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
                <p className="font-semibold text-blue-900 mb-1">Course Catalog</p>
                <p>Browse courses by level and semester using the filters above. Click on any course to explore its content and materials.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}