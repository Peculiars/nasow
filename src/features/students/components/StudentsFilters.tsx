import { Search, X } from 'lucide-react';
import { StudentsFiltersProps } from '../schema';
import { StudentStatus } from '@/src/lib/types/students';

export default function StudentsFilters({ filters, onFilterChange, onReset }: StudentsFiltersProps) {
  const hasActiveFilters = 
    filters.status || 
    filters.search || 
    filters.minScore !== undefined || 
    filters.maxScore !== undefined ||
    filters.startDate ||
    filters.endDate;

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
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as StudentStatus || undefined })}
          className="px-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="">All Status</option>
          <option value={StudentStatus.ACTIVE}>Active</option>
          <option value={StudentStatus.SUSPENDED}>Suspended</option>
          <option value={StudentStatus.BANNED}>Banned</option>
        </select>

        <input
          type="number"
          value={filters.minScore || ''}
          onChange={(e) => onFilterChange({ ...filters, minScore: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="Min Score"
          className="w-32 px-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <input
          type="number"
          value={filters.maxScore || ''}
          onChange={(e) => onFilterChange({ ...filters, maxScore: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="Max Score"
          className="w-32 px-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <input
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
          className="px-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <input
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
          className="px-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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