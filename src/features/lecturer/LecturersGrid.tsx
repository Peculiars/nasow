'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, BookOpen } from 'lucide-react';
import LecturerPublicCard from './LecturerPublicCard';

interface Lecturer {
  _id: string;
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  email: string;
  image: string;
  courses: string[];
  researchInterests?: string[];
  status: 'active' | 'inactive';
}

export default function LecturersGrid() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [filteredLecturers, setFilteredLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLecturers();
  }, []);

  useEffect(() => {
    filterLecturers();
  }, [lecturers, searchQuery]);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lecturers?status=active');
      if (!response.ok) throw new Error('Failed to fetch lecturers');
      const data = await response.json();
      setLecturers(data);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLecturers = () => {
    if (!searchQuery) {
      setFilteredLecturers(lecturers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = lecturers.filter(
      l =>
        l.name.toLowerCase().includes(query) ||
        l.title.toLowerCase().includes(query) ||
        l.specialization.toLowerCase().includes(query) ||
        l.courses.some(c => c.toLowerCase().includes(query))
    );
    setFilteredLecturers(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#9179E0]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, title, specialization, or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
          />
        </div>
      </div>

      {filteredLecturers.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">No lecturers found</p>
          <p className="text-gray-500 text-sm mt-2">
            {searchQuery ? 'Try a different search term' : 'Check back soon'}
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Showing <span className="font-bold text-[#9179E0]">{filteredLecturers.length}</span>{' '}
              {filteredLecturers.length === 1 ? 'lecturer' : 'lecturers'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLecturers.map((lecturer) => (
              <LecturerPublicCard key={lecturer._id} lecturer={lecturer} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}