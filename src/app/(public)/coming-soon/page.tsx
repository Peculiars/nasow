"use client"
import { useState } from "react";
import { Construction, ArrowLeft, Mail, CheckCircle, BookOpen, Trophy, Users, Calendar, Home, Sparkles } from "lucide-react";

const FeatureUnavailablePage = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = () => {
    if (email) {
      console.log('Email subscribed:', email);
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  const availableFeatures = [
    {
      icon: BookOpen,
      title: "Study Resources",
      description: "Access comprehensive course materials and study guides",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Trophy,
      title: "Quiz Competitions",
      description: "Compete with peers in exciting challenges",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Student Community",
      description: "Connect and collaborate with NASOWS members",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Calendar,
      title: "Events & Updates",
      description: "Stay informed about upcoming activities",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/3 right-1/4 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white transition-all">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-4xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-amber-500/30">
                <Construction className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-semibold text-amber-100">UNDER DEVELOPMENT</span>
              </div>

              <div className="mb-8">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-30"></div>
                  <Construction className="w-24 h-24 text-purple-300 relative" />
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Feature Not Available
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-2">
                    Yet
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  We're working hard to bring you this feature. In the meantime, check out the other amazing features available to you.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeatureUnavailablePage;