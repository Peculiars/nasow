"use client";

import { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Executive {
  _id?: string;
  name: string;
  position: string;
  level: string;
  image: {
    url: string;
    publicId: string;
  };
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
  order: number;
  session: string;
  isActive: boolean;
}

interface ExecutiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Executive) => Promise<void>;
  executive?: Executive | null;
  mode: 'create' | 'edit';
}

export default function ExecutiveFormModal({
  isOpen,
  onClose,
  onSave,
  executive,
  mode
}: ExecutiveFormModalProps) {
  const [formData, setFormData] = useState<Executive>({
    name: '',
    position: '',
    level: '',
    image: { url: '', publicId: '' },
    bio: '',
    email: '',
    phone: '',
    socialMedia: {},
    achievements: [''],
    responsibilities: [''],
    order: 0,
    session: '2024/2025',
    isActive: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (executive && mode === 'edit') {
      setFormData(executive);
      setImagePreview(executive.image.url);
    } else {
      resetForm();
    }
  }, [executive, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      level: '',
      image: { url: '', publicId: '' },
      bio: '',
      email: '',
      phone: '',
      socialMedia: {},
      achievements: [''],
      responsibilities: [''],
      order: 0,
      session: '2024/2025',
      isActive: true
    });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

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

  const uploadImage = async (): Promise<{ url: string; publicId: string } | null> => {
    if (!imageFile) return formData.image.url ? formData.image : null;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'deym5qcv5';
    
    if (!cloudName) {
      setErrors({ image: 'Cloudinary configuration missing' });
      return null;
    }

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', imageFile);
      formDataUpload.append('upload_preset', 'nasows_unsigned');
      formDataUpload.append('folder', 'nasows/executives');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formDataUpload
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Cloudinary error:', error);
        throw new Error(error.error?.message || 'Image upload failed');
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } catch (error: any) {
      console.error('Image upload error:', error);
      setErrors({ image: `Failed to upload image: ${error.message}` });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.level.trim()) newErrors.level = 'Level is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.session.trim()) newErrors.session = 'Session is required';
    if (!imagePreview && mode === 'create') newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let imageData = formData.image;
      
      if (imageFile) {
        const uploaded = await uploadImage();
        if (!uploaded) {
          setIsSubmitting(false);
          return;
        }
        imageData = uploaded;
      }

      const cleanedAchievements = formData.achievements.filter(a => a.trim());
      const cleanedResponsibilities = formData.responsibilities.filter(r => r.trim());

      await onSave({
        ...formData,
        image: imageData,
        achievements: cleanedAchievements,
        responsibilities: cleanedResponsibilities
      });

      handleClose();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, '']
    });
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  const addResponsibility = () => {
    setFormData({
      ...formData,
      responsibilities: [...formData.responsibilities, '']
    });
  };

  const removeResponsibility = (index: number) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter((_, i) => i !== index)
    });
  };

  const updateResponsibility = (index: number, value: string) => {
    const newResponsibilities = [...formData.responsibilities];
    newResponsibilities[index] = value;
    setFormData({ ...formData, responsibilities: newResponsibilities });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <h3 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Add New Executive' : 'Edit Executive'}
            </h3>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 text-gray-700 placeholder:text-gray-500 cursor-pointer">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Profile Image *
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Name *</label>
                <input
                  type="text"
                  placeholder='e.g Oreoluwa Oluwafemi'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Position *</label>
                <input
                  type="text"
                  value={formData.position}
                  placeholder='e.g Vice President'
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.position ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.position && <p className="text-xs text-red-600 mt-1">{errors.position}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Level *</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.level ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <option value="">Select Level</option>
                  <option value="100 Level">100 Level</option>
                  <option value="200 Level">200 Level</option>
                  <option value="300 Level">300 Level</option>
                  <option value="400 Level">400 Level</option>
                  <option value="500 Level">500 Level</option>
                </select>
                {errors.level && <p className="text-xs text-red-600 mt-1">{errors.level}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Session *</label>
                <input
                  type="text"
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  placeholder="e.g., 2024/2025"
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.session ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.session && <p className="text-xs text-red-600 mt-1">{errors.session}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                <input
                  type="email"
                  placeholder='e.g example@gmail.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone *</label>
                <input
                  type="tel"
                  placeholder='e.g 080123456789'
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Order</label>
                <input
                  type="number"
                  placeholder='e.g 1'
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <select
                  value={formData.isActive.toString()}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Bio *</label>
              <textarea
                value={formData.bio}
                placeholder='e.g Tell us about yourself'
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${errors.bio ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.bio && <p className="text-xs text-red-600 mt-1">{errors.bio}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Instagram</label>
                <input
                  type="text"
                  value={formData.socialMedia.instagram || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                  })}
                  placeholder="@username"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">LinkedIn</label>
                <input
                  type="text"
                  value={formData.socialMedia.linkedin || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
                  })}
                  placeholder="username"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Twitter</label>
                <input
                  type="text"
                  value={formData.socialMedia.twitter || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                  })}
                  placeholder="@username"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Facebook</label>
                <input
                  type="text"
                  value={formData.socialMedia.facebook || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                  })}
                  placeholder="username"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-900">Achievements</label>
                <button
                  type="button"
                  onClick={addAchievement}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Achievement
                </button>
              </div>
              <div className="space-y-2">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={`Achievement ${index + 1}`}
                    />
                    {formData.achievements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-900">Responsibilities</label>
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Responsibility
                </button>
              </div>
              <div className="space-y-2">
                {formData.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={responsibility}
                      onChange={(e) => updateResponsibility(index, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={`Responsibility ${index + 1}`}
                    />
                    {formData.responsibilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || isUploading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(isSubmitting || isUploading) ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isUploading ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  mode === 'create' ? 'Create Executive' : 'Update Executive'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}