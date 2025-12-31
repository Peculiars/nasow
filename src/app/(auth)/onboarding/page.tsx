"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { StudentLevel, StudentType } from '@/src/lib/types/students';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    level: '' as StudentLevel | '',
    studentType: '' as StudentType | '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const levels = [
    { value: StudentLevel.LEVEL_100, label: '100 Level', description: 'First Year' },
    { value: StudentLevel.LEVEL_200, label: '200 Level', description: 'Second Year' },
    { value: StudentLevel.LEVEL_300, label: '300 Level', description: 'Third Year' },
    { value: StudentLevel.LEVEL_400, label: '400 Level', description: 'Fourth Year' },
    { value: StudentLevel.LEVEL_500, label: '500 Level', description: 'Fifth Year' }
  ];

  const studentTypes = [
    { 
      value: StudentType.FULL_TIME, 
      label: 'Full-time Student',
      description: 'Regular full-time undergraduate',
      icon: <GraduationCap className="h-6 w-6" />
    },
    { 
      value: StudentType.ICE, 
      label: 'ICE Student',
      description: 'Institute of Continuing Education',
      icon: <BookOpen className="h-6 w-6" />
    }
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.level) {
      newErrors.level = 'Please select your level';
    }

    if (!formData.studentType) {
      newErrors.studentType = 'Please select your student type';
    }

    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/students/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to complete profile');
      }

      toast.success('Profile completed successfully!');
      router.push('/portal');
    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast.error(error.message || 'Failed to complete profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 font-inter">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <Image
              src="/assets/logo.svg"
              alt="NASOWS UNILAG"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-[#4a368f] mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Tell us a bit more about yourself to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-4">
                Select Your Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {levels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, level: level.value })}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.level === level.value
                        ? 'border-[#9179E0] bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-1 ${
                        formData.level === level.value ? 'text-[#9179E0]' : 'text-gray-700'
                      }`}>
                        {level.label.split(' ')[0]}
                      </div>
                      <div className="text-xs text-gray-600">{level.description}</div>
                      {formData.level === level.value && (
                        <CheckCircle className="h-5 w-5 text-[#9179E0] mx-auto mt-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.level && (
                <p className="text-xs text-red-600 mt-2">{errors.level}</p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-4">
                Student Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {studentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, studentType: type.value })}
                    className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.studentType === type.value
                        ? 'border-[#9179E0] bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full mb-3 ${
                        formData.studentType === type.value
                          ? 'bg-[#9179E0] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {type.icon}
                      </div>
                      <div className={`font-bold mb-1 ${
                        formData.studentType === type.value ? 'text-[#9179E0]' : 'text-gray-900'
                      }`}>
                        {type.label}
                      </div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                      {formData.studentType === type.value && (
                        <CheckCircle className="h-5 w-5 text-[#9179E0] mt-3" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.studentType && (
                <p className="text-xs text-red-600 mt-2">{errors.studentType}</p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+234 XXX XXX XXXX"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-600 mt-2">{errors.phoneNumber}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#9179E0] to-[#7E6BDB] text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Completing Profile...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Complete Profile
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Fields marked with * are required
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}