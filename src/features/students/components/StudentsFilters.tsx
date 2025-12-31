import { Search, X } from 'lucide-react';
import { StudentStatus, StudentLevel, StudentType, StudentFilters } from '@/src/lib/types/students';

interface StudentsFiltersProps {
  filters: StudentFilters;
  onFilterChange: (filters: StudentFilters) => void;
  onReset: () => void;
}

export default function StudentsFilters({
  filters,
  onFilterChange,
  onReset
}: StudentsFiltersProps) {
  const hasActiveFilters = 
    filters.status || 
    filters.level ||
    filters.studentType ||
    filters.search || 
    filters.minScore !== undefined || 
    filters.maxScore !== undefined ||
    filters.startDate ||
    filters.endDate ||
    filters.profileCompleted !== undefined;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as StudentStatus || undefined })}
          className="px-4 py-2 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="">All Status</option>
          <option value={StudentStatus.ACTIVE}>Active</option>
          <option value={StudentStatus.SUSPENDED}>Suspended</option>
          <option value={StudentStatus.BANNED}>Banned</option>
        </select>

        <select
          value={filters.level || ''}
          onChange={(e) => onFilterChange({ ...filters, level: e.target.value as StudentLevel || undefined })}
          className="px-4 py-2 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="">All Levels</option>
          <option value={StudentLevel.LEVEL_100}>100L</option>
          <option value={StudentLevel.LEVEL_200}>200L</option>
          <option value={StudentLevel.LEVEL_300}>300L</option>
          <option value={StudentLevel.LEVEL_400}>400L</option>
          <option value={StudentLevel.LEVEL_500}>500L</option>
        </select>

        <select
          value={filters.studentType || ''}
          onChange={(e) => onFilterChange({ ...filters, studentType: e.target.value as StudentType || undefined })}
          className="px-4 py-2 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="">All Types</option>
          <option value={StudentType.FULL_TIME}>Full-time</option>
          <option value={StudentType.ICE}>ICE</option>
        </select>

        <select
          value={filters.profileCompleted === undefined ? '' : filters.profileCompleted.toString()}
          onChange={(e) => onFilterChange({ 
            ...filters, 
            profileCompleted: e.target.value === '' ? undefined : e.target.value === 'true' 
          })}
          className="px-4 py-2 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="">All Profiles</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>

        <input
          type="number"
          value={filters.minScore || ''}
          onChange={(e) => onFilterChange({ ...filters, minScore: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="Min Score"
          className="w-32 px-4 py-2 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <input
          type="number"
          value={filters.maxScore || ''}
          onChange={(e) => onFilterChange({ ...filters, maxScore: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="Max Score"
          className="w-32 px-4 py-2 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}