"use client"
import { useState } from "react";
import { BookOpen, Zap, Target, TrendingUp, ArrowRight, Sparkles, Brain, Award, Clock } from "lucide-react";
import Link from "next/link";

const FlashcardsLanding = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const sampleCards = [
    {
      category: "Social Work Theory",
      question: "What is Systems Theory?",
      answer: "Views individuals as part of interconnected systems (family, community, society)"
    },
    {
      category: "Ethics & Values",
      question: "Core Social Work Values?",
      answer: "Service, Social Justice, Dignity, Human Relationships, Integrity, Competence"
    },
    {
      category: "Clinical Practice",
      question: "Person-Centered Therapy?",
      answer: "Client-focused approach emphasizing empathy and unconditional positive regard"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white w-full font-inter">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          {/* Left Side - Preview Cards */}
          <div className="order-2 lg:order-1">
            <div className="space-y-4">
              {sampleCards.map((card, index) => (
                <div
                  key={index}
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
                    {/* Front */}
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

                    {/* Back */}
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
          </div>

          {/* Right Side - Benefits */}
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

            {/* CTA Button */}
            <Link
              href="/flashcards"
              className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-[#9179E0] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#7E6BDB] transition-all duration-300 hover:scale-105 mt-6"
            >
              <BookOpen className="w-5 h-5" />
              Start Studying Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Simple Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-10 px-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">500+</p>
            <p className="text-sm text-gray-600 font-medium">Flashcards</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#9179E0] mb-1">15+</p>
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

      <style jsx>{`
        @media (hover: none) and (pointer: coarse) {
          /* Mobile: cards flip on click/tap */
        }
      `}</style>
    </section>
  );
};

export default FlashcardsLanding;