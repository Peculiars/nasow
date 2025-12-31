import { connectDB } from "@/src/lib/mongodb/connection";
import Course from "@/src/lib/mongodb/models/Course";
import ExploreCoursesClient from "./ExploreOurCoursesClient";

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

  return <ExploreCoursesClient courses={courses} />;
}