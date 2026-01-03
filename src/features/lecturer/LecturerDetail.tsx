'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Clock, BookOpen, GraduationCap, FileText, Lightbulb, Linkedin, ExternalLink, } from 'lucide-react';

interface Education {
  degree: string;
  institution: string;
  year: number;
}

interface Lecturer {
  _id: string;
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  email: string;
  phone?: string;
  bio?: string;
  image: string;
  courses: string[];
  researchInterests?: string[];
  publications?: string[];
  education?: Education[];
  officeLocation?: string;
  officeHours?: string;
  linkedIn?: string;
  googleScholar?: string;
}

interface LecturerDetailProps {
  lecturer: Lecturer;
}

export default function LecturerDetail({ lecturer }: LecturerDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#4a368f] to-[#9179E0] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href="/lecturers"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Lecturers
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="relative h-96 md:h-full">
                <Image
                  src={lecturer.image}
                  alt={lecturer.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            <div className="md:w-2/3 p-8 lg:p-12">
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {lecturer.name}
                </h1>
                <p className="text-xl text-[#9179E0] font-semibold mb-2">
                  {lecturer.title}
                </p>
                <p className="text-gray-600 font-medium">{lecturer.qualifications}</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-[#9179E0]" />
                  <a
                    href={`mailto:${lecturer.email}`}
                    className="hover:text-[#9179E0] transition-colors"
                  >
                    {lecturer.email}
                  </a>
                </div>

                {lecturer.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-[#9179E0]" />
                    <a
                      href={`tel:${lecturer.phone}`}
                      className="hover:text-[#9179E0] transition-colors"
                    >
                      {lecturer.phone}
                    </a>
                  </div>
                )}

                {lecturer.officeLocation && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-[#9179E0]" />
                    <span>{lecturer.officeLocation}</span>
                  </div>
                )}

                {lecturer.officeHours && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-5 h-5 text-[#9179E0]" />
                    <span>{lecturer.officeHours}</span>
                  </div>
                )}
              </div>

              {(lecturer.linkedIn || lecturer.googleScholar) && (
                <div className="flex gap-3 mb-8">
                  {lecturer.linkedIn && (
                    <a
                      href={lecturer.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {lecturer.googleScholar && (
                    <a
                      href={lecturer.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#357AE8] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Google Scholar
                    </a>
                  )}
                </div>
              )}

              <div className="bg-gradient-to-br from-[#9179E0]/10 to-[#4a368f]/10 p-6 rounded-xl">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Specialization
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {lecturer.specialization}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-8 lg:p-12 space-y-10">
            {lecturer.bio && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#9179E0]" />
                  Biography
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {lecturer.bio}
                </p>
              </div>
            )}

            {lecturer.education && lecturer.education.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-[#9179E0]" />
                  Education
                </h2>
                <div className="space-y-4">
                  {lecturer.education.map((edu, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="p-2 bg-[#9179E0]/10 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-[#9179E0]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-700">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lecturer.courses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#9179E0]" />
                  Courses
                </h2>
                <div className="flex flex-wrap gap-3">
                  {lecturer.courses.map((course, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-[#9179E0] text-white rounded-lg font-semibold"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {lecturer.researchInterests && lecturer.researchInterests.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-[#9179E0]" />
                  Research Interests
                </h2>
                <div className="flex flex-wrap gap-3">
                  {lecturer.researchInterests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {lecturer.publications && lecturer.publications.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#9179E0]" />
                  Selected Publications
                </h2>
                <div className="space-y-3">
                  {lecturer.publications.map((pub, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#9179E0]"
                    >
                      <p className="text-gray-700 leading-relaxed">{pub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}