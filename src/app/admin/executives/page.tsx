"use client";

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Loader2, Eye, Search, Filter, UserCheck, UserX } from 'lucide-react';
import Image from 'next/image';
import { showError, showPromise } from '@/src/lib/toast';
import ToastProvider from '@/src/components/ToastProvider';
import ExecutiveFormModal from '@/src/features/executive/ExecutiveFormModal';

interface Executive {
  _id: string;
  name: string;
  position: string;
  level: string;
  image: {
    url: string;
    publicId: string;
  };
  bio: string;
  email: string;
  phone: string;
  socialMedia: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  achievements: string[];
  responsibilities: string[];
  order: number;
  session: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminExecutivesPage() {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [filteredExecutives, setFilteredExecutives] = useState<Executive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);

  useEffect(() => {
    fetchExecutives();
  }, []);

  useEffect(() => {
    filterExecutives();
  }, [executives, search, sessionFilter, statusFilter]);

  const fetchExecutives = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/executives');
      
      if (!response.ok) throw new Error('Failed to fetch executives');

      const data = await response.json();
      setExecutives(data.data);
    } catch (error: any) {
      console.error('Error fetching executives:', error);
      showError(error.message || 'Failed to load executives');
    } finally {
      setIsLoading(false);
    }
  };

  const filterExecutives = () => {
    let filtered = [...executives];

    if (search) {
      filtered = filtered.filter(exec =>
        exec.name.toLowerCase().includes(search.toLowerCase()) ||
        exec.position.toLowerCase().includes(search.toLowerCase()) ||
        exec.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sessionFilter !== 'all') {
      filtered = filtered.filter(exec => exec.session === sessionFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(exec => 
        statusFilter === 'active' ? exec.isActive : !exec.isActive
      );
    }

    setFilteredExecutives(filtered);
  };

  const handleDelete = async () => {
    if (!selectedExecutive) return;

    try {
      await showPromise(
        fetch(`/api/admin/executives/${selectedExecutive._id}`, {
          method: 'DELETE'
        }).then(res => {
          if (!res.ok) throw new Error('Failed to delete executive');
          return res.json();
        }),
        {
          loading: 'Deleting executive...',
          success: 'Executive deleted successfully',
          error: 'Failed to delete executive'
        }
      );

      await fetchExecutives();
      setIsDeleteModalOpen(false);
      setSelectedExecutive(null);
    } catch (error) {
      console.error('Error deleting executive:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const url = mode === 'create' 
        ? '/api/admin/executives'
        : `/api/admin/executives/${selectedExecutive?._id}`;
      
      const method = mode === 'create' ? 'POST' : 'PATCH';

      await showPromise(
        fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(res => {
          if (!res.ok) throw new Error(`Failed to ${mode} executive`);
          return res.json();
        }),
        {
          loading: `${mode === 'create' ? 'Creating' : 'Updating'} executive...`,
          success: `Executive ${mode === 'create' ? 'created' : 'updated'} successfully`,
          error: `Failed to ${mode} executive`
        }
      );

      await fetchExecutives();
    } catch (error) {
      console.error(`Error ${mode}ing executive:`, error);
      throw error;
    }
  };

  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const sessions = Array.from(new Set(executives.map(e => e.session)));

  return (
    <>
      <ToastProvider />
      <div className="min-h-screen bg-gray-50 font-inter">
        <div className="w-full p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Executives Management</h1>
                <p className="text-gray-600 mt-2">Manage executive team members</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Add Executive
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, position, or email..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="all">All Sessions</option>
                {sessions.map(session => (
                  <option key={session} value={session}>{session}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 text-gray-700 placeholder:text-gray-500 cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Executives</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{executives.length}</h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">
                      {executives.filter(e => e.isActive).length}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                    <h3 className="text-3xl font-bold text-red-600 mt-2">
                      {executives.filter(e => !e.isActive).length}
                    </h3>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <UserX className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sessions</p>
                    <h3 className="text-3xl font-bold text-blue-600 mt-2">{sessions.length}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Filter className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading executives...</p>
              </div>
            ) : filteredExecutives.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No executives found</h3>
                <p className="text-gray-600 mb-4">
                  {search || sessionFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first executive'}
                </p>
                {!search && sessionFilter === 'all' && statusFilter === 'all' && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Executive
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredExecutives.map((exec) => (
                  <div
                    key={exec._id}
                    className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all"
                  >
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={exec.image.url}
                        alt={exec.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {exec.isActive ? (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{exec.name}</h3>
                        <p className="text-sm text-purple-600 font-semibold">{exec.position}</p>
                        <p className="text-xs text-gray-500 mt-1">{exec.level} • {exec.session}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setMode('edit');
                            setSelectedExecutive(exec);
                            setIsEditModalOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedExecutive(exec);
                            setIsDeleteModalOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isDeleteModalOpen && selectedExecutive && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Executive</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedExecutive.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <ExecutiveFormModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedExecutive(null);
          }}
          onSave={handleSave}
          mode="create"
        />

        <ExecutiveFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedExecutive(null);
          }}
          onSave={handleSave}
          executive={selectedExecutive}
          mode="edit"
        />
      </div>
    </>
  );
}