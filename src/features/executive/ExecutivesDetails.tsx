'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Instagram, Linkedin, Twitter, Facebook, Award, Target, } from 'lucide-react';

interface Executive {
  _id: string;
  name: string;
  position: string;
  level: string;
  image: { url: string; publicId: string };
  bio: string;
  email: string;
  phone: string;
  socialMedia: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  achievements: string[];
  responsibilities: string[];
}

interface ExecutiveDetailProps {
  executive: Executive;
}

export default function ExecutiveDetail({ executive }: ExecutiveDetailProps) {
    console.log('exec', executive)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4a368f] to-[#9179E0] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href="/executives"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Executives
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-8 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/3">
              <div className="relative h-96 md:h-full">
                <Image
                  src={executive?.image?.url}
                  alt={executive.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            {/* Info */}
            <div className="md:w-2/3 p-8 lg:p-12">
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {executive.name}
                </h1>
                <p className="text-xl text-[#9179E0] font-semibold mb-2">
                  {executive.position}
                </p>
                <p className="text-gray-600 font-medium">{executive.level}</p>
              </div>

              {/* Contact */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-[#9179E0]" />
                  <a
                    href={`mailto:${executive.email}`}
                    className="hover:text-[#9179E0] transition-colors"
                  >
                    {executive.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-[#9179E0]" />
                  <a
                    href={`tel:${executive.phone}`}
                    className="hover:text-[#9179E0] transition-colors"
                  >
                    {executive.phone}
                  </a>
                </div>
              </div>

              {(executive?.socialMedia?.instagram ||
                executive?.socialMedia?.linkedin ||
                executive?.socialMedia?.twitter ||
                executive?.socialMedia?.facebook) && (
                <div className="flex gap-4 mb-8">
                  {executive?.socialMedia?.instagram && (
                    <a
                      href={`https://instagram.com/${executive?.socialMedia?.instagram.replace(
                        '@',
                        ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {executive?.socialMedia?.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${executive?.socialMedia?.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#0077B5] text-white rounded-lg flex items-center justify-center hover:bg-[#006399] transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {executive?.socialMedia?.twitter && (
                    <a
                      href={`https://twitter.com/${executive?.socialMedia?.twitter.replace(
                        '@',
                        ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {executive?.socialMedia?.facebook && (
                    <a
                      href={`https://facebook.com/${executive?.socialMedia?.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#1877F2] text-white rounded-lg flex items-center justify-center hover:bg-[#166FE5] transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}

              <div className="bg-gradient-to-br from-[#9179E0]/10 to-[#4a368f]/10 p-6 rounded-xl">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Biography</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {executive?.bio}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-8 lg:p-12 space-y-10">
            {executive?.achievements?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Award className="w-7 h-7 text-[#9179E0]" />
                  Key Achievements
                </h2>
                <ul className="space-y-3">
                  {executive?.achievements?.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#9179E0] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {executive?.responsibilities?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Target className="w-7 h-7 text-[#9179E0]" />
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {executive?.responsibilities?.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}