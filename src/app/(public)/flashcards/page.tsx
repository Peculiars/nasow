"use client"
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen, CheckCircle, XCircle, Brain, Award, Clock, Star, Bookmark, BookmarkCheck, Zap } from "lucide-react";

// Types
interface Flashcard {
  _id: string;
  category: string;
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
  level: "100L" | "200L" | "300L" | "400L" | "500L" | "General";
  keyPoints: string[];
  relatedTopics: string[];
  explanation: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

type ActionType = "view" | "mastered" | "review";

const StudyFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);
  const [reviewCards, setReviewCards] = useState<string[]>([]);
  const [bookmarkedCards, setBookmarkedCards] = useState<string[]>([]);
  const [sessionStartTime] = useState<number>(Date.now());
  const [filterLevel, setFilterLevel] = useState<string>("All");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  const [stats, setStats] = useState<{ total: number }>({ total: 0 });

  useEffect(() => {
    fetchFlashcards();
  }, [filterLevel, filterDifficulty]);

  const fetchFlashcards = async (): Promise<void> => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterLevel !== "All") params.append("level", filterLevel);
      if (filterDifficulty !== "All") params.append("difficulty", filterDifficulty);

      const response = await fetch(`/api/flashcards?${params}`);
      const data: ApiResponse<Flashcard[]> = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        setFlashcards(data.data);
        setCurrentCard(0);
        setStats({ total: data.data.length });
      } else {
        setFlashcards([]);
        setStats({ total: 0 });
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const trackAction = async (cardId: string, action: ActionType): Promise<void> => {
    try {
      await fetch(`/api/flashcards/${cardId}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
    } catch (error) {
      console.error("Error tracking action:", error);
    }
  };

  useEffect(() => {
    if (flashcards.length > 0 && flashcards[currentCard]) {
      trackAction(flashcards[currentCard]._id, "view");
    }
  }, [currentCard, flashcards]);

  const handleFlip = (): void => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (): void => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev + 1) % flashcards.length);
    }, 200);
  };

  const handlePrevious = (): void => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 200);
  };

  const handleMastered = (): void => {
    const cardId = flashcards[currentCard]._id;
    if (!masteredCards.includes(cardId)) {
      setMasteredCards([...masteredCards, cardId]);
      trackAction(cardId, "mastered");
    }
    handleNext();
  };

  const handleReview = (): void => {
    const cardId = flashcards[currentCard]._id;
    if (!reviewCards.includes(cardId)) {
      setReviewCards([...reviewCards, cardId]);
      trackAction(cardId, "review");
    }
    handleNext();
  };

  const toggleBookmark = (): void => {
    const cardId = flashcards[currentCard]._id;
    if (bookmarkedCards.includes(cardId)) {
      setBookmarkedCards(bookmarkedCards.filter(id => id !== cardId));
    } else {
      setBookmarkedCards([...bookmarkedCards, cardId]);
    }
  };

  const handleReset = (): void => {
    setCurrentCard(0);
    setIsFlipped(false);
    setMasteredCards([]);
    setReviewCards([]);
    setFilterLevel("All");
    setFilterDifficulty("All");
  };

  const progress = flashcards.length > 0 ? ((currentCard + 1) / flashcards.length) * 100 : 0;
  const studyTime = Math.floor((Date.now() - sessionStartTime) / 60000);
  const accuracyRate = masteredCards.length + reviewCards.length > 0 
    ? Math.round((masteredCards.length / (masteredCards.length + reviewCards.length)) * 100)
    : 0;

  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty) {
      case "Easy": return "bg-green-100 text-green-700 border-green-300";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Hard": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-20 font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#9179E0] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading flashcards...</p>
        </div>
      </section>
    );
  }

  if (flashcards.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 py-20 font-inter">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Flashcards Available</h2>
          <p className="text-gray-600 mb-8">There are no flashcards matching your current filters. Try adjusting your selection.</p>
          <button
            onClick={() => { setFilterLevel("All"); setFilterDifficulty("All"); }}
            className="px-8 py-4 bg-[#9179E0] text-white rounded-xl font-bold hover:bg-[#7E6BDB] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </section>
    );
  }

  const currentFlashcard = flashcards[currentCard];
  const isBookmarked = bookmarkedCards.includes(currentFlashcard._id);

  return (
    <section className="min-h-screen bg-gray-50 py-12 md:py-20 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#9179E0]/10 border-2 border-[#9179E0]/30 px-5 py-2.5 rounded-xl mb-5">
            <Brain className="w-5 h-5 text-[#9179E0]" />
            <span className="text-sm font-bold text-[#9179E0] tracking-wide">EXAM PREPARATION MODE</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f] mb-4">
            Social Work Study Flashcards
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Comprehensive study materials to help you ace your exams with confidence
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            <span className="text-sm font-bold text-gray-700">Level:</span>
            {["All", "100L", "200L", "300L", "400L", "500L", "General"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                  filterLevel === level
                    ? "bg-[#9179E0] text-white border-[#9179E0] shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#9179E0]/50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-gray-700">Difficulty:</span>
            {["All", "Easy", "Medium", "Hard"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterDifficulty(filter)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                  filterDifficulty === filter
                    ? "bg-[#9179E0] text-white border-[#9179E0] shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#9179E0]/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-200 hover:border-[#9179E0]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-[#9179E0]/10 rounded-xl flex items-center justify-center border-2 border-[#9179E0]/20">
                <BookOpen className="w-6 h-6 text-[#9179E0]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{currentCard + 1}/{flashcards.length}</p>
            <p className="text-sm text-gray-600 font-medium">Progress</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-200 hover:border-green-400 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border-2 border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">{masteredCards.length}</p>
            <p className="text-sm text-gray-600 font-medium">Mastered</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-200 hover:border-orange-400 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border-2 border-orange-200">
                <XCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">{reviewCards.length}</p>
            <p className="text-sm text-gray-600 font-medium">To Review</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-200 hover:border-blue-400 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-200">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">{accuracyRate}%</p>
            <p className="text-sm text-gray-600 font-medium">Accuracy</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-200 hover:border-purple-400 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border-2 border-purple-200">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-1">{bookmarkedCards.length}</p>
            <p className="text-sm text-gray-600 font-medium">Bookmarked</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700">Session Progress</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-300">
                <Clock className="w-3 h-3 inline mr-1" />
                {studyTime} min
              </span>
            </div>
            <span className="text-sm font-bold text-[#9179E0]">{Math.round(progress)}%</span>
          </div>
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
            <div
              className="absolute h-full bg-[#9179E0] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="relative mb-10" style={{ perspective: "1500px" }}>
          <div
            className="relative w-full min-h-[500px] md:min-h-[600px] cursor-pointer transition-all duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
            }}
            onClick={handleFlip}
          >
            <div
              className="absolute inset-0 w-full bg-white rounded-3xl shadow-xl border-4 border-gray-200 p-8 md:p-12"
              style={{ 
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              <div className="flex flex-col h-full justify-between min-h-[450px]">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-4 py-2 bg-[#9179E0]/10 text-[#9179E0] text-sm font-bold rounded-xl border-2 border-[#9179E0]/30">
                        {currentFlashcard.category}
                      </span>
                      <span className={`px-4 py-2 text-sm font-bold rounded-xl border-2 ${getDifficultyColor(currentFlashcard.difficulty)}`}>
                        {currentFlashcard.difficulty}
                      </span>
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-bold rounded-xl border-2 border-blue-300">
                        {currentFlashcard.level}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-6 h-6 text-[#9179E0] fill-[#9179E0]" />
                      ) : (
                        <Bookmark className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question</span>
                      <span className="text-xs text-gray-400 font-semibold">
                        ({currentCard + 1}/{flashcards.length})
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {currentFlashcard.question}
                    </h3>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Key Points to Remember
                    </p>
                    <ul className="space-y-3">
                      {currentFlashcard.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="text-center pt-6 border-t-2 border-dashed border-gray-300">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#9179E0]/10 rounded-xl border-2 border-[#9179E0]/30">
                    <RotateCcw className="w-5 h-5 text-[#9179E0]" />
                    <p className="text-sm font-bold text-[#9179E0]">Click to reveal answer</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute inset-0 w-full bg-[#4a368f] rounded-3xl shadow-xl border-4 border-[#9179E0] p-8 md:p-12"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              <div className="flex flex-col h-full justify-between min-h-[450px]">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-2 bg-white/20 text-white text-sm font-bold rounded-xl border-2 border-white/40">
                      Answer
                    </span>
                    <span className="px-4 py-2 bg-white/20 text-white text-sm font-bold rounded-xl border-2 border-white/40">
                      {currentFlashcard.category}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-xl md:text-3xl text-white leading-relaxed font-medium mb-6">
                      {currentFlashcard.answer}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 border-2 border-white/30 mb-6">
                    <p className="text-xs font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Exam Tip
                    </p>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {currentFlashcard.explanation}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 border-2 border-white/30">
                    <p className="text-xs font-bold text-white uppercase tracking-wide mb-3">
                      Related Topics for Further Study:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentFlashcard.relatedTopics.map((topic, index) => (
                        <span key={index} className="px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-lg border border-white/30">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-center pt-6 border-t-2 border-dashed border-white/30">
                  <p className="text-sm font-bold text-white/90">Click to return to question</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className="flex items-center gap-2 px-6 py-4 bg-white rounded-xl shadow-md border-2 border-gray-300 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#9179E0] hover:shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
            <span className="font-bold text-gray-700">Previous</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-4 bg-gray-100 rounded-xl border-2 border-gray-300 hover:bg-gray-200 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
            <span className="font-bold text-gray-600">Reset</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentCard === flashcards.length - 1}
            className="flex items-center gap-2 px-6 py-4 bg-white rounded-xl shadow-md border-2 border-gray-300 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#9179E0] hover:shadow-lg"
          >
            <span className="font-bold text-gray-700">Next</span>
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
          <button
            onClick={handleReview}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-white border-3 border-orange-300 rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <XCircle className="w-6 h-6 text-orange-600" />
            <span className="font-bold text-orange-600">Need More Review</span>
          </button>
          
          <button
            onClick={handleMastered}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-[#9179E0] border-3 border-[#7E6BDB] rounded-2xl hover:bg-[#7E6BDB] transition-all duration-300 text-white shadow-lg hover:shadow-xl"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-bold">I've Mastered This!</span>
          </button>
        </div>

        {currentCard === flashcards.length - 1 && (
          <div className="mt-12 text-center p-10 bg-white rounded-3xl shadow-xl border-4 border-[#9179E0]">
            <div className="w-20 h-20 bg-[#9179E0]/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-[#9179E0]/30">
              <Award className="w-10 h-10 text-[#9179E0]" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Session Complete! 🎉
            </h3>
            <div className="grid grid-cols-3 gap-6 mb-6 max-w-md mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{masteredCards.length}</p>
                <p className="text-sm text-gray-600 font-medium">Mastered</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{reviewCards.length}</p>
                <p className="text-sm text-gray-600 font-medium">To Review</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#9179E0]">{accuracyRate}%</p>
                <p className="text-sm text-gray-600 font-medium">Accuracy</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-10 py-4 bg-[#9179E0] text-white rounded-xl font-bold hover:bg-[#7E6BDB] transition-all shadow-lg border-2 border-[#7E6BDB]"
            >
              Start New Study Session
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyFlashcards;