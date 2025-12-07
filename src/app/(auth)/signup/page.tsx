"use client";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { UserPlus, LogIn, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 font-inter">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logo.svg"
                alt="NASOWS UNILAG"
                width={100}
                height={100}
                className="mx-auto mb-4"
              />
            </Link>
            <h1 className="text-3xl font-bold text-[#4a368f] mb-2">
              Join NASOWS
            </h1>
            <p className="text-gray-600">
              Create your student account to get started
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
            <div className="mb-6">
              <RegisterLink
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#9179E0] to-[#7E6BDB] text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                Sign Up as Student
              </RegisterLink>
            </div>

            <div className="mb-6 p-5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
              <p className="text-sm font-bold text-gray-900 mb-3">
                What you'll get:
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Access to study materials and flashcards
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Participate in quiz competitions
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Stay updated with events and news
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  Connect with NASOWS community
                </li>
              </ul>
            </div>

            <div className="mb-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
              <p className="text-sm text-gray-700">
                <strong className="text-yellow-700">Admin Access:</strong> Admin accounts are invitation-only. Contact the administrator if you need admin privileges.
              </p>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              <LogIn className="w-5 h-5" />
              Login to Account
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#9179E0] font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}