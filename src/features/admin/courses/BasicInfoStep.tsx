import React, { useRef, useState } from "react";

type Material = {
  name: string;
  url: string;
  publicId?: string;
  fileType?: string;
  fileSize?: number;
};

type Week = {
  weekNumber: number;
  title: string;
  content?: string;
  materials: Material[];
  order?: number;
  isPublished?: boolean;
};

type CourseFormData = {
  title: string;
  courseCode: string;
  level: string;
  semester: string;
  studentType: string;
  lecturerName: string;
  coverImage?: { url: string; publicId?: string } | null;
  weeks: Week[];
  status?: string;
};

const BasicInfoStep: React.FC<{
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}> = ({ formData, setFormData }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "image");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload
      });

      const data = await response.json();

      if (data.success) {
        setFormData({
          ...formData,
          coverImage: { url: data.data.url, publicId: data.data.publicId }
        });
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Course Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Introduction to Social Work"
            className="w-full px-4 py-3 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-xl focus:border-[#9179E0] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Course Code *</label>
          <input
            type="text"
            value={formData.courseCode}
            onChange={(e) => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
            placeholder="e.g., SWK101"
            className="w-full px-4 py-3 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-xl focus:border-[#9179E0] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Level *</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 cursor-pointer rounded-xl focus:border-[#9179E0] focus:outline-none"
          >
            <option value="">Select Level</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Semester *</label>
          <select
            value={formData.semester || "FIRST"}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 cursor-pointer rounded-xl focus:border-[#9179E0] focus:outline-none"
          >
            <option value="FIRST">First Semester</option>
            <option value="SECOND">Second Semester</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Student Type *</label>
          <select
            value={formData.studentType}
            onChange={(e) => setFormData({ ...formData, studentType: e.target.value })}
            className="w-full px-4 py-3 border-2 cursor-pointer border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-xl focus:border-[#9179E0] focus:outline-none"
          >
            <option value="">Select Student Type</option>
            <option value="FULL_TIME">Full-Time</option>
            <option value="ICE">ICE</option>
            <option value="BOTH">Both (Full-Time & ICE)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Lecturer Name *</label>
          <input
            type="text"
            value={formData.lecturerName}
            onChange={(e) => setFormData({ ...formData, lecturerName: e.target.value })}
            placeholder="e.g., Dr. John Doe"
            className="w-full px-4 py-3 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-xl focus:border-[#9179E0] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Course Cover Image *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#9179E0] transition-all cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          {formData.coverImage ? (
            <div className="relative">
              <img src={formData.coverImage.url} alt="Cover" className="max-h-64 mx-auto rounded-lg" />
              <button
                onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, coverImage: null }); }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : uploading ? (
            <div>
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#9179E0] border-t-transparent mb-4"></div>
              <p className="text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div>
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 font-medium">Click to upload cover image</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;