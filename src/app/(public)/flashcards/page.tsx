"use client"
import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen, CheckCircle, XCircle, Sparkles, TrendingUp, Clock, Brain } from "lucide-react";

const flashcardsData = [
  {
    id: 1,
    category: "Social Work Theory",
    question: "What is the Systems Theory in Social Work?",
    answer: "Systems Theory views individuals as part of interconnected systems (family, community, society). It emphasizes understanding how these systems interact and influence behavior, focusing on relationships rather than isolated individuals.",
    difficulty: "Medium"
  },
  {
    id: 2,
    category: "Social Work Ethics",
    question: "What are the core values of social work?",
    answer: "Service, Social Justice, Dignity and Worth of the Person, Importance of Human Relationships, Integrity, and Competence. These guide ethical decision-making and professional conduct.",
    difficulty: "Easy"
  },
  {
    id: 3,
    category: "Community Practice",
    question: "Define Community Organizing",
    answer: "Community organizing is a process where people who live in proximity come together to act in their shared self-interest, building power to create social change and address community issues collectively.",
    difficulty: "Medium"
  },
  {
    id: 4,
    category: "Clinical Practice",
    question: "What is Person-Centered Therapy?",
    answer: "Developed by Carl Rogers, it emphasizes the client's capacity for self-direction and understanding their own development. Core conditions include empathy, unconditional positive regard, and congruence.",
    difficulty: "Hard"
  },
  {
    id: 5,
    category: "Research Methods",
    question: "Difference between Qualitative and Quantitative Research?",
    answer: "Qualitative explores meanings, experiences, and perspectives through interviews and observations. Quantitative measures variables numerically through surveys and experiments, focusing on statistical analysis.",
    difficulty: "Medium"
  }
];

const StudyFlashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);
  const [reviewCards, setReviewCards] = useState<number[]>([]);
  const [sessionStartTime] = useState(Date.now());

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev + 1) % flashcardsData.length);
    }, 200);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length);
    }, 200);
  };

  const handleMastered = () => {
    const cardId = flashcardsData[currentCard].id;
    if (!masteredCards.includes(cardId)) {
      setMasteredCards([...masteredCards, cardId]);
    }
    handleNext();
  };

  const handleReview = () => {
    const cardId = flashcardsData[currentCard].id;
    if (!reviewCards.includes(cardId)) {
      setReviewCards([...reviewCards, cardId]);
    }
    handleNext();
  };

  const handleReset = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setMasteredCards([]);
    setReviewCards([]);
  };

  const progress = ((currentCard + 1) / flashcardsData.length) * 100;
  const studyTime = Math.floor((Date.now() - sessionStartTime) / 60000);

  const getDifficultyColor = (difficulty:any) => {
    switch(difficulty) {
      case "Easy": return "bg-green-100 text-green-700 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Hard": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <section className="min-h-screen bg-white py-12 md:py-20 font-inter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#9179E0]/10 border border-[#9179E0]/20 px-4 py-2 rounded-full mb-4">
            <Brain className="w-4 h-4 text-[#9179E0]" />
            <span className="text-xs md:text-sm font-bold text-[#9179E0] tracking-wide">STUDY MODE</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f] mb-3">
            Master Social Work Concepts
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive flashcards designed to help you excel in your studies
          </p>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:border-[#9179E0]/30 transition-all">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#9179E0]/10 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-0">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#9179E0]" />
              </div>
              <span className="hidden md:block text-xs font-semibold text-gray-500 uppercase">Progress</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{currentCard + 1}/{flashcardsData.length}</p>
            <p className="text-xs md:text-sm text-gray-600">Cards Reviewed</p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:border-green-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-0">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <span className="hidden md:block text-xs font-semibold text-gray-500 uppercase">Mastered</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{masteredCards.length}</p>
            <p className="text-xs md:text-sm text-gray-600">Cards Learned</p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:border-orange-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <span className="hidden md:block text-xs font-semibold text-gray-500 uppercase">Review</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{reviewCards.length}</p>
            <p className="text-xs md:text-sm text-gray-600">Need Practice</p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:border-blue-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <span className="hidden md:block text-xs font-semibold text-gray-500 uppercase">Time</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{studyTime}</p>
            <p className="text-xs md:text-sm text-gray-600">Minutes Studied</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <span className="text-xs md:text-sm font-semibold text-gray-700">Session Progress</span>
            <span className="text-xs md:text-sm font-bold text-[#9179E0]">{Math.round(progress)}%</span>
          </div>
          <div className="relative w-full h-2 md:h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-[#9179E0] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard - More Compact on Mobile */}
        <div className="relative mb-8 md:mb-10" style={{ perspective: "1500px" }}>
          <div
            className="relative w-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] cursor-pointer transition-all duration-700 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
            }}
            onClick={handleFlip}
          >
            {/* Front Side */}
            <div
              className="absolute inset-0 w-full bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border border-gray-100 md:border-2 p-6 sm:p-8 md:p-12"
              style={{ 
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              <div className="flex flex-col h-full justify-between min-h-[350px] sm:min-h-[400px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6 md:mb-8">
                    <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#9179E0]/10 text-[#9179E0] text-xs md:text-sm font-bold rounded-lg md:rounded-xl border border-[#9179E0]/20">
                      {flashcardsData[currentCard].category}
                    </span>
                    <span className={`px-3 py-1.5 md:px-4 md:py-2 text-xs font-bold rounded-lg md:rounded-xl border ${getDifficultyColor(flashcardsData[currentCard].difficulty)}`}>
                      {flashcardsData[currentCard].difficulty}
                    </span>
                  </div>
                  
                  <div className="mb-4 md:mb-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3 block">Question</span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {flashcardsData[currentCard].question}
                    </h3>
                  </div>
                </div>
                
                <div className="text-center pt-6 md:pt-8 border-t-2 border-dashed border-gray-200">
                  <div className="inline-flex flex-col items-center gap-2 md:gap-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-[#9179E0]/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <RotateCcw className="w-6 h-6 md:w-7 md:h-7 text-[#9179E0] animate-pulse" />
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-gray-500">Tap to reveal answer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div
              className="absolute inset-0 w-full bg-[#9179E0] rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 sm:p-8 md:p-12"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              <div className="flex flex-col h-full justify-between min-h-[350px] sm:min-h-[400px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6 md:mb-8">
                    <span className="px-3 py-1.5 md:px-4 md:py-2 bg-white/20 text-white text-xs md:text-sm font-bold rounded-lg md:rounded-xl border border-white/30 backdrop-blur-sm">
                      {flashcardsData[currentCard].category}
                    </span>
                    <span className="px-3 py-1.5 md:px-4 md:py-2 bg-white/20 text-white text-xs font-bold rounded-lg md:rounded-xl border border-white/30 backdrop-blur-sm">
                      Answer
                    </span>
                  </div>
                  
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white leading-relaxed font-medium">
                    {flashcardsData[currentCard].answer}
                  </p>
                </div>
                
                <div className="text-center pt-6 md:pt-8 border-t-2 border-dashed border-white/30">
                  <p className="text-xs md:text-sm font-semibold text-white/80">Tap to flip back</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Compact on Mobile */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            <span className="hidden sm:inline font-semibold text-gray-700 text-sm md:text-base">Previous</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-gray-50 rounded-xl md:rounded-2xl hover:bg-gray-100 border border-gray-200 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            <span className="hidden sm:inline font-semibold text-gray-600 text-sm md:text-base">Reset</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentCard === flashcardsData.length - 1}
            className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
          >
            <span className="hidden sm:inline font-semibold text-gray-700 text-sm md:text-base">Next</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </button>
        </div>

        {/* Action Buttons - Stack on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto">
          <button
            onClick={handleReview}
            className="flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-4 md:py-5 bg-white border-2 border-orange-200 rounded-xl md:rounded-2xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 hover:scale-105"
          >
            <XCircle className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            <span className="font-bold text-orange-600 text-sm md:text-base">Need Review</span>
          </button>
          
          <button
            onClick={handleMastered}
            className="flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-4 md:py-5 bg-[#9179E0] rounded-xl md:rounded-2xl hover:bg-[#7E6BDB] transition-all duration-300 text-white shadow-lg hover:shadow-xl hover:scale-105"
          >
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-bold text-sm md:text-base">I Got This!</span>
          </button>
        </div>

        {/* Completion Message */}
        {currentCard === flashcardsData.length - 1 && (
          <div className="mt-10 md:mt-12 text-center p-8 md:p-10 bg-white rounded-2xl md:rounded-3xl shadow-xl border-2 border-[#9179E0]/20">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#9179E0]/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#9179E0]" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Excellent Work! 🎉
            </h3>
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-md mx-auto">
              You've completed all cards in this deck. Ready to reinforce your learning?
            </p>
            <button
              onClick={handleReset}
              className="px-8 md:px-10 py-3 md:py-4 bg-[#9179E0] text-white rounded-xl font-bold hover:bg-[#7E6BDB] transition-all hover:scale-105 shadow-lg text-sm md:text-base"
            >
              Start New Session
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyFlashcards;