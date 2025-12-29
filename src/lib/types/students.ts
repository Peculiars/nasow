export enum StudentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export interface Student {
  _id: string;
  kindeId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  status: StudentStatus;
  totalScore: number;
  quizzesTaken: number;
  registrationDate: string;
  lastActive?: string;
  suspensionReason?: string;
  suspendedBy?: string;
  suspendedAt?: string;
  banReason?: string;
  bannedBy?: string;
  bannedAt?: string;
  updatedBy?: string;
  updatedAt: string;
  createdAt: string;
  fullName?: string;
  averageScore?: number;
}

export interface StudentFilters {
  status?: StudentStatus;
  search?: string;
  minScore?: number;
  maxScore?: number;
  startDate?: string;
  endDate?: string;
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  suspendedStudents: number;
  bannedStudents: number;
  averageScore: number;
  totalQuizzesTaken: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateStudentPayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface StudentActionPayload {
  studentId: string;
  action: 'suspend' | 'ban' | 'activate' | 'delete';
  reason?: string;
  adminId: string;
}