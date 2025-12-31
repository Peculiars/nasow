import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs"
import Link from "next/link"
import { LogOut, BookOpen, Trophy, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"

export const metadata = {
  title: "Quiz Portal - NASOWS",
  description: "Take quizzes, view results, and compete on leaderboards",
}

export default async function QuizPortalPage() {
  const { getUser, isAuthenticated } = getKindeServerSession()
  const isAuth = await isAuthenticated()

  if (!isAuth) {
    redirect("/login")
  }

  const user = await getUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-inter">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#4a368f]">Welcome, {user?.given_name || "Student"}!</h1>
              <p className="text-gray-600 text-sm">{user?.email}</p>
            </div>
            <LogoutLink className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </LogoutLink>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#9179E0] flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Available Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">Start Here</p>
              <p className="text-sm text-gray-600 mt-2">Take quizzes to test your knowledge</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-600 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">Compete</p>
              <p className="text-sm text-gray-600 mt-2">See how you rank against peers</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                My Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">Track</p>
              <p className="text-sm text-gray-600 mt-2">View your performance history</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Take Quiz */}
          <Link href="/student/quizzes" className="group">
            <Card className="h-full bg-white rounded-2xl border-2 border-gray-200 hover:border-[#9179E0] hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-16 h-16 bg-[#9179E0]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#9179E0]/20 transition-colors">
                  <BookOpen className="w-8 h-8 text-[#9179E0]" />
                </div>
                <CardTitle className="text-xl text-gray-900">Take a Quiz</CardTitle>
                <CardDescription className="text-gray-500">Test your knowledge on different topics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-6">
                  Browse and take available quizzes with multiple questions, timers, and instant feedback.
                </p>
                <Button className="w-full bg-[#9179E0] hover:bg-[#7d63d4] text-white">Start Quiz</Button>
              </CardContent>
            </Card>
          </Link>

          {/* View Leaderboards */}
          <Link href="/student/leaderboards" className="group">
            <Card className="h-full bg-white rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Trophy className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Leaderboards</CardTitle>
                <CardDescription className="text-gray-500">Compete with classmates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-6">
                  View top performers for each quiz, see rankings, and track your position among peers.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  View Rankings
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* View Results */}
          <Link href="/student/results" className="group">
            <Card className="h-full bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">My Results</CardTitle>
                <CardDescription className="text-gray-500">Track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-6">
                  Review all your quiz attempts, scores, time taken, and whether you passed or failed.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  View Results
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info Section */}
        <Card className="mt-12 bg-[#4a368f]/5 border-2 border-[#9179E0]/20">
          <CardHeader>
            <CardTitle className="text-[#4a368f]">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#9179E0] text-white font-bold mb-4">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse Quizzes</h3>
                <p className="text-sm text-gray-600">
                  View all available quizzes with descriptions, duration, and passing scores
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#9179E0] text-white font-bold mb-4">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Take the Quiz</h3>
                <p className="text-sm text-gray-600">
                  Answer questions within the time limit with instant feedback after submission
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#9179E0] text-white font-bold mb-4">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">View Results</h3>
                <p className="text-sm text-gray-600">
                  Check your score, time taken, and see where you rank on the leaderboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
