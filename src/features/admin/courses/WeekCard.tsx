import React, { useState } from "react";

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

type Props = {
  week: Week;
  index: number;
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
  moveWeek: (index: number, direction: "up" | "down") => void;
  deleteWeek: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
};

const WeekCard: React.FC<Props> = ({ week, index, formData, setFormData, moveWeek, deleteWeek, isFirst, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const updateWeek = (field: keyof Week, value: any) => {
    const updated = [...formData.weeks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, weeks: updated });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (week.materials.length + files.length > 3) {
      alert("Maximum 3 files per week");
      return;
    }

    try {
      setUploading(true);
      const uploadedFiles: Material[] = [];

      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("type", "material");

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formDataUpload
        });

        const data = await response.json();

        if (data.success) {
          uploadedFiles.push({
            name: data.data.name,
            url: data.data.url,
            publicId: data.data.publicId,
            fileType: data.data.fileType,
            fileSize: data.data.fileSize
          });
        }
      }

      updateWeek("materials", [...week.materials, ...uploadedFiles]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const removeMaterial = (materialIndex: number) => {
    const updated = week.materials.filter((_, i) => i !== materialIndex);
    updateWeek("materials", updated);
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 bg-[#9179E0] text-white rounded-full flex items-center justify-center font-bold text-sm">
            {week.weekNumber}
          </span>
          <div>
            <p className="font-bold text-gray-900">{week.title || `Week ${week.weekNumber}`}</p>
            <p className="text-sm text-gray-600">{week.materials.length} file(s)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); moveWeek(index, "up"); }} disabled={isFirst} className="p-2 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); moveWeek(index, "down"); }} disabled={isLast} className="p-2 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); deleteWeek(index); }} className="p-2 hover:bg-red-100 text-red-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <svg className={`w-5 h-5 text-gray-700 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="p-6 space-y-4 bg-white">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Week Title *</label>
            <input
              type="text"
              value={week.title}
              onChange={(e) => updateWeek("title", e.target.value)}
              placeholder="e.g., Introduction to Course"
              className="w-full px-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-xl focus:border-[#9179E0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
            <textarea
              value={week.content}
              onChange={(e) => updateWeek("content", e.target.value)}
              placeholder="Enter week content..."
              rows={6}
              className="w-full px-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-xl focus:border-[#9179E0] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Materials (Max 3 files)</label>
            {week.materials.length > 0 && (
              <div className="space-y-2 mb-3">
                {week.materials.map((material, mIndex) => (
                  <div key={mIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{material.name}</span>
                    </div>
                    <button onClick={() => removeMaterial(mIndex)} className="text-red-600 hover:bg-red-100 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {week.materials.length < 3 && (
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-[#9179E0] transition-all">
                {uploading ? (
                  <div className="py-2">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#9179E0] border-t-transparent"></div>
                    <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 font-medium">Upload PDF or DOC</p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekCard;