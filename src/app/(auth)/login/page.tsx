"use client";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { LogIn, Shield, BookOpen, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
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
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Login to access your NASOWS portal
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
            <div className="space-y-4">
              {/* Student Login */}
              <LoginLink
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#9179E0] text-white font-bold rounded-xl hover:bg-[#7E6BDB] transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                Login as Student
              </LoginLink>

              {/* Admin Login */}
              <LoginLink
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-[#9179E0] text-[#9179E0] font-bold rounded-xl hover:bg-purple-50 transition-all duration-300 hover:scale-105"
              >
                <Shield className="w-5 h-5" />
                Login as Admin
              </LoginLink>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong className="text-blue-600">Note:</strong> Admin accounts are invitation-only. Contact the system administrator for admin access.
              </p>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Don't have a student account?
                </span>
              </div>
            </div>

            <Link
              href="/signup"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Create Student Account
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              By continuing, you agree to NASOWS{" "}
              <Link href="/terms" className="text-[#9179E0] hover:underline">
                Terms of Service
              </Link>
            </p>
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
