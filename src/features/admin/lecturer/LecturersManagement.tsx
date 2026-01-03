'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import LecturerCard from './LecturerCard';
import DeleteConfirmModal from './DeleteConfirmModal';
import LecturerFormModal from './LecturerFormModal';

interface Lecturer {
  _id: string;
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  email: string;
  phone?: string;
  bio?: string;
  image: string;
  imagePublicId: string;
  courses: string[];
  researchInterests?: string[];
  publications?: string[];
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  officeLocation?: string;
  officeHours?: string;
  linkedIn?: string;
  googleScholar?: string;
  status: 'active' | 'inactive';
  order: number;
}

export default function LecturersManagement() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [filteredLecturers, setFilteredLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const [lecturerToDelete, setLecturerToDelete] = useState<Lecturer | null>(null);

  useEffect(() => {
    fetchLecturers();
  }, []);

  useEffect(() => {
    filterLecturers();
  }, [lecturers, searchQuery, statusFilter]);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lecturers');
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
    let filtered = [...lecturers];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(l => l.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        l =>
          l.name.toLowerCase().includes(query) ||
          l.email.toLowerCase().includes(query) ||
          l.title.toLowerCase().includes(query) ||
          l.specialization.toLowerCase().includes(query)
      );
    }

    setFilteredLecturers(filtered);
  };

  const handleEdit = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setIsModalOpen(true);
  };

  const handleDelete = (lecturer: Lecturer) => {
    setLecturerToDelete(lecturer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!lecturerToDelete) return;

    try {
      const response = await fetch(`/api/lecturers?id=${lecturerToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete lecturer');

      setLecturers(lecturers.filter(l => l._id !== lecturerToDelete._id));
      setIsDeleteModalOpen(false);
      setLecturerToDelete(null);
    } catch (error) {
      console.error('Error deleting lecturer:', error);
      alert('Failed to delete lecturer');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLecturer(null);
  };

  const handleLecturerSaved = () => {
    fetchLecturers();
    handleModalClose();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lecturers Management</h1>
            <p className="text-gray-600 mt-1">Manage faculty members and their information</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#9179E0] hover:bg-[#7E6BDB] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Lecturer
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lecturers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-[#9179E0]">{filteredLecturers.length}</span> of{' '}
            <span className="font-semibold">{lecturers.length}</span> lecturers
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#9179E0]" />
        </div>
      ) : filteredLecturers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No lecturers found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Click "Add Lecturer" to create your first lecturer'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLecturers.map((lecturer) => (
            <LecturerCard
              key={lecturer._id}
              lecturer={lecturer}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <LecturerFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleLecturerSaved}
        lecturer={selectedLecturer}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setLecturerToDelete(null);
        }}
        onConfirm={confirmDelete}
        lecturerName={lecturerToDelete?.name || ''}
      />
    </div>
  );
}