import CoursesClient from "@/src/features/students/components/CoursesClient";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();
  
  if (!isAuth) {
    redirect("/login");
  }

  return <CoursesClient />;
}