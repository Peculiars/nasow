"use client";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ level: "", studentType: "", status: "", search: "" });
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.level) params.append("level", filter.level);
      if (filter.studentType) params.append("studentType", filter.studentType);
      if (filter.status) params.append("status", filter.status);
      if (filter.search) params.append("search", filter.search);

      const response = await fetch(`/api/admin/courses?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        fetchCourses();
        alert("Course deleted successfully");
      } else {
        alert("Failed to delete course");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete course");
    }
  };

  return (
    <div className="md:p-8 p-4 font-inter bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex md:flex-row flex-col  md:items-center items-start space-y-3 md:space-y-0 justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600 mt-1">Manage all course materials and content</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="md:px-6 px-3 py-3 md:py-3 bg-[#9179E0] text-white font-bold rounded-xl hover:bg-[#7E6BDB] transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5 hidden md:block" />
            Create New Course
          </button>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search courses..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="w-full px-4 py-2 border-2 text-gray-700 placeholder:text-gray-500 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
              <select
                value={filter.level}
                onChange={(e) => setFilter({ ...filter, level: e.target.value })}
                className="w-full cursor-pointer px-4 py-2 border-2 placeholder:text-gray-500 text-gray-700 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none"
              >
                <option className="cursor-pointer" value="">All Levels</option>
                <option className="cursor-pointer" value="100">100 Level</option>
                <option className="cursor-pointer" value="200">200 Level</option>
                <option className="cursor-pointer" value="300">300 Level</option>
                <option className="cursor-pointer" value="400">400 Level</option>
                <option className="cursor-pointer" value="500">500 Level</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Student Type</label>
              <select
                value={filter.studentType}
                onChange={(e) => setFilter({ ...filter, studentType: e.target.value })}
                className="w-full cursor-pointer px-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-xl focus:border-[#9179E0] focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full-Time</option>
                <option value="ICE">ICE</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full cursor-pointer px-4 py-2 border-2 border-gray-300 placeholder:text-gray-500 text-gray-700 rounded-xl focus:border-[#9179E0] focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <p className="text-sm text-gray-600">Published</p>
            <p className="text-2xl font-bold text-green-600">
              {courses.filter((c: any) => c.status === "PUBLISHED").length}
            </p>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <p className="text-sm text-gray-600">Drafts</p>
            <p className="text-2xl font-bold text-yellow-600">
              {courses.filter((c: any) => c.status === "DRAFT").length}
            </p>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Weeks</p>
            <p className="text-2xl font-bold text-blue-600">
              {courses.reduce((acc: number, c: any) => acc + (c.weeks?.length || 0), 0)}
            </p>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#9179E0] border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Create your first course to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <div key={course._id} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                <div className="h-48 bg-gray-200 relative">
                  <img src={course.coverImage.url} alt={course.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${course.status === "PUBLISHED" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                    {course.status}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                      {course.level}L
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                      {course.studentType === "FULL_TIME" ? "FT" : course.studentType === "ICE" ? "ICE" : "Both"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">Code: {course.courseCode}</p>
                  <p className="text-sm text-gray-600 mb-4">Lecturer: {course.lecturerName}</p>
                  <p className="text-sm text-gray-600 mb-4">{course.weeks?.length || 0} weeks</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = `/admin/courses/${course._id}/edit`}
                      className="flex-1 px-4 py-2 bg-[#9179E0] text-white font-bold rounded-lg hover:bg-[#7E6BDB] transition-all text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-8">
              <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
              <p className="text-gray-600">Form will be implemented in next step...</p>
              <button
                onClick={() => setShowCreateModal(false)}
                className="mt-4 px-6 py-2 bg-gray-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;