import React, { useState } from "react";
import WeekCard from "./WeekCard";

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
  studentType: string;
  lecturerName: string;
  coverImage?: { url: string; publicId?: string } | null;
  weeks: Week[];
  status?: string;
};

const WeeksStep: React.FC<{
  formData: CourseFormData;
  setFormData: React.Dispatch<React.SetStateAction<CourseFormData>>;
}> = ({ formData, setFormData }) => {
  const [showAddWeek, setShowAddWeek] = useState(false);

  const addWeek = () => {
    const newWeek: Week = {
      weekNumber: formData.weeks.length + 1,
      title: "",
      content: "",
      materials: [],
      order: formData.weeks.length,
      isPublished: true
    };
    setFormData({ ...formData, weeks: [...formData.weeks, newWeek] });
    setShowAddWeek(true);
  };

  const deleteWeek = (index: number) => {
    const updated = formData.weeks.filter((_, i) => i !== index);
    setFormData({ ...formData, weeks: updated });
  };

  const moveWeek = (index: number, direction: "up" | "down") => {
    const newWeeks = [...formData.weeks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWeeks.length) return;
    [newWeeks[index], newWeeks[targetIndex]] = [newWeeks[targetIndex], newWeeks[index]];
    newWeeks.forEach((w, i) => (w.order = i));
    setFormData({ ...formData, weeks: newWeeks });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Course Weeks</h2>
        <button
          onClick={addWeek}
          className="px-4 py-2 bg-[#9179E0] text-white font-bold rounded-xl hover:bg-[#7E6BDB] transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Week
        </button>
      </div>

      {formData.weeks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="text-gray-600 font-medium">No weeks added yet</p>
          <p className="text-sm text-gray-500 mt-1">Click "Add Week" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.weeks.map((week, index) => (
            <WeekCard
              key={index}
              week={week}
              index={index}
              formData={formData}
              setFormData={setFormData}
              moveWeek={moveWeek}
              deleteWeek={deleteWeek}
              isFirst={index === 0}
              isLast={index === formData.weeks.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeksStep;