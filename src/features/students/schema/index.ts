import { Student, StudentFilters, UpdateStudentPayload } from "@/src/lib/types/students";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'purple' | 'blue' | 'green' | 'red' | 'yellow';
}

export const colorClasses = {
  purple: 'bg-purple-100 text-purple-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-600'
};

export interface StudentsTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onSuspend: (student: Student) => void;
  onBan: (student: Student) => void;
  onActivate: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: string;
  confirmText: string;
  confirmColor: 'red' | 'yellow' | 'green';
  requireReason?: boolean;
}

export interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateStudentPayload) => Promise<void>;
  student: Student | null;
}

export interface StudentsFiltersProps {
  filters: StudentFilters;
  onFilterChange: (filters: StudentFilters) => void;
  onReset: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}