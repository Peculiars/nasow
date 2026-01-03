"use client"
import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Eye, BookOpen, Brain, X, CheckCircle, Award } from "lucide-react";

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
  tags: string[];
  semester: "1st" | "2nd" | "Both";
  courseCode: string;
  viewCount: number;
  masteredCount: number;
  reviewCount: number;
}

interface FormData {
  category: string;
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
  level: "100L" | "200L" | "300L" | "400L" | "500L" | "General";
  keyPoints: string[];
  relatedTopics: string[];
  explanation: string;
  tags: string[];
  semester: "1st" | "2nd" | "Both";
  courseCode: string;
}

interface Stats {
  total: number;
  byLevel: Array<{ _id: string; count: number }>;
  byDifficulty: Array<{ _id: string; count: number }>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const AdminFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterLevel, setFilterLevel] = useState<string>("All");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  const [stats, setStats] = useState<Stats>({ total: 0, byLevel: [], byDifficulty: [] });

  const [formData, setFormData] = useState<FormData>({
    category: "",
    question: "",
    answer: "",
    difficulty: "Medium",
    level: "General",
    keyPoints: ["", ""],
    relatedTopics: [""],
    explanation: "",
    tags: [],
    semester: "Both",
    courseCode: ""
  });

  const levels = ["All", "100L", "200L", "300L", "400L", "500L", "General"] as const;
  const difficulties = ["All", "Easy", "Medium", "Hard"] as const;
  const semesters = ["1st", "2nd", "Both"] as const;

  useEffect(() => {
    fetchFlashcards();
    fetchStats();
  }, [filterLevel, filterDifficulty]);

  const fetchFlashcards = async (): Promise<void> => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterLevel !== "All") params.append("level", filterLevel);
      if (filterDifficulty !== "All") params.append("difficulty", filterDifficulty);

      const response = await fetch(`/api/flashcards?${params}`);
      const data: ApiResponse<Flashcard[]> = await response.json();
      
      if (data.success && data.data) {
        setFlashcards(data.data);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (): Promise<void> => {
    try {
      const response = await fetch("/api/flashcards/stats");
      const data: ApiResponse<Stats> = await response.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!formData.category || !formData.question || !formData.answer || !formData.explanation) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.keyPoints.filter(kp => kp.trim()).length < 2) {
      alert("Please provide at least 2 key points");
      return;
    }

    if (formData.relatedTopics.filter(rt => rt.trim()).length < 1) {
      alert("Please provide at least 1 related topic");
      return;
    }
    
    try {
      const url = editingCard 
        ? `/api/flashcards/${editingCard._id}`
        : "/api/flashcards";
      
      const method = editingCard ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          keyPoints: formData.keyPoints.filter(kp => kp.trim()),
          relatedTopics: formData.relatedTopics.filter(rt => rt.trim())
        })
      });

      const data: ApiResponse<Flashcard> = await response.json();

      if (data.success) {
        setShowModal(false);
        resetForm();
        fetchFlashcards();
        fetchStats();
      } else {
        alert(data.error || "Failed to save flashcard");
      }
    } catch (error) {
      console.error("Error saving flashcard:", error);
      alert("An error occurred while saving");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Are you sure you want to delete this flashcard?")) return;

    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "DELETE"
      });

      const data: ApiResponse<void> = await response.json();

      if (data.success) {
        fetchFlashcards();
        fetchStats();
      } else {
        alert(data.error || "Failed to delete flashcard");
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      alert("An error occurred while deleting");
    }
  };

  const handleEdit = (card: Flashcard): void => {
    setEditingCard(card);
    setFormData({
      category: card.category,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      level: card.level,
      keyPoints: card.keyPoints,
      relatedTopics: card.relatedTopics,
      explanation: card.explanation,
      tags: card.tags || [],
      semester: card.semester || "Both",
      courseCode: card.courseCode || ""
    });
    setShowModal(true);
  };

  const resetForm = (): void => {
    setFormData({
      category: "",
      question: "",
      answer: "",
      difficulty: "Medium",
      level: "General",
      keyPoints: ["", ""],
      relatedTopics: [""],
      explanation: "",
      tags: [],
      semester: "Both",
      courseCode: ""
    });
    setEditingCard(null);
  };

  const addKeyPoint = (): void => {
    if (formData.keyPoints.length < 5) {
      setFormData({ ...formData, keyPoints: [...formData.keyPoints, ""] });
    }
  };

  const removeKeyPoint = (index: number): void => {
    if (formData.keyPoints.length > 2) {
      setFormData({
        ...formData,
        keyPoints: formData.keyPoints.filter((_, i) => i !== index)
      });
    }
  };

  const addRelatedTopic = (): void => {
    if (formData.relatedTopics.length < 5) {
      setFormData({ ...formData, relatedTopics: [...formData.relatedTopics, ""] });
    }
  };

  const removeRelatedTopic = (index: number): void => {
    if (formData.relatedTopics.length > 1) {
      setFormData({
        ...formData,
        relatedTopics: formData.relatedTopics.filter((_, i) => i !== index)
      });
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      "100L": "bg-blue-100 text-blue-700",
      "200L": "bg-purple-100 text-purple-700",
      "300L": "bg-pink-100 text-pink-700",
      "400L": "bg-orange-100 text-orange-700",
      "500L": "bg-red-100 text-red-700",
      "General": "bg-gray-100 text-gray-700"
    };
    return colors[level] || colors.General;
  };

  const filteredFlashcards = flashcards.filter(card =>
    card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4a368f] mb-2">Flashcard Management</h1>
          <p className="text-gray-600">Create and manage study flashcards for students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-[#9179E0]" />
              <span className="text-3xl font-bold text-[#9179E0]">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Flashcards</p>
          </div>

          {stats.byLevel.slice(0, 3).map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-8 h-8 text-blue-500" />
                <span className="text-3xl font-bold text-blue-500">{item.count}</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">{item._id} Level</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none"
                />
              </div>
            </div>

            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none font-medium"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9179E0] focus:outline-none font-medium"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>

            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-[#9179E0] text-white rounded-xl font-bold hover:bg-[#7E6BDB] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Flashcard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#9179E0] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading flashcards...</p>
          </div>
        ) : filteredFlashcards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No flashcards found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlashcards.map((card) => (
              <div key={card._id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-[#9179E0] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getLevelColor(card.level)}`}>
                      {card.level}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getDifficultyColor(card.difficulty)}`}>
                      {card.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(card)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(card._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{card.question}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{card.answer}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {card.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    {card.masteredCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-orange-600" />
                    {card.reviewCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCard ? "Edit Flashcard" : "Create New Flashcard"}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as FormData['level'] })}
                    className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-xl focus:border-[#9179E0] focus:outline-none"
                  >
                    {levels.filter(l => l !== "All").map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as FormData['difficulty'] })}
                    className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-xl focus:border-[#9179E0] focus:outline-none"
                  >
                    {difficulties.filter(d => d !== "All").map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-xl focus:border-[#9179E0] focus:outline-none"
                  placeholder="e.g., Social Work Theory"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Question *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-xl focus:border-[#9179E0] focus:outline-none"
                  rows={3}
                  placeholder="Enter the question..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Answer *</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-xl focus:border-[#9179E0] focus:outline-none"
                  rows={4}
                  placeholder="Enter the answer..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Key Points * (2-5 items)</label>
                {formData.keyPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...formData.keyPoints];
                        newPoints[index] = e.target.value;
                        setFormData({ ...formData, keyPoints: newPoints });
                      }}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-xl focus:border-[#9179E0] focus:outline-none"
                      placeholder={`Key point ${index + 1}`}
                    />
                    {formData.keyPoints.length > 2 && (
                      <button onClick={() => removeKeyPoint(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.keyPoints.length < 5 && (
                  <button onClick={addKeyPoint} className="text-sm text-[#9179E0] font-bold hover:underline">
                    + Add Key Point
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Related Topics * (1-5 items)</label>
                {formData.relatedTopics.map((topic, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => {
                        const newTopics = [...formData.relatedTopics];
                        newTopics[index] = e.target.value;
                        setFormData({ ...formData, relatedTopics: newTopics });
                      }}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-xl focus:border-[#9179E0] focus:outline-none"
                      placeholder={`Related topic ${index + 1}`}
                    />
                    {formData.relatedTopics.length > 1 && (
                      <button onClick={() => removeRelatedTopic(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.relatedTopics.length < 5 && (
                  <button onClick={addRelatedTopic} className="text-sm text-[#9179E0] font-bold hover:underline">
                    + Add Related Topic
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Exam Tip/Explanation *</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-xl focus:border-[#9179E0] focus:outline-none"
                  rows={3}
                  placeholder="Study tip or explanation..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value as FormData['semester'] })}
                    className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-xl focus:border-[#9179E0] focus:outline-none"
                  >
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Course Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-xl focus:border-[#9179E0] focus:outline-none"
                    placeholder="e.g., SWK101"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-[#9179E0] text-white rounded-xl font-bold hover:bg-[#7E6BDB] transition-colors"
                >
                  {editingCard ? "Update Flashcard" : "Create Flashcard"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFlashcards;