"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import BasicInfoStep from "@/src/features/admin/courses/BasicInfoStep";
import WeeksStep from "@/src/features/admin/courses/WeeksStep";
import ReviewStep from "@/src/features/admin/courses/ReviewStep";

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

const EditCoursePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
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

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/courses/${courseId}`);
      const data = await response.json();

      if (data.success) {
        setFormData(data.data);
      } else {
        alert("Failed to fetch course");
        router.push("/admin/courses");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch course");
      router.push("/admin/courses");
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Course ${status === "PUBLISHED" ? "published" : "updated"} successfully!`);
        router.push("/admin/courses");
      } else {
        alert(data.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#9179E0] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-inter">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-1">Update course materials and content</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 text-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-bold">
              Step {step} of 3: {
                {
                  1: "Basic Info",
                  2: "Add Weeks",
                  3: "Review"
                }[step]
              }
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
          {step === 1 && <BasicInfoStep formData={formData} setFormData={setFormData} />}
          {step === 2 && <WeeksStep formData={formData} setFormData={setFormData} />}
          {step === 3 && <ReviewStep formData={formData} />}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => router.push("/admin/courses")}
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
                  disabled={saving}
                  className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  onClick={() => handleSubmit("PUBLISHED")}
                  disabled={saving}
                  className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  {saving ? "Publishing..." : "Publish Course"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;