import { connectDB } from "@/src/lib/mongodb/connection";
import Course from "@/src/lib/mongodb/models/Course";
import ExploreCoursesClient from "./ExploreOurCoursesClient";
import { Suspense } from "react";
import { CourseCardSkeleton } from "./SkeletonLoader";

function CoursesSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function getCourses() {
  try {
    await connectDB();
    
    const courses = await Course.find({ 
      status: { $in: ['published', 'PUBLISHED'] } 
    })
      .sort({ level: 1, courseCode: 1 })
      .lean();

    return courses.map(course => ({
      _id: course._id.toString(),
      code: course.courseCode,
      title: course.title,
      description: course.description || 'No description available',
      level: course.level,
      semester: course.semester,
      studentType: course.studentType,
      image: course.coverImage?.url || '/assets/placeholder-course.png',
      students: 0,
      duration: `${course.weeks?.length || 0} weeks`,
      weekCount: course.weeks?.length || 0,
      materialCount: course.weeks?.reduce((total, week) => total + (week.materials?.length || 0), 0) || 0
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export default async function ExploreOurCourses() {
  const courses = await getCourses();

  return (
    <Suspense fallback={<CoursesSkeletonGrid />}>
      <ExploreCoursesClient courses={courses} />
    </Suspense>
  );
}