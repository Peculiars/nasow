"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Star, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { showSuccess, showError, showLoading, dismissToast } from "@/src/lib/toast";

interface Nasowite {
  _id: string;
  name: string;
  level: string;
  position: string;
  image: string;
  quote: string;
  socials: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    email: string;
    phone?: string;
  };
  achievements: string[];
  isCurrent: boolean;
  weekStartDate: string;
  weekEndDate: string;
}

const AdminNasowite = () => {
  const [nasowites, setNasowites] = useState<Nasowite[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    position: "",
    image: null as File | null,
    quote: "",
    email: "",
    phone: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    achievements: [""],
    isCurrent: false,
    weekStartDate: "",
    weekEndDate: "",
  });

  useEffect(() => {
    fetchNasowites();
  }, []);

  const fetchNasowites = async () => {
    try {
      const res = await fetch("/api/nasowites");
      const data = await res.json();
      if (data.success) {
        setNasowites(data.data);
      }
    } catch (error) {
      showError("Failed to load nasowites");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  const addAchievement = () => {
    setFormData({ ...formData, achievements: [...formData.achievements, ""] });
  };

  const removeAchievement = (index: number) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: newAchievements });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      level: "",
      position: "",
      image: null,
      quote: "",
      email: "",
      phone: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      achievements: [""],
      isCurrent: false,
      weekStartDate: "",
      weekEndDate: "",
    });
    setImagePreview(null);
    setEditingId(null);
  };

  const handleEdit = (nasowite: Nasowite) => {
    setFormData({
      name: nasowite.name,
      level: nasowite.level,
      position: nasowite.position,
      image: null,
      quote: nasowite.quote,
      email: nasowite.socials.email,
      phone: nasowite.socials.phone || "",
      instagram: nasowite.socials.instagram || "",
      twitter: nasowite.socials.twitter || "",
      linkedin: nasowite.socials.linkedin || "",
      achievements: nasowite.achievements,
      isCurrent: nasowite.isCurrent,
      weekStartDate: nasowite.weekStartDate.split('T')[0],
      weekEndDate: nasowite.weekEndDate.split('T')[0],
    });
    setImagePreview(nasowite.image);
    setEditingId(nasowite._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.weekStartDate || !formData.weekEndDate) {
      showError("Please fill all required fields");
      return;
    }
    
    if (!formData.image && !editingId) {
      showError("Please upload an image");
      return;
    }

    const toastId = showLoading(editingId ? "Updating..." : "Creating...");
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("level", formData.level);
      data.append("position", formData.position);
      data.append("quote", formData.quote);
      data.append("isCurrent", String(formData.isCurrent));
      data.append("weekStartDate", formData.weekStartDate);
      data.append("weekEndDate", formData.weekEndDate);
      
      const socials = {
        email: formData.email,
        phone: formData.phone,
        instagram: formData.instagram,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
      };
      data.append("socials", JSON.stringify(socials));
      
      const achievements = formData.achievements.filter(a => a.trim() !== "");
      data.append("achievements", JSON.stringify(achievements));

      if (formData.image) {
        data.append("image", formData.image);
      }

      const url = editingId ? `/api/nasowites?id=${editingId}` : "/api/nasowites";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: data });
      const result = await res.json();

      if (result.success) {
        dismissToast(toastId);
        showSuccess(editingId ? "Updated successfully" : "Created successfully");
        fetchNasowites();
        setIsModalOpen(false);
        resetForm();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      dismissToast(toastId);
      showError(error.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this nasowite?")) return;

    const toastId = showLoading("Deleting...");
    try {
      const res = await fetch(`/api/nasowites?id=${id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        dismissToast(toastId);
        showSuccess("Deleted successfully");
        fetchNasowites();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      dismissToast(toastId);
      showError(error.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter">
      <div className="w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nasowite of the Week</h1>
            <p className="text-gray-600 mt-1">Manage featured nasowites</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#9179E0] text-white px-6 py-3 rounded-xl hover:bg-[#7d64c9] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Nasowite
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {nasowites.map((nasowite) => (
            <div key={nasowite._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image src={nasowite.image} alt={nasowite.name} fill className="object-cover" />
                {nasowite.isCurrent && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-white" />
                    Current
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{nasowite.name}</h3>
                <p className="text-[#9179E0] font-semibold text-sm mb-1">{nasowite.position}</p>
                <p className="text-gray-600 text-sm mb-3">{nasowite.level}</p>
                <p className="text-gray-700 text-sm italic mb-4 line-clamp-2">"{nasowite.quote}"</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(nasowite.weekStartDate).toLocaleDateString()} - {new Date(nasowite.weekEndDate).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(nasowite)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(nasowite._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Edit Nasowite" : "Add New Nasowite"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image *</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-[#9179E0] transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload image</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Level *</label>
                    <input
                      type="text"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      placeholder="e.g., 400 Level"
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g., President, NASOWS UNILAG"
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quote *</label>
                  <textarea
                    placeholder="Enter quote"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Week Start Date *</label>
                    <input
                      type="date"
                      value={formData.weekStartDate}
                      onChange={(e) => setFormData({ ...formData, weekStartDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Week End Date *</label>
                    <input
                      type="date"
                      value={formData.weekEndDate}
                      onChange={(e) => setFormData({ ...formData, weekEndDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="@username"
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter</label>
                      <input
                        type="text"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="@username"
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="username"
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="text-[#9179E0] text-sm font-semibold hover:underline"
                    >
                      + Add Achievement
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => handleAchievementChange(index, e.target.value)}
                          placeholder="Enter achievement"
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9179E0]"
                        />
                        {formData.achievements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t pt-4">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                    className="w-5 h-5 text-[#9179E0] border-gray-300 rounded focus:ring-[#9179E0]"
                  />
                  <label htmlFor="isCurrent" className="text-sm font-semibold text-gray-700">
                    Set as current Nasowite of the Week
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-[#9179E0] text-white rounded-xl hover:bg-[#7d64c9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {editingId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editingId ? "Update Nasowite" : "Create Nasowite"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNasowite;