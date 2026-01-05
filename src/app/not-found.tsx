"use client"
import { useState, useEffect } from "react";
import { Home, ArrowLeft, MapPin, Clock } from "lucide-react";

const NotFoundPage = () => {
  const funMessages = [
    {
      title: "Omo! You don lost 😂",
      subtitle: "This page went to buy suya and never returned",
      emoji: "🌭"
    },
    {
      title: "Ah Ah! Wetin you dey find? 🤔",
      subtitle: "Even siri can't locate this page",
      emoji: "📱"
    },
    {
      title: "This page don comot o! 🏃‍♂️",
      subtitle: "Maybe e go library go read",
      emoji: "📚"
    },
    {
      title: "Bros/Sis, you lost pass GPS 🗺️",
      subtitle: "This page no dey exist at all",
      emoji: "🧭"
    },
    {
      title: "404: Page Missing! 😭",
      subtitle: "Last seen: Never. Current location: Unknown",
      emoji: "👻"
    },
    {
      title: "Chai! Wrong turn 🚶‍♀️",
      subtitle: "You enter one-way wey no get exit",
      emoji: "🚧"
    }
  ];

  const [message, setMessage] = useState(funMessages[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          <div className="text-8xl mb-8 animate-bounce">
            {funMessages[0].emoji}
          </div>
          <div className="mb-6">
            <div className="text-9xl font-black text-purple-600 mb-4">
              404
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {funMessages[0].title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {funMessages[0].subtitle}
            </p>
          </div>
          <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Current Location:</p>
                <p className="text-gray-600">The middle of nowhere</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Time Wasted:</p>
                <p className="text-gray-600">Could have watched 2 TikToks by now</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-8">
            <p className="text-purple-900 font-medium">
              💡 <span className="font-bold">Pro tip:</span> Try going back or just head home. No shame in admitting you're lost! 😄
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
              <Home className="w-5 h-5" />
              Take Me Home
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-bold rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
          <div className="mt-12 text-gray-500 text-sm">
            <p>NASOWS UNILAG - Where even our 404 pages get you 😂</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center">
        
        {/* Big Emoji */}
        <div className="text-8xl mb-8 animate-bounce">
          {message.emoji}
        </div>

        {/* 404 Text */}
        <div className="mb-6">
          <div className="text-9xl font-black text-purple-600 mb-4">
            404
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {message.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {message.subtitle}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-start gap-3 mb-3">
            <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Current Location:</p>
              <p className="text-gray-600">The middle of nowhere</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Time Wasted:</p>
              <p className="text-gray-600">Could have watched 2 TikToks by now</p>
            </div>
          </div>
        </div>

        {/* Suggestion */}
        <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 mb-8">
          <p className="text-purple-900 font-medium">
            💡 <span className="font-bold">Pro tip:</span> Try going back or just head home. No shame in admitting you're lost! 😄
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
            <Home className="w-5 h-5" />
            Take Me Home
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-bold rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>NASOWS UNILAG - Where even our 404 pages get you 😂</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;