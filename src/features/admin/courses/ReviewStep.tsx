import React from "react";

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

const ReviewStep: React.FC<{ formData: CourseFormData }> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Course</h2>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">Course Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Title</p>
            <p className="font-medium text-gray-900">{formData.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Code</p>
            <p className="font-medium text-gray-900">{formData.courseCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Level</p>
            <p className="font-medium text-gray-900">{formData.level} Level</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Student Type</p>
            <p className="font-medium text-gray-900">{formData.studentType}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Lecturer</p>
            <p className="font-medium text-gray-900">{formData.lecturerName}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">Course Content</h3>
        <p className="text-gray-700 mb-2">
          <strong>{formData.weeks.length}</strong> weeks added
        </p>
        <div className="space-y-2">
          {formData.weeks.map((week, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <p className="font-medium text-gray-900">
                Week {week.weekNumber}: {week.title}
              </p>
              <span className="text-sm text-gray-600">{week.materials.length} file(s)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          <strong>Ready to publish?</strong> Once published, students in the selected level and type will be able to access this course.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;