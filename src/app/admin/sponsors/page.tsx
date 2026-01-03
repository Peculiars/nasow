'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Award } from 'lucide-react';
import Image from 'next/image';
import SponsorForm from '@/src/features/admin/sponsor/SponsorForm';

interface Sponsor {
  _id: string;
  name: string;
  logo: {
    url: string;
    publicId: string;
  };
  description: string;
  website: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>('all');

  const fetchSponsors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sponsors');
      const result = await response.json();
      
      if (result.success) {
        setSponsors(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch sponsors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/sponsors?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setSponsors(sponsors.filter(s => s._id !== id));
      } else {
        alert(result.error || 'Failed to delete sponsor');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (sponsor: Sponsor) => {
    try {
      const formData = new FormData();
      formData.append('id', sponsor._id);
      formData.append('isActive', (!sponsor.isActive).toString());

      const response = await fetch('/api/sponsors', {
        method: 'PUT',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setSponsors(sponsors.map(s => 
          s._id === sponsor._id ? { ...s, isActive: !s.isActive } : s
        ));
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSponsor(null);
  };

  const handleFormSuccess = () => {
    fetchSponsors();
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      Platinum: 'bg-slate-100 text-slate-700 border-slate-300',
      Gold: 'bg-yellow-50 text-yellow-700 border-yellow-300',
      Silver: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[tier] || 'bg-gray-100 text-gray-700';
  };

  const filteredSponsors = filterTier === 'all' 
    ? sponsors 
    : sponsors.filter(s => s.tier === filterTier);

  const sponsorsByTier = {
    Platinum: filteredSponsors.filter(s => s.tier === 'Platinum'),
    Gold: filteredSponsors.filter(s => s.tier === 'Gold'),
    Silver: filteredSponsors.filter(s => s.tier === 'Silver')
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#4a368f] mb-2">
                Sponsors Management
              </h1>
              <p className="text-gray-600">
                Manage your organization sponsors and partners
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4a368f] to-[#9179E0] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Add Sponsor
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Filter by tier:</span>
            {['all', 'Platinum', 'Gold', 'Silver'].map(tier => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterTier === tier
                    ? 'bg-[#4a368f] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tier === 'all' ? 'All Tiers' : tier}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#9179E0]" />
          </div>
        ) : filteredSponsors.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No sponsors found
            </h3>
            <p className="text-gray-600 mb-6">
              {filterTier === 'all' 
                ? 'Get started by adding your first sponsor'
                : `No ${filterTier} tier sponsors yet`
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4a368f] to-[#9179E0] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Add First Sponsor
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {(['Platinum', 'Gold', 'Silver'] as const).map(tier => {
              const tierSponsors = sponsorsByTier[tier];
              if (tierSponsors.length === 0 && filterTier !== 'all') return null;

              return (
                <div key={tier}>
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-gray-400" />
                    <h2 className="text-xl font-bold text-gray-900">
                      {tier} Sponsors ({tierSponsors.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tierSponsors.map(sponsor => (
                      <div
                        key={sponsor._id}
                        className={`bg-white rounded-lg border-2 overflow-hidden transition-all ${
                          sponsor.isActive 
                            ? 'border-gray-200 hover:border-[#9179E0]' 
                            : 'border-gray-200 opacity-60'
                        }`}
                      >
                        <div className="relative h-40 bg-gray-50 flex items-center justify-center p-4">
                          <Image
                            src={sponsor.logo.url}
                            alt={sponsor.name}
                            width={150}
                            height={75}
                            className="object-contain max-h-32"
                          />
                          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border ${getTierColor(sponsor.tier)}`}>
                            {sponsor.tier}
                          </div>
                          {!sponsor.isActive && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                Hidden
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="text-lg font-bold text-[#4a368f] mb-1">
                              {sponsor.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {sponsor.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <button
                              onClick={() => handleToggleActive(sponsor)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                              title={sponsor.isActive ? 'Hide sponsor' : 'Show sponsor'}
                            >
                              {sponsor.isActive ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => handleEdit(sponsor)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[#9179E0] rounded-lg text-sm font-medium text-[#9179E0] hover:bg-[#9179E0]/5 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(sponsor._id)}
                              disabled={deletingId === sponsor._id}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {deletingId === sponsor._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
            <SponsorForm
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
              editData={editingSponsor || undefined}
            />
        )}
      </div>
    </div>
  );
}