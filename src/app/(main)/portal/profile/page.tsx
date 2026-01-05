"use client";

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, GraduationCap, MapPin, Book, Edit2, Save, X, Camera, Loader2, Award, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { StudentLevel, StudentType } from '@/src/lib/types/students';

interface StudentProfile {
  kindeId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string | null;
  phoneNumber?: string | null;
  level?: StudentLevel | null;
  studentType?: StudentType | null;
  matricNumber?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  department?: string;
  faculty?: string;
  bio?: string | null;
  totalScore: number;
  quizzesTaken: number;
  registrationDate: string;
  lastActive: string;
}

type UpdatableStudentKey =
  | "firstName"
  | "lastName"
  | "phoneNumber"
  | "level"
  | "studentType"
  | "matricNumber"
  | "dateOfBirth"
  | "address"
  | "city"
  | "state"
  | "bio"

const UPDATABLE_FIELDS: UpdatableStudentKey[] = [
  "firstName",
  "lastName",
  "phoneNumber",
  "level",
  "studentType",
  "matricNumber",
  "dateOfBirth",
  "address",
  "city",
  "state",
  "bio",
]

function setField<K extends UpdatableStudentKey>(
  acc: Partial<StudentProfile>,
  key: K,
  value: StudentProfile[K]
) {
  acc[key] = value
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<StudentProfile>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/students/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      console.log('Fetched profile:', data);
      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/students/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      setProfile({ ...profile!, profileImage: data.imageUrl });
      setEditedProfile({ ...editedProfile, profileImage: data.imageUrl });
      toast.success('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (editedProfile.phoneNumber && editedProfile.phoneNumber.trim() && !/^\+?[\d\s-()]+$/.test(editedProfile.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    if (editedProfile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedProfile.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (editedProfile.matricNumber && editedProfile.matricNumber.trim() && !/^[A-Z0-9/]+$/i.test(editedProfile.matricNumber)) {
      newErrors.matricNumber = 'Invalid matric number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSave() {
    if (!validate()) return
    setIsSaving(true)

    try {
      const cleanedData: Partial<StudentProfile> = {}

      for (const key of UPDATABLE_FIELDS) {
        const value = editedProfile[key]

        if (typeof value === "string") {
          const trimmed = value.trim()
          if (trimmed !== "") {
            setField(cleanedData, key, trimmed as any)
          }
        } else if (value !== null && value !== undefined) {
          setField(cleanedData, key, value as any)
        }
      }

      const res = await fetch("/api/students/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }

      const updated = await res.json()
      setProfile(updated)
      setEditedProfile(updated)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (err) {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile!);
    setIsEditing(false);
    setErrors({});
  };

  const formatDateForInput = (dateString?: string | null) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const formatDateForDisplay = (dateString?: string | null) => {
    if (!dateString) return 'Not provided';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Not provided';
      return date.toLocaleDateString();
    } catch {
      return 'Not provided';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#9179E0]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Failed to load profile</p>
      </div>
    );
  }

  const levels = [
    { value: StudentLevel.LEVEL_100, label: '100 Level' },
    { value: StudentLevel.LEVEL_200, label: '200 Level' },
    { value: StudentLevel.LEVEL_300, label: '300 Level' },
    { value: StudentLevel.LEVEL_400, label: '400 Level' },
    { value: StudentLevel.LEVEL_500, label: '500 Level' }
  ];

  const studentTypes = [
    { value: StudentType.FULL_TIME, label: 'Full-time Student' },
    { value: StudentType.ICE, label: 'ICE Student' }
  ];

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
    'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
    'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#9179E0] to-[#7E6BDB] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                {profile.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-100">
                    <User className="w-16 h-16 text-purple-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <Camera className="w-5 h-5 text-[#9179E0]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
              </label>
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-purple-100 mb-4">{profile.email}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {profile.level && (
                  <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                    {levels.find(l => l.value === profile.level)?.label}
                  </span>
                )}
                {profile.studentType && (
                  <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                    {studentTypes.find(t => t.value === profile.studentType)?.label}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-[#9179E0] font-semibold rounded-xl hover:shadow-xl transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-semibold rounded-xl hover:shadow-xl transition-all"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Score</p>
                <p className="text-2xl font-bold text-gray-900">{profile.totalScore}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
                <p className="text-2xl font-bold text-gray-900">{profile.quizzesTaken}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(profile.registrationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#9179E0]" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.firstName || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg focus:border-[#9179E0] focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{profile.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.lastName || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg focus:border-[#9179E0] focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{profile.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <p className="text-gray-900">{profile.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      value={editedProfile.phoneNumber || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phoneNumber: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg text-gray-800 placeholder:text-gray-500 focus:border-[#9179E0] focus:outline-none ${
                        errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+234 XXX XXX XXXX"
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-900">{profile.phoneNumber || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formatDateForInput(editedProfile.dateOfBirth)}
                    onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg focus:border-[#9179E0] focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{formatDateForDisplay(profile.dateOfBirth)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#9179E0]" />
              Academic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                {isEditing ? (
                  <select
                    value={editedProfile.level || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, level: e.target.value as StudentLevel })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#9179E0] focus:outline-none"
                  >
                    <option value="">Select Level</option>
                    {levels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {profile.level ? levels.find(l => l.value === profile.level)?.label : 'Not provided'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Student Type</label>
                {isEditing ? (
                  <select
                    value={editedProfile.studentType || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, studentType: e.target.value as StudentType })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#9179E0] focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    {studentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {profile.studentType ? studentTypes.find(t => t.value === profile.studentType)?.label : 'Not provided'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Matric Number</label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editedProfile.matricNumber || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, matricNumber: e.target.value.toUpperCase() })}
                      className={`w-full px-4 py-2 border-2 rounded-lg text-gray-800 placeholder:text-gray-500 focus:border-[#9179E0] focus:outline-none ${
                        errors.matricNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 190401234"
                    />
                    {errors.matricNumber && (
                      <p className="text-xs text-red-600 mt-1">{errors.matricNumber}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-900">{profile.matricNumber || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Faculty</label>
                <p className="text-gray-900">{profile.faculty || 'Faculty of Social Sciences'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Book className="w-4 h-4 inline mr-1" />
                  Department
                </label>
                <p className="text-gray-900">{profile.department || 'Social Work'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#9179E0]" />
              Address Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.address || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg focus:border-[#9179E0] focus:outline-none resize-none"
                    rows={3}
                    placeholder="Enter your full address"
                  />
                ) : (
                  <p className="text-gray-900">{profile.address || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.city || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg focus:border-[#9179E0] focus:outline-none"
                    placeholder="e.g., Lagos"
                  />
                ) : (
                  <p className="text-gray-900">{profile.city || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                {isEditing ? (
                  <select
                    value={editedProfile.state || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, state: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#9179E0] focus:outline-none"
                  >
                    <option value="">Select State</option>
                    {nigerianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{profile.state || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">About Me</h2>
            {isEditing ? (
              <textarea
                value={editedProfile.bio || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg focus:border-[#9179E0] focus:outline-none resize-none"
                rows={6}
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
            ) : (
              <p className="text-gray-900">{profile.bio || 'No bio provided yet.'}</p>
            )}
            {isEditing && (
              <p className="text-xs text-gray-500 mt-2">
                {(editedProfile.bio || '').length}/500 characters
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}