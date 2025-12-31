"use client";
import React, { useState } from "react";
import BasicInfoStep from "../../../../features/admin/courses/BasicInfoStep";
import WeeksStep from "../../../../features/admin/courses/WeeksStep";
import ReviewStep from "../../../../features/admin/courses/ReviewStep";

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

const CreateCoursePage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    courseCode: "",
    level: "",
    studentType: "",
    lecturerName: "",
    coverImage: null,
    weeks: [],
    status: "DRAFT"
  });

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const validateStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.courseCode || !formData.level || !formData.studentType || !formData.lecturerName) {
        alert("Please fill all required fields");
        return false;
      }
      if (!formData.coverImage) {
        alert("Please upload a cover image");
        return false;
      }
    }
    if (step === 2 && formData.weeks.length === 0) {
      alert("Please add at least one week");
      return false;
    }
    return true;
  };

  const handleSubmit = async (status: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Course ${status === "PUBLISHED" ? "published" : "saved as draft"} successfully!`);
        window.location.href = "/admin/courses";
      } else {
        alert(data.error || "Failed to create course");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-inter">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-1">Add course materials and content for students</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 text-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            {{
              1: "Basic Info",
              2: "Add Weeks",
              3: "Review"
            }[step]}
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
          {step === 1 && <BasicInfoStep formData={formData} setFormData={setFormData} />}
          {step === 2 && <WeeksStep formData={formData} setFormData={setFormData} />}
          {step === 3 && <ReviewStep formData={formData} />}
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => window.location.href = "/admin/courses"}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-[#9179E0] transition-all"
              >
                Previous
              </button>
            )}
            {step < 3 && (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-[#9179E0] text-white font-bold rounded-xl hover:bg-[#7E6BDB] transition-all"
              >
                Next Step
              </button>
            )}
            {step === 3 && (
              <>
                <button
                  onClick={() => handleSubmit("DRAFT")}
                  disabled={loading}
                  className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-all disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSubmit("PUBLISHED")}
                  disabled={loading}
                  className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  Publish Course
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;