export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Lecturer {
  _id: string;
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  email: string;
  phone?: string;
  bio?: string;
  image: string;
  imagePublicId: string;
  courses: string[];
  researchInterests?: string[];
  publications?: string[];
  education?: Education[];
  officeLocation?: string;
  officeHours?: string;
  linkedIn?: string;
  googleScholar?: string;
  status: 'active' | 'inactive';
  order: number;
}