"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Calendar, BookOpen, FileText, Loader2, ChevronDown, ChevronUp, ExternalLink, } from "lucide-react";
import Image from "next/image";
import { showError, showSuccess } from "@/src/lib/toast";
import ProfileGuard from "@/src/features/students/components/ProfileGuard";


interface Material {
  _id: string;
  name: string;
  fileType: string;
  fileSize?: number;
  url: string;
  publicId: string;
}

interface Week {
  _id: string;
  weekNumber: number;
  title: string;
  content?: string;
  materials: Material[];
}

interface Course {
  _id: string;
  title: string;
  courseCode: string;
  lecturerName: string;
  description?: string;
  level: string;
  studentType: string;
  coverImage?: {
    url: string;
    publicId: string;
  };
  weeks: Week[];
  createdAt: string;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) fetchCourse(id as string);
  }, [id]);

  const fetchCourse = async (courseId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/students/courses/${courseId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch course");
      }

      setCourse(data.data);

      if (data.data.weeks?.length) {
        setExpandedWeeks(new Set([data.data.weeks[0]._id]));
      }
    } catch (err: any) {
      showError(err.message || "Failed to load course");
      setTimeout(() => router.push("/portal/courses"), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      next.has(weekId) ? next.delete(weekId) : next.add(weekId);
      return next;
    });
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === "pdf") return "📄";
    if (["doc", "docx"].includes(fileType)) return "📝";
    if (["ppt", "pptx"].includes(fileType)) return "📊";
    if (["xls", "xlsx"].includes(fileType)) return "📈";
    return "📎";
  };

  const openMaterial = (material: Material) => {
    window.open(material.url, "_blank");
    showSuccess(`Opening ${material.name}`);
  };

  if (isLoading) {
    return (
      <ProfileGuard>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </ProfileGuard>
    );
  }

  if (!course) return null;


  return (
    <ProfileGuard>
      <div className="min-h-screen bg-gray-50 font-inter">
        <div className="bg-[#9179E0] text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <button
              onClick={() => router.push("/portal/courses")}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Courses
            </button>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {course.courseCode}
                </span>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {course.title}
                </h1>

                {course.description && (
                  <p className="text-lg text-white/90 mb-6">
                    {course.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                    <User className="h-4 w-4" />
                    {course.lecturerName}
                  </div>

                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                    <BookOpen className="h-4 w-4" />
                    {course.weeks.length} Weeks
                  </div>

                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                    <Calendar className="h-4 w-4" />
                    {formatDate(course.createdAt)}
                  </div>
                </div>
              </div>

              {course.coverImage?.url && (
                <div className="rounded-xl overflow-hidden shadow-xl border-4 border-white/20">
                  <Image
                    src={course.coverImage.url}
                    alt={course.title}
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10 space-y-4">
          {course.weeks.map((week) => {
            const isExpanded = expandedWeeks.has(week._id);

            return (
              <div
                key={week._id}
                className="bg-white border-2 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleWeek(week._id)}
                  className="w-full px-6 py-4 flex justify-between hover:bg-gray-50"
                >
                  <div className="flex gap-4 text-left">
                    <p className="bg-[#9179E0] text-white flex items-center justify-center space-x-1 px-2 rounded-lg font-bold">
                      <span>Week</span>
                      <span>{week.weekNumber}</span>
                    </p>

                    <div>
                      <h3 className="font-bold text-gray-700 text-lg">{week.title}</h3>
                      <p className="text-xs text-gray-500">
                        {week.materials.length} materials
                      </p>
                    </div>
                  </div>

                  {isExpanded ? <ChevronUp className="text-gray-800"/> : <ChevronDown className="text-gray-800"/>}
                </button>

                {isExpanded && (
                  <div className="border-t bg-gray-50 p-6 space-y-6">
                    {week.content && (
                      <div className="">
                        <h4 className="font-semibold text-gray-700 mb-2">Week Overview</h4>
                        <p className="text-sm whitespace-pre-line text-gray-700">
                          {week.content}
                        </p>
                      </div>
                    )}

                    {week.materials.length === 0 ? (
                      <p className="text-center text-gray-500">
                        No document materials for this week
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {week.materials.map((m) => (
                          <div
                            key={m._id}
                            className="md:bg-white md:border rounded-lg md:p-4 flex justify-between md:hover:shadow-md"
                          >
                            <div className="flex items-center gap-1 md:gap-3">
                              <span className="text-xl md:text-2xl">
                                {getFileIcon(m.fileType)}
                              </span>
                              <div>
                                <h4 className="font-semibold text-gray-700 text-sm md:text-base">{m.name}</h4>
                                <p className="text-xs text-gray-500">
                                  {m.fileType.toUpperCase()} •{" "}
                                  {formatFileSize(m.fileSize)}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => openMaterial(m)}
                              className="flex items-center gap-2 bg-purple-600 text-white md:px-4 px-2 py-0.5 md:py-2 rounded-lg hover:bg-purple-700"
                            >
                              <ExternalLink className="hidden md:block size-4" />
                              <span className="md:text-base text-sm">Open</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ProfileGuard>
  );
}
