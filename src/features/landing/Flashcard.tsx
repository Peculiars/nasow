"use client"
import { useState, useEffect } from "react";
import { BookOpen, Target, Brain, Award, ArrowRight } from "lucide-react";

// Types
interface SampleCard {
  _id: string;
  category: string;
  question: string;
  answer: string;
}

interface Stats {
  total: number;
  byLevel: Array<{ _id: string; count: number }>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const FlashcardsLanding = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [sampleCards, setSampleCards] = useState<SampleCard[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, byLevel: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSampleCards();
    fetchStats();
  }, []);

  const fetchSampleCards = async (): Promise<void> => {
    try {
      const response = await fetch('/api/flashcards?limit=3&sort=-createdAt');
      const data: ApiResponse<SampleCard[]> = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        setSampleCards(data.data.slice(0, 3));
      } else {
        setSampleCards([
          {
            _id: '1',
            category: "Sample Category",
            question: "Sample Question?",
            answer: "Sample answer text"
          },
          {
            _id: '2',
            category: "Sample Category 2",
            question: "Another Sample Question?",
            answer: "Another sample answer"
          },
          {
            _id: '3',
            category: "Sample Category 3",
            question: "Third Sample Question?",
            answer: "Third sample answer"
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching sample cards:", error);
      setSampleCards([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (): Promise<void> => {
    try {
      const response = await fetch('/api/flashcards/stats');
      const data: ApiResponse<Stats> = await response.json();
      
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getTotalFlashcards = (): number => {
    return stats.total || 500;
  };

  const getTotalTopics = (): number => {
    return stats.byLevel?.length || 15;
  };

  return (
    <section className="py-16 md:py-24 bg-white w-full font-inter">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center md:text-left mb-12">
          <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3 mb-4">
            <div className="hidden md:block size-6 bg-green-500" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4a368f]">
              Study with Flashcards
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto md:mx-0">
            Master Social Work concepts with interactive flashcards designed for quick learning and better retention
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-[#9179E0] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : sampleCards.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-gray-200">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No flashcards available yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sampleCards.map((card, index) => (
                  <div
                    key={card._id}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => setHoveredCard(hoveredCard === index ? null : index)}
                    className="group relative h-40 md:h-44 cursor-pointer"
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className={`relative w-full h-full transition-all duration-500`}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: hoveredCard === index ? "rotateY(180deg)" : "rotateY(0deg)"
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-white rounded-2xl border-2 border-gray-200 p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div>
                          <span className="inline-block px-3 py-1 bg-[#9179E0]/10 text-[#9179E0] text-xs font-bold rounded-lg mb-3">
                            {card.category}
                          </span>
                          <h4 className="text-lg md:text-xl font-bold text-gray-900">
                            {card.question}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          {hoveredCard === index ? "" : "Click to reveal answer"}
                        </p>
                      </div>

                      <div
                        className="absolute inset-0 bg-[#9179E0] rounded-2xl p-6 flex items-center justify-center shadow-xl"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)"
                        }}
                      >
                        <p className="text-white text-base md:text-lg font-medium text-center leading-relaxed">
                          {card.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="flex items-start gap-4 p-5 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-12 h-12 bg-[#9179E0] rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Quick Learning
                </h3>
                <p className="text-gray-600 text-sm">
                  Master key concepts in minutes with bite-sized, focused flashcards covering all major topics
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-green-50 rounded-xl border border-green-100">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Track Your Progress
                </h3>
                <p className="text-gray-600 text-sm">
                  Monitor which cards you've mastered and which need more review with our smart tracking system
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Exam Ready
                </h3>
                <p className="text-gray-600 text-sm">
                  Study effectively for your tests with flashcards organized by course topics and difficulty levels
                </p>
              </div>
            </div>

            <a
              href="/flashcards"
              className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-[#9179E0] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#7E6BDB] transition-all duration-300 hover:scale-105 mt-6"
            >
              <BookOpen className="w-5 h-5" />
              Start Studying Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-10 px-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">{getTotalFlashcards()}+</p>
            <p className="text-sm text-gray-600 font-medium">Flashcards</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">{getTotalTopics()}+</p>
            <p className="text-sm text-gray-600 font-medium">Topics</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">1000+</p>
            <p className="text-sm text-gray-600 font-medium">Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">24/7</p>
            <p className="text-sm text-gray-600 font-medium">Available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashcardsLanding;