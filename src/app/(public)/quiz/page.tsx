"use client"
import { useState, useEffect } from "react";
import { Trophy, Clock, Users, Award, CheckCircle, XCircle, Target, Zap, Star, Medal, Crown, TrendingUp } from "lucide-react";

// Sample Quiz Data
const quizData = {
  id: 1,
  title: "Social Work Ethics & Values Quiz",
  description: "Test your knowledge on core social work principles and ethical standards",
  createdBy: "Adebayo Chiamaka (President)",
  timeLimit: 1200, // 20 minutes in seconds
  totalQuestions: 20,
  prize: "₦5,000 + Certificate of Excellence",
  participants: 45,
  questions: [
    {
      id: 1,
      question: "What are the six core values of social work according to NASW?",
      options: [
        "Service, Social Justice, Dignity, Relationships, Integrity, Competence",
        "Empathy, Honesty, Service, Justice, Care, Excellence",
        "Ethics, Values, Service, Justice, Care, Competence",
        "Dignity, Service, Ethics, Care, Justice, Competence"
      ],
      correctAnswer: 0,
      points: 5
    },
    {
      id: 2,
      question: "Which theorist developed Person-Centered Therapy?",
      options: [
        "Sigmund Freud",
        "Carl Rogers",
        "Erik Erikson",
        "Abraham Maslow"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 3,
      question: "What is the primary focus of Systems Theory in social work?",
      options: [
        "Individual therapy only",
        "Interconnected systems and relationships",
        "Community organizing",
        "Research methods"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 4,
      question: "Which of these is NOT a level of social work practice?",
      options: [
        "Micro (Individual)",
        "Mezzo (Group/Family)",
        "Macro (Community/Policy)",
        "Ultra (International)"
      ],
      correctAnswer: 3,
      points: 5
    },
    {
      id: 5,
      question: "What does 'Unconditional Positive Regard' mean in social work?",
      options: [
        "Agreeing with everything the client says",
        "Accepting the client without judgment",
        "Giving clients whatever they want",
        "Being extremely positive at all times"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 6,
      question: "What is the primary purpose of case management in social work?",
      options: [
        "To diagnose mental illnesses",
        "To coordinate services and resources for clients",
        "To provide legal representation",
        "To prescribe medication"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 7,
      question: "Which ethical principle requires social workers to respect client privacy?",
      options: [
        "Beneficence",
        "Justice",
        "Confidentiality",
        "Autonomy"
      ],
      correctAnswer: 2,
      points: 5
    },
    {
      id: 8,
      question: "What is cultural competence in social work?",
      options: [
        "Speaking multiple languages",
        "Understanding and respecting diverse cultural backgrounds",
        "Only working with clients from your own culture",
        "Avoiding discussions about culture"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 9,
      question: "Who is considered the founder of modern social work?",
      options: [
        "Jane Addams",
        "Mary Richmond",
        "Sigmund Freud",
        "John Dewey"
      ],
      correctAnswer: 0,
      points: 5
    },
    {
      id: 10,
      question: "What does the acronym NASW stand for?",
      options: [
        "National Association of Social Workers",
        "Nigerian Association of Social Welfare",
        "National Alliance for Social Work",
        "New Age Social Work"
      ],
      correctAnswer: 0,
      points: 5
    },
    {
      id: 11,
      question: "What is the primary goal of empowerment in social work?",
      options: [
        "Making decisions for clients",
        "Helping clients gain control over their lives",
        "Providing financial assistance",
        "Avoiding client independence"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 12,
      question: "Which assessment tool is commonly used in social work for understanding family dynamics?",
      options: [
        "Genogram",
        "IQ Test",
        "Blood Test",
        "Credit Report"
      ],
      correctAnswer: 0,
      points: 5
    },
    {
      id: 13,
      question: "What is dual relationship in social work ethics?",
      options: [
        "Working two jobs",
        "Having both professional and personal relationship with a client",
        "Seeing two clients at once",
        "Working in two different agencies"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 14,
      question: "What does strengths-based practice focus on?",
      options: [
        "Client problems and deficits",
        "Client strengths and resources",
        "Worker expertise only",
        "Community weaknesses"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 15,
      question: "What is advocacy in social work?",
      options: [
        "Avoiding conflict",
        "Speaking up for client rights and needs",
        "Following orders without question",
        "Ignoring systemic issues"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 16,
      question: "Which theory emphasizes the importance of early childhood experiences?",
      options: [
        "Behavioral Theory",
        "Psychodynamic Theory",
        "Systems Theory",
        "Cognitive Theory"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 17,
      question: "What is social justice in the context of social work?",
      options: [
        "Following legal procedures",
        "Fair distribution of resources and opportunities",
        "Punishing wrongdoers",
        "Maintaining status quo"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 18,
      question: "What is the purpose of supervision in social work?",
      options: [
        "To criticize workers",
        "To provide support, guidance, and professional development",
        "To reduce salaries",
        "To increase workload"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 19,
      question: "What is trauma-informed care?",
      options: [
        "Ignoring past traumas",
        "Recognizing and responding to the impact of trauma",
        "Focusing only on current issues",
        "Avoiding sensitive topics"
      ],
      correctAnswer: 1,
      points: 5
    },
    {
      id: 20,
      question: "What is the primary focus of community organizing in social work?",
      options: [
        "Individual therapy",
        "Mobilizing communities for collective action",
        "Administrative tasks",
        "Research only"
      ],
      correctAnswer: 1,
      points: 5
    }
  ]
};

// Sample Leaderboard Data (This would be fetched from storage in production)
const initialLeaderboard = [
  { name: "Adebayo Chiamaka", level: "400", score: 95, time: "15:23", date: "2025-11-28", correctAnswers: 19 },
  { name: "Okonkwo Michael", level: "300", score: 90, time: "16:45", date: "2025-11-27", correctAnswers: 18 },
  { name: "Eze Sarah", level: "400", score: 85, time: "17:12", date: "2025-11-26", correctAnswers: 17 },
  { name: "Balogun Tunde", level: "200", score: 80, time: "18:30", date: "2025-11-25", correctAnswers: 16 },
  { name: "Nwosu Grace", level: "300", score: 75, time: "16:55", date: "2025-11-24", correctAnswers: 15 },
  { name: "Ibrahim Aisha", level: "400", score: 70, time: "19:10", date: "2025-11-23", correctAnswers: 14 },
  { name: "Okoro Daniel", level: "200", score: 65, time: "17:45", date: "2025-11-22", correctAnswers: 13 },
  { name: "Chukwu Blessing", level: "300", score: 60, time: "18:20", date: "2025-11-21", correctAnswers: 12 },
];

const QuizCompetition = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(quizData.timeLimit);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentLevel, setStudentLevel] = useState("");
  const [score, setScore] = useState(0);
  const [showNameForm, setShowNameForm] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Timer countdown
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, quizCompleted, timeRemaining]);

  const handleStartQuiz = () => {
    if (studentName.trim() && studentLevel.trim()) {
      setShowNameForm(false);
      setQuizStarted(true);
    }
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let totalScore = 0;
    let correctCount = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        totalScore += question.points;
        correctCount++;
      }
    });
    const finalScore = totalScore;
    const percentage = Math.round((finalScore / (quizData.questions.length * 5)) * 100);
    const timeTaken = quizData.timeLimit - timeRemaining;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    setScore(finalScore);
    
    // Add to leaderboard
    const newEntry = {
      name: studentName,
      level: studentLevel,
      score: percentage,
      time: timeStr,
      date: new Date().toISOString().split('T')[0],
      correctAnswers: correctCount
    };
    
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        // If scores are equal, sort by time (less time is better)
        const [aMin, aSec] = a.time.split(':').map(Number);
        const [bMin, bSec] = b.time.split(':').map(Number);
        return (aMin * 60 + aSec) - (bMin * 60 + bSec);
      });
    
    // Find user's rank
    const rank = updatedLeaderboard.findIndex(entry => 
      entry.name === studentName && entry.date === newEntry.date
    ) + 1;
    
    setUserRank(rank);
    setLeaderboard(updatedLeaderboard);
    setQuizCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = selectedAnswers.filter(a => a !== undefined).length;
  const progress = (answeredCount / quizData.questions.length) * 100;
  const percentage = Math.round((score / (quizData.questions.length * 5)) * 100);

  // Show Leaderboard
  if (showLeaderboard) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 md:py-20 font-inter">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-5 py-2.5 rounded-xl mb-5 shadow-lg">
              <Trophy className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white tracking-wide">🏆 LEADERBOARD</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#4a368f] to-[#9179E0] bg-clip-text text-transparent mb-4">
              Hall of Champions
            </h1>
            <p className="text-lg text-gray-600">Celebrating our top performers!</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-6 text-center">
              <Users className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-purple-600">{leaderboard.length}</p>
              <p className="text-sm text-gray-600 font-medium">Total Participants</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6 text-center">
              <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-green-600">{leaderboard[0]?.score}%</p>
              <p className="text-sm text-gray-600 font-medium">Highest Score</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 text-center">
              <Clock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-blue-600">{leaderboard[0]?.time}</p>
              <p className="text-sm text-gray-600 font-medium">Fastest Time (Top Score)</p>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="mb-8">
            <div className="flex items-end justify-center gap-4 mb-8">
              {/* 2nd Place */}
              {leaderboard[1] && (
                <div className="flex-1 max-w-xs">
                  <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-t-2xl p-6 text-center border-4 border-gray-500 shadow-xl">
                    <Medal className="w-12 h-12 text-white mx-auto mb-2" />
                    <p className="text-white font-bold text-lg mb-1">{leaderboard[1].name}</p>
                    <p className="text-white/80 text-sm mb-2">{leaderboard[1].level} Level</p>
                    <p className="text-4xl font-bold text-white">{leaderboard[1].score}%</p>
                    <p className="text-white/80 text-sm mt-1">{leaderboard[1].time}</p>
                  </div>
                  <div className="bg-gray-400 h-24 rounded-b-2xl flex items-center justify-center border-4 border-t-0 border-gray-500">
                    <span className="text-3xl font-bold text-white">2nd</span>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {leaderboard[0] && (
                <div className="flex-1 max-w-xs">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-t-2xl p-8 text-center border-4 border-yellow-600 shadow-2xl transform scale-105">
                    <Crown className="w-16 h-16 text-white mx-auto mb-2 animate-pulse" />
                    <p className="text-white font-bold text-xl mb-1">{leaderboard[0].name}</p>
                    <p className="text-white/90 text-sm mb-3">{leaderboard[0].level} Level</p>
                    <p className="text-5xl font-bold text-white">{leaderboard[0].score}%</p>
                    <p className="text-white/90 text-sm mt-2">{leaderboard[0].time}</p>
                  </div>
                  <div className="bg-yellow-500 h-32 rounded-b-2xl flex items-center justify-center border-4 border-t-0 border-yellow-600">
                    <span className="text-4xl font-bold text-white">1st</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {leaderboard[2] && (
                <div className="flex-1 max-w-xs">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-t-2xl p-6 text-center border-4 border-orange-600 shadow-xl">
                    <Award className="w-12 h-12 text-white mx-auto mb-2" />
                    <p className="text-white font-bold text-lg mb-1">{leaderboard[2].name}</p>
                    <p className="text-white/80 text-sm mb-2">{leaderboard[2].level} Level</p>
                    <p className="text-4xl font-bold text-white">{leaderboard[2].score}%</p>
                    <p className="text-white/80 text-sm mt-1">{leaderboard[2].time}</p>
                  </div>
                  <div className="bg-orange-500 h-20 rounded-b-2xl flex items-center justify-center border-4 border-t-0 border-orange-600">
                    <span className="text-3xl font-bold text-white">3rd</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#4a368f] to-[#9179E0] px-6 py-4">
              <h2 className="text-xl font-bold text-white">Complete Rankings</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Correct</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => (
                    <tr 
                      key={index}
                      className={`transition-colors hover:bg-gray-50 ${
                        index === 0 ? 'bg-yellow-50' :
                        index === 1 ? 'bg-gray-50' :
                        index === 2 ? 'bg-orange-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {index === 0 ? (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                              <Crown className="w-5 h-5 text-white" />
                            </div>
                          ) : index === 1 ? (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                              <Medal className="w-5 h-5 text-white" />
                            </div>
                          ) : index === 2 ? (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                              <Award className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{entry.name}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {entry.level}L
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-2xl font-bold text-[#9179E0]">{entry.score}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-700">{entry.correctAnswers}/20</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-600">{entry.time}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs text-gray-500">{entry.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowLeaderboard(false)}
              className="flex-1 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-[#9179E0] transition-all shadow-lg"
            >
              Back
            </button>
            <button
              onClick={() => {
                setShowLeaderboard(false);
                setShowNameForm(true);
                setQuizStarted(false);
                setQuizCompleted(false);
                setCurrentQuestion(0);
                setSelectedAnswers([]);
                setTimeRemaining(quizData.timeLimit);
                setScore(0);
                setUserRank(null);
              }}
              className="flex-1 py-4 bg-gradient-to-r from-[#9179E0] to-[#7E6BDB] text-white font-bold rounded-xl hover:shadow-2xl transition-all shadow-lg"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Registration Form
  if (showNameForm) {
    return (
      <section className="min-h-screen bg-gray-50 py-12 md:py-20 font-inter">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#9179E0]/10 border-2 border-[#9179E0]/30 px-5 py-2.5 rounded-xl mb-5">
              <Trophy className="w-5 h-5 text-[#9179E0]" />
              <span className="text-sm font-bold text-[#9179E0] tracking-wide">QUIZ COMPETITION</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#4a368f] mb-4">
              {quizData.title}
            </h1>
            <p className="text-gray-600 mb-2">{quizData.description}</p>
            <p className="text-sm text-gray-500">Created by: {quizData.createdBy}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Competition Details</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <Clock className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-600">{quizData.timeLimit / 60} min</p>
                <p className="text-sm text-gray-600">Time Limit</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <Target className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-600">{quizData.totalQuestions}</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <Users className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-purple-600">{quizData.participants}</p>
                <p className="text-sm text-gray-600">Participants</p>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                <Trophy className="w-6 h-6 text-yellow-600 mb-2" />
                <p className="text-sm font-bold text-yellow-600">{quizData.prize}</p>
                <p className="text-sm text-gray-600">Prize</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
                <select
                  value={studentLevel}
                  onChange={(e) => setStudentLevel(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none"
                >
                  <option value="">Select your level</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={!studentName.trim() || !studentLevel.trim()}
            className="w-full py-4 bg-[#9179E0] text-white font-bold rounded-xl hover:bg-[#7E6BDB] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg mb-4"
          >
            Start Quiz Competition
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-[#9179E0] transition-all"
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            View Leaderboard
          </button>

          <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 font-medium">
              <strong>⚠️ Important:</strong> Once started, the timer cannot be paused. Make sure you have a stable internet connection and won't be interrupted.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Quiz Completed - Results
  if (quizCompleted) {
    const correctCount = quizData.questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length;
    
    return (
      <section className="min-h-screen bg-gray-50 py-12 md:py-20 font-inter">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-[#9179E0]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#9179E0]/30">
              {percentage >= 80 ? (
                <Crown className="w-12 h-12 text-[#9179E0]" />
              ) : percentage >= 60 ? (
                <Medal className="w-12 h-12 text-[#9179E0]" />
              ) : (
                <Award className="w-12 h-12 text-[#9179E0]" />
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Quiz Completed!
            </h1>
            <p className="text-lg text-gray-600">Here are your results, {studentName}</p>
            
            {userRank && (
              <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 border-2 border-purple-300 px-5 py-3 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-bold text-purple-600">
                  You ranked #{userRank} on the leaderboard!
                </span>
              </div>
            )}
          </div>

          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 mb-6">
            <div className="text-center mb-8">
              <p className="text-6xl font-bold text-[#9179E0] mb-2">{percentage}%</p>
              <p className="text-xl text-gray-600">Final Score: {score} / {quizData.questions.length * 5} points</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{correctCount}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {quizData.questions.filter((q, i) => selectedAnswers[i] !== q.correctAnswer && selectedAnswers[i] !== undefined).length}
                </p>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-600">
                  {Math.floor((quizData.timeLimit - timeRemaining) / 60)}:{((quizData.timeLimit - timeRemaining) % 60).toString().padStart(2, '0')}
                </p>
                <p className="text-sm text-gray-600">Time Taken</p>
              </div>
            </div>

            {percentage >= 80 && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 text-center">
                <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <p className="font-bold text-lg text-gray-900 mb-2">🎉 Congratulations!</p>
                <p className="text-gray-700">You're eligible for the prize! The excos will contact you soon.</p>
              </div>
            )}

            {percentage >= 60 && percentage < 80 && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center">
                <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="font-bold text-lg text-gray-900 mb-2">Great Job!</p>
                <p className="text-gray-700">You performed well. Keep studying to reach the top!</p>
              </div>
            )}

            {percentage < 60 && (
              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6 text-center">
                <Target className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <p className="font-bold text-lg text-gray-900 mb-2">Keep Learning!</p>
                <p className="text-gray-700">Review the materials and try again. You've got this!</p>
              </div>
            )}
          </div>

          {/* Answer Review */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Answer Review</h3>
            <div className="space-y-4">
              {quizData.questions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer;
                return (
                  <div key={question.id} className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-start gap-3 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 mb-2">Q{index + 1}: {question.question}</p>
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>Your answer:</strong> {selectedAnswers[index] !== undefined ? question.options[selectedAnswers[index]] : 'Not answered'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-700">
                            <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowLeaderboard(true)}
              className="flex-1 py-4 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-4 bg-[#9179E0] text-white font-bold rounded-xl hover:bg-[#7E6BDB] transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Active Quiz
  const currentQ = quizData.questions[currentQuestion];
  const timePercentage = (timeRemaining / quizData.timeLimit) * 100;
  const isLowTime = timeRemaining < 60;

  return (
    <section className="min-h-screen bg-gray-50 py-8 md:py-12 font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header with Timer */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{studentName}</h2>
              <p className="text-sm text-gray-600">{studentLevel} Level</p>
            </div>
            <div className={`px-6 py-3 rounded-xl border-2 ${isLowTime ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'}`}>
              <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-600' : 'text-blue-600'} inline mr-2`} />
              <span className={`text-2xl font-bold ${isLowTime ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-bold text-gray-700">Progress: {answeredCount}/{quizData.questions.length}</span>
              <span className="text-[#9179E0] font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
              <div
                className="h-full bg-[#9179E0] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="px-4 py-2 bg-[#9179E0]/10 text-[#9179E0] text-sm font-bold rounded-xl border-2 border-[#9179E0]/30">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
            <span className="px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-xl border-2 border-green-300">
              {currentQ.points} Points
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all font-medium ${
                  selectedAnswers[currentQuestion] === index
                    ? 'bg-[#9179E0] text-white border-[#9179E0] shadow-lg'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#9179E0] hover:bg-gray-50'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-bold ${
                  selectedAnswers[currentQuestion] === index
                    ? 'bg-white text-[#9179E0]'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-[#9179E0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion === quizData.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-8 py-3 bg-[#9179E0] text-white font-bold rounded-xl hover:bg-[#7E6BDB] transition-all"
            >
              Next Question
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
          <p className="text-sm font-bold text-gray-700 mb-4">Quick Navigation</p>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {quizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-full aspect-square rounded-lg border-2 font-bold text-sm transition-all ${
                  selectedAnswers[index] !== undefined
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : currentQuestion === index
                    ? 'bg-[#9179E0] border-[#9179E0] text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-[#9179E0]'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizCompetition;