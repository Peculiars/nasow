export enum StudentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export enum StudentLevel {
  LEVEL_100 = '100L',
  LEVEL_200 = '200L',
  LEVEL_300 = '300L',
  LEVEL_400 = '400L',
  LEVEL_500 = '500L'
}

export enum StudentType {
  FULL_TIME = 'Full-time',
  ICE = 'ICE'
}

export interface Student {
  _id: string;
  kindeId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  level?: StudentLevel;
  studentType?: StudentType;
  profileCompleted: boolean;
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
  level?: StudentLevel;
  studentType?: StudentType;
  search?: string;
  minScore?: number;
  maxScore?: number;
  startDate?: string;
  endDate?: string;
  profileCompleted?: boolean;
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  suspendedStudents: number;
  bannedStudents: number;
  averageScore: number;
  totalQuizzesTaken: number;
  profileCompletionRate: number;
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
  level?: StudentLevel;
  studentType?: StudentType;
}

export interface CompleteProfilePayload {
  level: StudentLevel;
  studentType: StudentType;
  phoneNumber?: string;
}

export interface StudentActionPayload {
  studentId: string;
  action: 'suspend' | 'ban' | 'activate' | 'delete';
  reason?: string;
  adminId: string;
}