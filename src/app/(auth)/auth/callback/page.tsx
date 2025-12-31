import { connectDB } from "@/src/lib/mongodb/connection";
import { Student, StudentStatus } from "@/src/lib/mongodb/models/Student";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthCallback() {
  const { getPermission, getUser } = getKindeServerSession();
  const user = await getUser();
  const adminAccess = await getPermission("admin:access");

  if (!user) {
    redirect("/login");
  }

  if (adminAccess?.isGranted) {
    redirect("/admin");
  }

  let shouldRedirectToOnboarding = false;

  try {
    await connectDB();

    let student = await Student.findOne({ kindeId: user.id });

    if (student) {
      student.lastActive = new Date();
      
      if (user.email && student.email !== user.email) {
        student.email = user.email;
      }
      if (user.given_name && student.firstName !== user.given_name) {
        student.firstName = user.given_name;
      }
      if (user.family_name && student.lastName !== user.family_name) {
        student.lastName = user.family_name;
      }
      if (user.picture && student.profileImage !== user.picture) {
        student.profileImage = user.picture;
      }

      await student.save();
      
      shouldRedirectToOnboarding = !student.profileCompleted;
    } else {
      student = await Student.create({
        kindeId: user.id,
        email: user.email || '',
        firstName: user.given_name || 'Student',
        lastName: user.family_name || 'User',
        profileImage: user.picture,
        status: StudentStatus.ACTIVE,
        profileCompleted: false,
        totalScore: 0,
        quizzesTaken: 0,
        registrationDate: new Date(),
        lastActive: new Date()
      });
      
      shouldRedirectToOnboarding = true;
    }
  } catch (error) {
    console.error('Failed to sync student profile:', error);
  }

  if (shouldRedirectToOnboarding) {
    redirect("/onboarding");
  }
  
  redirect("/portal");
}