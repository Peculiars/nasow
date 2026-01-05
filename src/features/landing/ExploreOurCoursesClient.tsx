"use client";

import React, { useState, useMemo } from 'react';
import { ArrowRight, BookOpen, Users, Clock, FileText, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Course {
  _id: string;
  code: string;
  title: string;
  description: string;
  level: string;
  studentType: string;
  image: string;
  students: number;
  duration: string;
  weekCount: number;
  materialCount: number;
}

interface ExploreCoursesClientProps {
  courses: Course[];
}

export default function ExploreCoursesClient({ courses }: ExploreCoursesClientProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [displayCount, setDisplayCount] = useState(8);

  const levels = useMemo(() => {
    const uniqueLevels = Array.from(new Set(courses.map(c => c.level)));
    return ['All', ...uniqueLevels.sort()];
  }, [courses]);

  const types = ['All', 'FULL_TIME', 'ICE'];

  const filteredCourses = useMemo(() => {
  return courses.filter(course => {
    const levelMatch = activeFilter === 'All' || 
      course.level === activeFilter || 
      course.level === activeFilter.replace('L', '') ||
      course.level === `${activeFilter}L` ||
      `${course.level}L` === activeFilter;

    const normalizedCourseType = course.studentType.toUpperCase().replace(/[\s,-]/g, '_');

    const typeMatch = activeTypeFilter === 'All' ||
      normalizedCourseType.includes('BOTH') ||
      (activeTypeFilter === 'FULL_TIME' && 
        (normalizedCourseType.includes('FULL_TIME') || normalizedCourseType.includes('BOTH'))) ||
      (activeTypeFilter === 'ICE' && 
        (normalizedCourseType.includes('ICE') || normalizedCourseType.includes('BOTH')));

    return levelMatch && typeMatch;
  });
}, [courses, activeFilter, activeTypeFilter]);

  const coursesToDisplay = activeFilter === 'All' && activeTypeFilter === 'All'
    ? filteredCourses.slice(0, displayCount)
    : filteredCourses;

  const hasMoreCourses = activeFilter === 'All' && activeTypeFilter === 'All' && displayCount < filteredCourses.length;

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setDisplayCount(8);
  };

  const handleTypeFilterChange = (type: string) => {
    setActiveTypeFilter(type);
    setDisplayCount(8);
  };

  const getLevelColor = (level: string): string => {
    const levelNum = level.replace('L', '');
    switch(levelNum) {
      case '100': return 'bg-blue-500';
      case '200': return 'bg-purple-500';
      case '300': return 'bg-orange-500';
      case '400': return 'bg-red-500';
      case '500': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const formatLevel = (level: string): string => {
    if (level.endsWith('L')) return level;
    return `${level}L`;
  };

  const formatStudentType = (type: string): string => {
  const normalized = type.toUpperCase().replace(/[\s,-]/g, '_');
  
  if (normalized.includes('BOTH')) return 'Full-time & ICE';
  if (normalized.includes('FULL_TIME')) return 'Full-time';
  if (normalized.includes('ICE')) return 'ICE';
  
  return type;
};

  return (
    <div className="w-full bg-white py-16 md:py-24 font-inter">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center md:text-left mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
            <div className="hidden md:block size-6 bg-green-500" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">
              Explore Our Courses
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Comprehensive curriculum designed to shape competent and compassionate social work professionals
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Level</h3>
          <div className="flex flex-wrap gap-3">
            {levels.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-[#9179E0] text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#9179E0]/30 hover:bg-gray-50'
                }`}
              >
                {filter === 'All' ? filter : formatLevel(filter)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Student Type</h3>
          <div className="flex flex-wrap gap-3">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeFilterChange(type)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTypeFilter === type
                    ? 'bg-[#9179E0] text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#9179E0]/30 hover:bg-gray-50'
                }`}
              >
                {type === 'All' ? type : formatStudentType(type)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-600">
            Showing <span className="font-bold text-[#4a368f]">{coursesToDisplay.length}</span> 
            {(activeFilter === 'All' && activeTypeFilter === 'All') && filteredCourses.length > coursesToDisplay.length && (
              <> of <span className="font-bold text-[#4a368f]">{filteredCourses.length}</span></>
            )} course{coursesToDisplay.length !== 1 ? 's' : ''}
            {(activeFilter !== 'All' || activeTypeFilter !== 'All') && (
              <span className="text-sm ml-2">
                ({activeFilter !== 'All' && formatLevel(activeFilter)}
                {activeFilter !== 'All' && activeTypeFilter !== 'All' && ' • '}
                {activeTypeFilter !== 'All' && formatStudentType(activeTypeFilter)})
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {coursesToDisplay.map((course) => (
            <div
              key={course._id}
              className="group bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#9179E0]/20 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-48 relative overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className={`text-xs font-bold ${getLevelColor(course.level)} text-white px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm`}>
                    {formatLevel(course.level)}
                  </div>
                  <div className="text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg shadow-lg">
                    {formatStudentType(course.studentType)}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-[#4a368f] mb-1 group-hover:text-[#9179E0] transition-colors">
                    {course.code}
                  </h3>
                  <p className="text-gray-900 text-sm font-semibold mb-2 line-clamp-2 leading-snug">
                    {course.title}
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1" title="Weeks">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{course.weekCount} weeks</span>
                  </div>
                  <div className="flex items-center gap-1" title="Materials">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{course.materialCount}</span>
                  </div>
                </div>

                <Link
                  href={`/portal/courses/${course._id}`}
                  className="flex items-center justify-center gap-2 w-full bg-[#9179E0] hover:bg-[#7E6BDB] text-white font-bold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  View Course
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {hasMoreCourses && (
          <div className="flex justify-center">
            <button 
              onClick={handleShowMore}
              className="group bg-white border-2 border-[#9179E0] hover:bg-[#9179E0] text-[#9179E0] hover:text-white font-bold px-10 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Load More Courses
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {coursesToDisplay.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No courses found</p>
            <p className="text-gray-500 text-sm mt-2">
              {activeFilter === 'All' && activeTypeFilter === 'All' 
                ? 'No published courses available yet'
                : 'Try selecting different filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}