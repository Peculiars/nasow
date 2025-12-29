export enum StudentType {
  FULL_TIME = 'FULL_TIME',
  ICE = 'ICE',
  BOTH = 'BOTH'
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export enum Level {
  L100 = '100',
  L200 = '200',
  L300 = '300',
  L400 = '400',
  L500 = '500'
}

export interface CourseMaterial {
  name: string;
  url: string;
  publicId: string;
  fileType: string;
  fileSize: number;
  uploadedAt?: Date;
}

export interface Week {
  weekNumber: number;
  title: string;
  content: string;
  materials: CourseMaterial[];
  order: number;
  isPublished: boolean;
}

export interface CourseFormData {
  title: string;
  courseCode: string;
  level: Level | '';
  studentType: StudentType | '';
  lecturerName: string;
  coverImage: {
    url: string;
    publicId: string;
  } | null;
  weeks: Week[];
  status: CourseStatus;
}

export const initialCourseFormData: CourseFormData = {
  title: '',
  courseCode: '',
  level: '',
  studentType: '',
  lecturerName: '',
  coverImage: null,
  weeks: [],
  status: CourseStatus.DRAFT
};

export const validateCourseBasicInfo = (data: Partial<CourseFormData>): string[] => {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push('Course title is required');
  }
  if (!data.courseCode?.trim()) {
    errors.push('Course code is required');
  }
  if (!data.level) {
    errors.push('Level is required');
  }
  if (!data.studentType) {
    errors.push('Student type is required');
  }
  if (!data.lecturerName?.trim()) {
    errors.push('Lecturer name is required');
  }
  if (!data.coverImage) {
    errors.push('Course cover image is required');
  }

  return errors;
};

export const validateWeek = (week: Partial<Week>): string[] => {
  const errors: string[] = [];

  if (!week.title?.trim()) {
    errors.push('Week title is required');
  }
  if (!week.content?.trim() && (!week.materials || week.materials.length === 0)) {
    errors.push('Week must have either content or materials');
  }

  return errors;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const getLevelLabel = (level: Level | string): string => {
  return `${level} Level`;
};

export const getStudentTypeLabel = (type: StudentType | string): string => {
  switch (type) {
    case StudentType.FULL_TIME:
      return 'Full-Time';
    case StudentType.ICE:
      return 'ICE';
    case StudentType.BOTH:
      return 'Both (Full-Time & ICE)';
    default:
      return type;
  }
};