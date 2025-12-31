import { Student, StudentStatus } from '../../../lib/types/students';
import { MoreVertical, Eye, Edit, Ban, UserX, CheckCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface StudentsTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onSuspend: (student: Student) => void;
  onBan: (student: Student) => void;
  onActivate: (student: Student) => void;
  onDelete: (student: Student) => void;
  selectedIds: string[];
  onSelectStudent: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
}

export default function StudentsTable({
  students,
  onView,
  onEdit,
  onSuspend,
  onBan,
  onActivate,
  onDelete,
  selectedIds,
  onSelectStudent,
  onSelectAll
}: StudentsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const allSelected = students.length > 0 && students.every(s => selectedIds.includes(s._id));
  const someSelected = students.some(s => selectedIds.includes(s._id));

  const getStatusBadge = (status: StudentStatus) => {
    const badges = {
      [StudentStatus.ACTIVE]: 'bg-green-100 text-green-700 border-green-200',
      [StudentStatus.SUSPENDED]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      [StudentStatus.BANNED]: 'bg-red-100 text-red-700 border-red-200'
    };
    return badges[status];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) input.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Level/Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Quizzes
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr 
                key={student._id} 
                className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(student._id) ? 'bg-purple-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(student._id)}
                    onChange={() => onSelectStudent(student._id)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {student.profileImage ? (
                        <Image
                          src={student.profileImage}
                          alt={student.fullName || ''}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-sm">
                            {(student.firstName?.[0] ?? '') + (student.lastName?.[0] ?? '')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-gray-500">ID: {student._id ? student._id.slice(-6) : 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.email}</div>
                  {student.phoneNumber && (
                    <div className="text-xs text-gray-500">{student.phoneNumber}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.level ?? 'N/A'}</div>
                  <div className="text-xs text-gray-500">{student.studentType ?? 'Not set'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{student.totalScore ?? 0}</div>
                  <div className="text-xs text-gray-500">Avg: {student.averageScore ?? 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.quizzesTaken}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.registrationDate ? formatDate(student.registrationDate) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === student._id ? null : student._id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {openMenuId === student._id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute z-[1000] right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border-2 border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => { onView(student); setOpenMenuId(null); }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button
                            onClick={() => { onEdit(student); setOpenMenuId(null); }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          
                          {student.status === StudentStatus.ACTIVE && (
                            <>
                              <button
                                onClick={() => { onSuspend(student); setOpenMenuId(null); }}
                                className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Suspend
                              </button>
                              <button
                                onClick={() => { onBan(student); setOpenMenuId(null); }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Ban
                              </button>
                            </>
                          )}
                          
                          {(student.status === StudentStatus.SUSPENDED || student.status === StudentStatus.BANNED) && (
                            <button
                              onClick={() => { onActivate(student); setOpenMenuId(null); }}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </button>
                          )}
                          
                          <div className="border-t border-gray-200 my-1" />
                          <button
                            onClick={() => { onDelete(student); setOpenMenuId(null); }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}