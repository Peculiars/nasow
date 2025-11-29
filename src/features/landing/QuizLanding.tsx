import { useState } from "react";
import { Trophy, Zap, Target, TrendingUp, ArrowRight, Sparkles, Brain, Award, Clock, Users, Star, Medal } from "lucide-react";

const QuizLanding = () => {
  const [activeQuiz, setActiveQuiz] = useState(0);

  const quizzes = [
    {
      title: "Social Work Ethics & Values",
      difficulty: "Intermediate",
      questions: 20,
      time: "20 min",
      prize: "₦5,000",
      participants: 45,
      color: "purple"
    },
    {
      title: "Clinical Practice Methods",
      difficulty: "Advanced",
      questions: 15,
      time: "15 min",
      prize: "₦3,000",
      participants: 32,
      color: "blue"
    },
    {
      title: "Community Development",
      difficulty: "Beginner",
      questions: 10,
      time: "10 min",
      prize: "₦2,000",
      participants: 58,
      color: "green"
    }
  ];

  const features = [
    {
      icon: Trophy,
      title: "Win Prizes",
      description: "Top performers earn cash prizes and certificates of excellence",
      color: "yellow"
    },
    {
      icon: Brain,
      title: "Test Your Knowledge",
      description: "Challenge yourself with comprehensive questions on social work topics",
      color: "purple"
    },
    {
      icon: TrendingUp,
      title: "Track Your Ranking",
      description: "See how you compare to other students on the leaderboard",
      color: "blue"
    },
    {
      icon: Clock,
      title: "Time-Based Challenges",
      description: "Complete quizzes within time limits to test your quick thinking",
      color: "green"
    }
  ];

  const topPerformers = [
    { name: "Adebayo Chiamaka", score: 95, level: "400L" },
    { name: "Okonkwo Michael", score: 90, level: "300L" },
    { name: "Eze Sarah", score: 85, level: "400L" }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; border: string; text: string; icon: string } } = {
      purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", icon: "bg-[#9179E0]" },
      blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", icon: "bg-blue-500" },
      green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-600", icon: "bg-green-500" },
      yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-600", icon: "bg-yellow-500" }
    };
    return colors[color] || colors.purple;
  };

  return (
    <section className="py-16 md:py-24 bg-white w-full font-inter">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center md:text-left mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
            <div className="hidden md:block size-6 bg-yellow-500" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">
              Quiz Competition
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Challenge yourself, compete with peers, and win amazing prizes while mastering social work concepts
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Side - Active Quizzes */}
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Active Quiz Competitions
              </h3>
            </div>

            <div className="space-y-4">
              {quizzes.map((quiz, index) => {
                const colors = getColorClasses(quiz.color);
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setActiveQuiz(index)}
                    className={`group relative bg-white rounded-2xl border-2 p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
                      activeQuiz === index ? colors.border : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className={`w-5 h-5 ${colors.text}`} />
                          <h4 className="text-lg font-bold text-gray-900">
                            {quiz.title}
                          </h4>
                        </div>
                        <span className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} text-xs font-bold rounded-lg`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="w-4 h-4" />
                        <span>{quiz.questions} Questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{quiz.participants} Joined</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-yellow-600">
                        <Award className="w-4 h-4" />
                        <span>{quiz.prize} Prize</span>
                      </div>
                    </div>

                    <button className={`w-full py-3 ${colors.icon} text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}>
                      Start Quiz
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Features & Leaderboard */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const colors = getColorClasses(feature.color);
                const Icon = feature.icon;
                return (
                  <div key={index} className={`flex items-start gap-4 p-5 ${colors.bg} rounded-xl border ${colors.border}`}>
                    <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mini Leaderboard */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-yellow-500" />
                  Top Performers
                </h3>
                <button className="text-sm text-[#9179E0] font-bold hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                      'bg-gradient-to-br from-orange-400 to-orange-500'
                    }`}>
                      {index === 0 ? '🏆' : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{performer.name}</p>
                      <p className="text-xs text-gray-600">{performer.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#9179E0]">{performer.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-[#9179E0] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#7E6BDB] transition-all duration-300 hover:scale-105">
              <Trophy className="w-5 h-5" />
              View All Competitions
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-10 px-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#9179E0] rounded-xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">50+</p>
            <p className="text-sm text-gray-600 font-medium">Competitions</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">2000+</p>
            <p className="text-sm text-gray-600 font-medium">Participants</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">₦100K+</p>
            <p className="text-sm text-gray-600 font-medium">Prizes Won</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">4.9/5</p>
            <p className="text-sm text-gray-600 font-medium">Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizLanding;