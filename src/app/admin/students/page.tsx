"use client";

import { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, UserX, Ban, TrendingUp, Download } from 'lucide-react';
import { Student, StudentFilters, StudentStats, UpdateStudentPayload } from '@/src/lib/types/students';
import { showError, showPromise, showSuccess } from '@/src/lib/toast';
import { exportStudentsToCSV } from '@/src/lib/utils';
import ToastProvider from '@/src/components/ToastProvider';
import StatsCard from '@/src/features/students/components/StatsCard';
import StudentsFilters from '@/src/features/students/components/StudentsFilters';
import BulkActionsToolbar from '@/src/features/students/components/BulkActionsToolbar';
import Pagination from '@/src/features/students/components/Pagination';
import ActionModal from '@/src/features/students/components/ActionModal';
import EditStudentModal from '@/src/features/students/components/EditStudentModal';
import BulkActionModal from '@/src/features/students/components/BulkActionModal';
import StudentsTable from '@/src/features/students/components/StudentsTable';

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

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'suspend' | 'ban' | 'activate' | 'delete' | null>(null);

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
      showError('Failed to load students');
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
    setSelectedIds([]);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (data: UpdateStudentPayload) => {
    if (!selectedStudent) return;

    try {
      await showPromise(
        fetch(`/api/admin/students/${selectedStudent._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(res => {
          if (!res.ok) throw new Error('Failed to update student');
          return res.json();
        }),
        {
          loading: 'Updating student...',
          success: 'Student updated successfully',
          error: 'Failed to update student'
        }
      );

      await fetchStudents();
      await fetchStats();
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleAction = async (action: 'suspend' | 'ban' | 'activate' | 'delete', student: Student) => {
    setActionModal({ type: action, student });
  };

  const handleConfirmAction = async (reason?: string) => {
    if (!actionModal.type || !actionModal.student) return;

    try {
      if (actionModal.type === 'delete') {
        await showPromise(
          fetch(`/api/admin/students/${actionModal.student._id}`, {
            method: 'DELETE'
          }).then(res => {
            if (!res.ok) throw new Error('Failed to delete student');
            return res.json();
          }),
          {
            loading: 'Deleting student...',
            success: 'Student deleted successfully',
            error: 'Failed to delete student'
          }
        );
      } else {
        await showPromise(
          fetch('/api/admin/students/actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: actionModal.student._id,
              action: actionModal.type,
              reason
            })
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to ${actionModal.type} student`);
            return res.json();
          }),
          {
            loading: `${actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)}ing student...`,
            success: `Student ${actionModal.type}d successfully`,
            error: `Failed to ${actionModal.type} student`
          }
        );
      }

      await fetchStudents();
      await fetchStats();
      setActionModal({ type: null, student: null });
    } catch (error) {
      console.error(`Error performing ${actionModal.type} action:`, error);
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(students.map(s => s._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkAction = (action: 'suspend' | 'ban' | 'activate' | 'delete') => {
    if (selectedIds.length === 0) {
      showError('Please select at least one student');
      return;
    }
    setBulkAction(action);
  };

  const handleConfirmBulkAction = async (reason?: string) => {
    if (!bulkAction) return;

    try {
      await showPromise(
        fetch('/api/admin/students/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentIds: selectedIds,
            action: bulkAction,
            reason
          })
        }).then(res => {
          if (!res.ok) throw new Error(`Failed to ${bulkAction} students`);
          return res.json();
        }),
        {
          loading: `${bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1)}ing ${selectedIds.length} student(s)...`,
          success: `Successfully ${bulkAction}d ${selectedIds.length} student(s)`,
          error: `Failed to ${bulkAction} students`
        }
      );

      await fetchStudents();
      await fetchStats();
      setSelectedIds([]);
      setBulkAction(null);
    } catch (error) {
      console.error(`Error performing bulk ${bulkAction}:`, error);
    }
  };

  const handleExportSelected = () => {
    const selectedStudents = students.filter(s => selectedIds.includes(s._id));
    exportStudentsToCSV(selectedStudents, `students-selected-${new Date().toISOString().split('T')[0]}.csv`);
    showSuccess(`Exported ${selectedStudents.length} student(s) to CSV`);
  };

  const handleExportAll = async () => {
    try {
      const params = new URLSearchParams({ limit: '10000' });
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/admin/students?${params}`);
      if (!response.ok) throw new Error('Failed to fetch all students');

      const data = await response.json();
      exportStudentsToCSV(data.data, `students-all-${new Date().toISOString().split('T')[0]}.csv`);
      showSuccess(`Exported ${data.data.length} student(s) to CSV`);
    } catch (error) {
      console.error('Error exporting all students:', error);
      showError('Failed to export students');
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
    <>
      <ToastProvider />
      <div className="min-h-screen bg-gray-50 font-inter">
        
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
                <p className="text-gray-600 mt-2">Manage and monitor all registered students</p>
              </div>
              <button
                onClick={handleExportAll}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                Export All
              </button>
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

            {selectedIds.length > 0 && (
              <div className="mb-6">
                <BulkActionsToolbar
                  selectedCount={selectedIds.length}
                  onClearSelection={() => setSelectedIds([])}
                  onSuspend={() => handleBulkAction('suspend')}
                  onBan={() => handleBulkAction('ban')}
                  onActivate={() => handleBulkAction('activate')}
                  onDelete={() => handleBulkAction('delete')}
                  onExport={handleExportSelected}
                />
              </div>
            )}

            {isLoading ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#9179E0] border-t-transparent"/>
                <p className="text-gray-600 mt-4">Loading students...</p>
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
                  selectedIds={selectedIds}
                  onSelectStudent={handleSelectStudent}
                  onSelectAll={handleSelectAll}
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

        {bulkAction && (
          <BulkActionModal
            isOpen={!!bulkAction}
            onClose={() => setBulkAction(null)}
            onConfirm={handleConfirmBulkAction}
            selectedCount={selectedIds.length}
            action={bulkAction}
          />
        )}
      </div>
    </>
  );
}