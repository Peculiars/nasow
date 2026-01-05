import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { BookOpen, Trophy, Calendar, User, LogOut, GraduationCap, Mail } from "lucide-react";
import Link from "next/link";

export default async function PortalPage() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();
  
  if (!isAuth) {
    redirect("/login");
  }

  const user = await getUser();

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#4a368f]">
                Welcome, {user?.given_name || "Student"}!
              </h1>
              <p className="text-gray-600">
                {user?.email}
              </p>
            </div>
            <LogoutLink className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </LogoutLink>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Flashcards */}
          <Link
            href="/flashcards"
            className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200 hover:border-[#9179E0] hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-[#9179E0]/10 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-[#9179E0]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Study Flashcards
            </h3>
            <p className="text-gray-600">
              Review and master key concepts for your exams
            </p>
          </Link>

          <Link
            href="/quiz"
            className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200 hover:border-[#9179E0] hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Take Quiz
            </h3>
            <p className="text-gray-600">
              Compete with others and win prizes
            </p>
          </Link>
          <Link
            href="/portal/courses"
            className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200 hover:border-[#9179E0] hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Courses
            </h3>
            <p className="text-gray-600">
              Explore and manage your course materials
            </p>
          </Link>
          <Link
            href="/events"
            className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200 hover:border-[#9179E0] hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Events
            </h3>
            <p className="text-gray-600">
              Stay updated with NASOWS activities
            </p>
          </Link>

          <Link
            href="/portal/profile"
            className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200 hover:border-[#9179E0] hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              My Profile
            </h3>
            <p className="text-gray-600">
              View and update your information
            </p>
          </Link>

          <Link
            href="/contact"
            className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200 hover:border-[#9179E0] hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Contact
            </h3>
            <p className="text-gray-600">
              Get in touch with us for support
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}