import React, { useState } from 'react';
import { ArrowRight, BookOpen, Users, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ExploreOurCourses = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [displayCount, setDisplayCount] = useState(8);

  const filters = ['All', '100 level', '200 level', '300 level', '400 level', 'General Studies'];

  const courses = [
    {
      code: 'SOW 101',
      title: 'Introduction to Social Work',
      description: 'Foundational concepts and principles of social work practice',
      level: '100 level',
      image: '/assets/courses/sow101.png',
      students: 120,
      duration: '12 weeks'
    },
    {
      code: 'SOW 102',
      title: 'Human Behavior and Development',
      description: 'Understanding human growth and development across the lifespan',
      level: '100 level',
      image: '/assets/courses/sow102.png',
      students: 115,
      duration: '12 weeks'
    },
    {
      code: 'SOW 103',
      title: 'Introduction to Social Welfare',
      description: 'Overview of social welfare systems and policies',
      level: '100 level',
      image: '/assets/courses/sow103.png',
      students: 110,
      duration: '12 weeks'
    },
    {
      code: 'SOW 104',
      title: 'Communication Skills for Social Workers',
      description: 'Developing effective communication techniques',
      level: '100 level',
      image: '/assets/courses/sow104.png',
      students: 105,
      duration: '12 weeks'
    },
    {
      code: 'SOW 211',
      title: 'History and Philosophy of Social Work & Social Welfare',
      description: 'Evolution and philosophical foundations of social work',
      image: '/assets/courses/sow211.png',
      level: '200 level',
      students: 95,
      duration: '12 weeks'
    },
    {
      code: 'SOW 212',
      title: 'Theory & Practice of Social Work',
      description: 'Core theories and practical applications in social work',
      image: '/assets/courses/sow212.png',
      level: '200 level',
      students: 90,
      duration: '12 weeks'
    },
    {
      code: 'SOW 213',
      title: 'Social Research Methods',
      description: 'Research methodologies in social work practice',
      image: '/assets/courses/sow213.png',
      level: '200 level',
      students: 85,
      duration: '12 weeks'
    },
    {
      code: 'SOW 214',
      title: 'Community Organization',
      description: 'Principles of community development and organization',
      image: '/assets/courses/sow214.png',
      level: '200 level',
      students: 88,
      duration: '12 weeks'
    },
    {
      code: 'SOW 320',
      title: 'Social Planning & Programme Development',
      description: 'Getting Involved Through the Consolidated Planning Process',
      image: '/assets/courses/sow320.png',
      level: '300 level',
      students: 75,
      duration: '12 weeks'
    },
    {
      code: 'SOW 322',
      title: 'Mental Health and Social Work',
      description: 'Theory and Philosophy of Mental Health Practice',
      image: '/assets/courses/sow322.png',
      level: '300 level',
      students: 80,
      duration: '12 weeks'
    },
    {
      code: 'SOW 323',
      title: 'Social Work with Groups',
      description: 'Group work theories and intervention strategies',
      image: '/assets/courses/sow323.png',
      level: '300 level',
      students: 70,
      duration: '12 weeks'
    },
    {
      code: 'SOW 324',
      title: 'Social Policy Analysis',
      description: 'Critical analysis of social policies and their impact',
      image: '/assets/courses/sow324.png',
      level: '300 level',
      students: 72,
      duration: '12 weeks'
    },
    {
      code: 'SOW 410',
      title: 'Advanced Clinical Practice',
      description: 'Advanced therapeutic interventions and case management',
      image: '/assets/courses/sow410.png',
      level: '400 level',
      students: 60,
      duration: '12 weeks'
    },
    {
      code: 'SOW 411',
      title: 'Social Work Administration',
      description: 'Leadership and management in social service organizations',
      image: '/assets/courses/sow411.png',
      level: '400 level',
      students: 55,
      duration: '12 weeks'
    },
    {
      code: 'SOW 412',
      title: 'Field Work Practice',
      description: 'Supervised practical experience in social work settings',
      image: '/assets/courses/sow412.png',
      level: '400 level',
      students: 65,
      duration: '12 weeks'
    },
    {
      code: 'SOW 413',
      title: 'Social Work Ethics and Law',
      description: 'Professional ethics and legal frameworks in practice',
      image: '/assets/courses/sow413.png',
      level: '400 level',
      students: 58,
      duration: '12 weeks'
    },
    {
      code: 'GST 101',
      title: 'Use of English',
      description: 'Communication skills and academic writing',
      image: '/assets/courses/gst101.png',
      level: 'General Studies',
      students: 200,
      duration: '12 weeks'
    },
    {
      code: 'GST 102',
      title: 'Nigerian Peoples and Culture',
      description: 'Understanding Nigerian diversity and cultural heritage',
      image: '/assets/courses/gst102.png',
      level: 'General Studies',
      students: 195,
      duration: '12 weeks'
    },
    {
      code: 'GST 201',
      title: 'Entrepreneurship Studies',
      description: 'Business development and entrepreneurial skills',
      image: '/assets/courses/gst201.png',
      level: 'General Studies',
      students: 180,
      duration: '12 weeks'
    }
  ];

  const filteredCourses = activeFilter === 'All' 
    ? courses 
    : courses.filter(course => course.level === activeFilter);

  const coursesToDisplay = activeFilter === 'All' 
    ? filteredCourses.slice(0, displayCount)
    : filteredCourses;

  const hasMoreCourses = activeFilter === 'All' && displayCount < filteredCourses.length;

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setDisplayCount(8);
  };

  const getLevelColor = (level: string): string => {
    switch(level) {
      case '100 level': return 'bg-blue-500';
      case '200 level': return 'bg-purple-500';
      case '300 level': return 'bg-orange-500';
      case '400 level': return 'bg-red-500';
      case 'General Studies': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
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

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-[#9179E0] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#9179E0]/30 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Course Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing <span className="font-bold text-[#4a368f]">{coursesToDisplay.length}</span> 
            {activeFilter === 'All' && filteredCourses.length > coursesToDisplay.length && (
              <> of <span className="font-bold text-[#4a368f]">{filteredCourses.length}</span></>
            )} course{coursesToDisplay.length !== 1 ? 's' : ''}
            {activeFilter !== 'All' && ` in ${activeFilter}`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {coursesToDisplay.map((course, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#9179E0]/20 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <div className={`text-xs font-bold ${getLevelColor(course.level)} text-white px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm`}>
                    {course.level}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-bold text-xl text-[#4a368f] mb-1 group-hover:text-[#9179E0] transition-colors">
                    {course.code}
                  </h3>
                  <p className="text-gray-900 text-sm font-semibold mb-2 line-clamp-2 leading-snug">
                    {course.title}
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.code.toLowerCase().replace(' ', '-')}`}
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
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No courses found for this level.</p>
            <p className="text-gray-500 text-sm mt-2">Try selecting a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreOurCourses;