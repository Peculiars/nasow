'use client';
import { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Education, Lecturer } from '@/src/lib/types/lecturer';

interface LecturerFormData {
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  email: string;
  phone: string;
  bio: string;
  courses: string[];
  researchInterests: string[];
  publications: string[];
  education: Education[];
  officeLocation: string;
  officeHours: string;
  linkedIn: string;
  googleScholar: string;
  status: 'active' | 'inactive';
  order: number;
}

interface LecturerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  lecturer?: Lecturer | null;
}

export default function LecturerFormModal({ isOpen, onClose, onSave, lecturer }: LecturerFormModalProps) {
  const [formData, setFormData] = useState<LecturerFormData>({
    name: '',
    title: '',
    specialization: '',
    qualifications: '',
    email: '',
    phone: '',
    bio: '',
    courses: [],
    researchInterests: [],
    publications: [],
    education: [],
    officeLocation: '',
    officeHours: '',
    linkedIn: '',
    googleScholar: '',
    status: 'active',
    order: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState('');
  const [newResearchInterest, setNewResearchInterest] = useState('');
  const [newPublication, setNewPublication] = useState('');
  const [newEducation, setNewEducation] = useState<Education>({ degree: '', institution: '', year: new Date().getFullYear() });

  useEffect(() => {
    if (lecturer) {
      setFormData({
        name: lecturer.name || '',
        title: lecturer.title || '',
        specialization: lecturer.specialization || '',
        qualifications: lecturer.qualifications || '',
        email: lecturer.email || '',
        phone: lecturer.phone || '',
        bio: lecturer.bio || '',
        courses: lecturer.courses || [],
        researchInterests: lecturer.researchInterests || [],
        publications: lecturer.publications || [],
        education: lecturer.education || [],
        officeLocation: lecturer.officeLocation || '',
        officeHours: lecturer.officeHours || '',
        linkedIn: lecturer.linkedIn || '',
        googleScholar: lecturer.googleScholar || '',
        status: lecturer.status || 'active',
        order: lecturer.order || 0,
      });
      setImagePreview(lecturer.image || '');
    } else {
      setFormData({
        name: '',
        title: '',
        specialization: '',
        qualifications: '',
        email: '',
        phone: '',
        bio: '',
        courses: [],
        researchInterests: [],
        publications: [],
        education: [],
        officeLocation: '',
        officeHours: '',
        linkedIn: '',
        googleScholar: '',
        status: 'active',
        order: 0,
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [lecturer, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCourse = () => {
    if (newCourse.trim()) {
      setFormData({ ...formData, courses: [...formData.courses, newCourse.trim()] });
      setNewCourse('');
    }
  };

  const removeCourse = (index: number) => {
    setFormData({ ...formData, courses: formData.courses.filter((_, i) => i !== index) });
  };

  const addResearchInterest = () => {
    if (newResearchInterest.trim()) {
      setFormData({ ...formData, researchInterests: [...formData.researchInterests, newResearchInterest.trim()] });
      setNewResearchInterest('');
    }
  };

  const removeResearchInterest = (index: number) => {
    setFormData({ ...formData, researchInterests: formData.researchInterests.filter((_, i) => i !== index) });
  };

  const addPublication = () => {
    if (newPublication.trim()) {
      setFormData({ ...formData, publications: [...formData.publications, newPublication.trim()] });
      setNewPublication('');
    }
  };

  const removePublication = (index: number) => {
    setFormData({ ...formData, publications: formData.publications.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.year) {
      setFormData({ ...formData, education: [...formData.education, newEducation] });
      setNewEducation({ degree: '', institution: '', year: new Date().getFullYear() });
    }
  };

  const removeEducation = (index: number) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      if (lecturer) {
        submitData.append('id', lecturer._id);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value) || typeof value === 'object') {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, String(value));
        }
      });

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const url = '/api/lecturers';
      const method = lecturer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save lecturer');
      }

      onSave();
    } catch (error: any) {
      alert(error.message || 'Failed to save lecturer');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {lecturer ? 'Edit Lecturer' : 'Add New Lecturer'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-2">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Image *
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-700 font-medium">
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Senior Lecturer, Professor"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qualifications *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., PhD, MSc, BSc"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialization *
              </label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Office Location
                </label>
                <input
                  type="text"
                  value={formData.officeLocation}
                  onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Office Hours
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mon-Fri 2-4 PM"
                  value={formData.officeHours}
                  onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Google Scholar
                </label>
                <input
                  type="url"
                  value={formData.googleScholar}
                  onChange={(e) => setFormData({ ...formData, googleScholar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Courses
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g., SOW 322"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourse())}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addCourse}
                  className="px-4 py-2 bg-[#9179E0] text-white rounded-lg hover:bg-[#7E6BDB] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.courses.map((course, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#9179E0]/10 text-[#9179E0] rounded-lg text-sm font-medium"
                  >
                    {course}
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
                      className="hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Research Interests
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add research interest"
                  value={newResearchInterest}
                  onChange={(e) => setNewResearchInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchInterest())}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addResearchInterest}
                  className="px-4 py-2 bg-[#9179E0] text-white rounded-lg hover:bg-[#7E6BDB] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.researchInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeResearchInterest(index)}
                      className="hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Publications
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add publication"
                  value={newPublication}
                  onChange={(e) => setNewPublication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPublication())}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addPublication}
                  className="px-4 py-2 bg-[#9179E0] text-white rounded-lg hover:bg-[#7E6BDB] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.publications.map((pub, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="flex-1 text-sm text-gray-700">{pub}</p>
                    <button
                      type="button"
                      onClick={() => removePublication(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Education
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Degree (e.g., PhD)"
                  value={newEducation.degree}
                  onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={newEducation.institution}
                  onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Year"
                    value={newEducation.year}
                    onChange={(e) => setNewEducation({ ...newEducation, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-4 py-2 bg-[#9179E0] text-white rounded-lg hover:bg-[#7E6BDB] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {formData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!imageFile && !lecturer)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#9179E0] hover:bg-[#7E6BDB] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {lecturer ? 'Update Lecturer' : 'Add Lecturer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}