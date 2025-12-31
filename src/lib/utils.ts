import { Student } from '@/src/lib/types/students';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const exportStudentsToCSV = (students: Student[], filename: string = 'students.csv') => {
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Email',
    'Phone Number',
    'Status',
    'Total Score',
    'Quizzes Taken',
    'Average Score',
    'Registration Date',
    'Last Active',
    'Suspended Reason',
    'Suspended By',
    'Suspended At',
    'Ban Reason',
    'Banned By',
    'Banned At'
  ];

  const rows = students.map(student => [
    student._id,
    student.firstName,
    student.lastName,
    student.email,
    student.phoneNumber || '',
    student.status,
    student.totalScore,
    student.quizzesTaken,
    student.averageScore || 0,
    new Date(student.registrationDate).toLocaleDateString(),
    student.lastActive ? new Date(student.lastActive).toLocaleDateString() : '',
    student.suspensionReason || '',
    student.suspendedBy || '',
    student.suspendedAt ? new Date(student.suspendedAt).toLocaleDateString() : '',
    student.banReason || '',
    student.bannedBy || '',
    student.bannedAt ? new Date(student.bannedAt).toLocaleDateString() : ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        typeof cell === 'string' && cell.includes(',') 
          ? `"${cell}"` 
          : cell
      ).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
