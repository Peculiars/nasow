import { useState, useRef, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface SponsorFormData {
  name: string;
  description: string;
  website: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  displayOrder: number;
  logo?: File;
}

interface SponsorFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editData?: {
    _id: string;
    name: string;
    description: string;
    website: string;
    tier: 'Platinum' | 'Gold' | 'Silver';
    displayOrder: number;
    logo: {
      url: string;
      publicId: string;
    };
  };
}

export default function SponsorForm({ onClose, onSuccess, editData }: SponsorFormProps) {
  const [formData, setFormData] = useState<SponsorFormData>({
    name: editData?.name || '',
    description: editData?.description || '',
    website: editData?.website || '',
    tier: editData?.tier || 'Silver',
    displayOrder: editData?.displayOrder || 0
  });

  const [logoPreview, setLogoPreview] = useState<string>(editData?.logo.url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'displayOrder' ? parseInt(value) || 0 : value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setFormData(prev => ({ ...prev, logo: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!editData && !formData.logo) {
        setError('Please upload a logo');
        setIsSubmitting(false);
        return;
      }

      const submitFormData = new FormData();
      if (editData) {
        submitFormData.append('id', editData._id);
      }
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('website', formData.website);
      submitFormData.append('tier', formData.tier);
      submitFormData.append('displayOrder', formData.displayOrder.toString());
      
      if (formData.logo) {
        submitFormData.append('logo', formData.logo);
      }

      const response = await fetch('/api/sponsors', {
        method: editData ? 'PUT' : 'POST',
        body: submitFormData
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save sponsor');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full  my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#4a368f]">
            {editData ? 'Edit Sponsor' : 'Add New Sponsor'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo *
            </label>
            <div className="space-y-4">
              {logoPreview && (
                <div className="relative w-full h-40 bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    width={200}
                    height={100}
                    className="object-contain max-h-32"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#9179E0] transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-[#9179E0]"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500">
                PNG, JPG, or GIF. Max 5MB. Recommended: 400x200px
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Sponsor Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent outline-none transition-all"
              placeholder="e.g., UNICEF Nigeria"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent outline-none transition-all resize-none"
              placeholder="Brief description of the sponsor's contribution"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
              Website URL *
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent outline-none transition-all"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tier" className="block text-sm font-semibold text-gray-700 mb-2">
                Tier *
              </label>
              <select
                id="tier"
                name="tier"
                value={formData.tier}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-800 placeholder:text-gray-400 cursor-pointer  rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent outline-none transition-all"
              >
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>

            <div>
              <label htmlFor="displayOrder" className="block text-sm font-semibold text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                id="displayOrder"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min={0}
                className="w-full px-4 py-3 border border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-[#9179E0] focus:border-transparent outline-none transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4a368f] to-[#9179E0] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {editData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editData ? 'Update Sponsor' : 'Add Sponsor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}