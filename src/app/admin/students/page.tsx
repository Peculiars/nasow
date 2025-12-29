"use client";
import { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, UserX, Ban, TrendingUp, Download } from 'lucide-react';
import { Student, StudentFilters, StudentStats, UpdateStudentPayload } from '@/src/lib/types/students';
import AdminSidebar from '@/src/features/admin/AdminSidebar';
import StatsCard from '@/src/features/students/components/StatsCard';
import StudentsFilters from '@/src/features/students/components/StudentsFilters';
import StudentsTable from '@/src/features/students/components/StudentsTable';
import Pagination from '@/src/features/students/components/Pagination';
import EditStudentModal from '@/src/features/students/components/EditStudentModal';
import ActionModal from '@/src/features/students/components/ActionModal';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [filters, setFilters] = useState<StudentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{
    type: 'suspend' | 'ban' | 'activate' | 'delete' | null;
    student: Student | null;
  }>({ type: null, student: null });

  const itemsPerPage = 10;

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.minScore) params.append('minScore', filters.minScore.toString());
      if (filters.maxScore) params.append('maxScore', filters.maxScore.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/admin/students?${params}`);
      
      if (!response.ok) throw new Error('Failed to fetch students');

      const data = await response.json();
      setStudents(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/students/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (newFilters: StudentFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (data: UpdateStudentPayload) => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(`/api/admin/students/${selectedStudent._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to update student');

      await fetchStudents();
      await fetchStats();
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student. Please try again.');
    }
  };

  const handleAction = async (action: 'suspend' | 'ban' | 'activate' | 'delete', student: Student) => {
    setActionModal({ type: action, student });
  };

  const handleConfirmAction = async (reason?: string) => {
    if (!actionModal.type || !actionModal.student) return;

    try {
      if (actionModal.type === 'delete') {
        const response = await fetch(`/api/admin/students/${actionModal.student._id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete student');
      } else {
        const response = await fetch('/api/admin/students/actions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: actionModal.student._id,
            action: actionModal.type,
            reason
          })
        });
        if (!response.ok) throw new Error(`Failed to ${actionModal.type} student`);
      }

      await fetchStudents();
      await fetchStats();
      setActionModal({ type: null, student: null });
    } catch (error) {
      console.error(`Error performing ${actionModal.type} action:`, error);
      alert(`Failed to ${actionModal.type} student. Please try again.`);
    }
  };

  const getActionModalConfig = () => {
    switch (actionModal.type) {
      case 'suspend':
        return {
          title: 'Suspend Student',
          description: `Are you sure you want to suspend ${actionModal.student?.firstName} ${actionModal.student?.lastName}? They will not be able to access the platform until reactivated.`,
          confirmText: 'Suspend Student',
          confirmColor: 'yellow' as const,
          requireReason: true
        };
      case 'ban':
        return {
          title: 'Ban Student',
          description: `Are you sure you want to permanently ban ${actionModal.student?.firstName} ${actionModal.student?.lastName}? This action should only be used for serious violations.`,
          confirmText: 'Ban Student',
          confirmColor: 'red' as const,
          requireReason: true
        };
      case 'activate':
        return {
          title: 'Activate Student',
          description: `Are you sure you want to reactivate ${actionModal.student?.firstName} ${actionModal.student?.lastName}? They will regain full access to the platform.`,
          confirmText: 'Activate Student',
          confirmColor: 'green' as const,
          requireReason: false
        };
      case 'delete':
        return {
          title: 'Delete Student',
          description: `Are you sure you want to permanently delete ${actionModal.student?.firstName} ${actionModal.student?.lastName}? This action cannot be undone and will remove all their data.`,
          confirmText: 'Delete Student',
          confirmColor: 'red' as const,
          requireReason: false
        };
      default:
        return null;
    }
  };

  const actionModalConfig = getActionModalConfig();

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
            <p className="text-gray-600 mt-2">Manage and monitor all registered students</p>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatsCard
                title="Total Students"
                value={stats.totalStudents}
                icon={<Users className="h-6 w-6" />}
                color="purple"
              />
              <StatsCard
                title="Active"
                value={stats.activeStudents}
                icon={<UserCheck className="h-6 w-6" />}
                color="green"
              />
              <StatsCard
                title="Suspended"
                value={stats.suspendedStudents}
                icon={<UserX className="h-6 w-6" />}
                color="yellow"
              />
              <StatsCard
                title="Banned"
                value={stats.bannedStudents}
                icon={<Ban className="h-6 w-6" />}
                color="red"
              />
              <StatsCard
                title="Avg Score"
                value={stats.averageScore}
                icon={<TrendingUp className="h-6 w-6" />}
                color="blue"
              />
            </div>
          )}

          <div className="mb-6">
            <StudentsFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#9179E0] border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
          ) : students.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No students found matching your criteria</p>
            </div>
          ) : (
            <>
              <StudentsTable
                students={students}
                onView={(student) => console.log('View:', student)}
                onEdit={handleEdit}
                onSuspend={(student) => handleAction('suspend', student)}
                onBan={(student) => handleAction('ban', student)}
                onActivate={(student) => handleAction('activate', student)}
                onDelete={(student) => handleAction('delete', student)}
              />

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
        onSave={handleSaveEdit}
        student={selectedStudent}
      />

      {actionModalConfig && (
        <ActionModal
          isOpen={!!actionModal.type}
          onClose={() => setActionModal({ type: null, student: null })}
          onConfirm={handleConfirmAction}
          {...actionModalConfig}
        />
      )}
    </div>
  );
}