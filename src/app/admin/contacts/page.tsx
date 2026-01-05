"use client"
import { useState, useEffect } from "react";
import { Download, Mail, User, Calendar, MessageSquare, Filter, RefreshCw, Eye } from "lucide-react";

interface Submission {
  _id: string;
  name: string;
  email: string;
  level: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  submittedAt: string;
}

const AdminContactsPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/contact' : `/api/contact?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const url = filter === 'all' ? '/api/contact/export' : `/api/contact/export?status=${filter}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `contact-submissions-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-700 border-red-300';
      case 'read': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'responded': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getLevelBadge = (level: string) => {
    const colors: { [key: string]: string } = {
      '100': 'bg-blue-100 text-blue-700',
      '200': 'bg-purple-100 text-purple-700',
      '300': 'bg-indigo-100 text-indigo-700',
      '400': 'bg-pink-100 text-pink-700',
      'alumni': 'bg-green-100 text-green-700',
      'other': 'bg-gray-100 text-gray-700'
    };
    return colors[level] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
              <p className="text-gray-600">Manage and export contact form submissions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={downloadCSV}
                className="px-4 py-2 bg-[#9179E0] text-white rounded-xl hover:bg-[#7E6BDB] transition-colors flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: submissions.length, color: 'bg-blue-500' },
            { label: 'Unread', count: submissions.filter(s => s.status === 'unread').length, color: 'bg-red-500' },
            { label: 'Read', count: submissions.filter(s => s.status === 'read').length, color: 'bg-yellow-500' },
            { label: 'Responded', count: submissions.filter(s => s.status === 'responded').length, color: 'bg-green-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <Mail className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {['all', 'unread', 'read', 'responded'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-[#9179E0] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#9179E0] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No submissions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 cursor-pointer"
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#9179E0] to-[#7E6BDB] rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{submission.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadge(submission.level)}`}>
                            {submission.level === 'alumni' ? 'Alumni' : `Level ${submission.level}`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{submission.email}</p>
                        <p className="text-base font-semibold text-gray-800 mb-2">{submission.subject}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{submission.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(submission.status)}`}>
                      {submission.status.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSubmission(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg font-semibold text-gray-900">{selectedSubmission.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <a href={`mailto:${selectedSubmission.email}`} className="text-lg text-[#9179E0] hover:underline">
                  {selectedSubmission.email}
                </a>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Level</label>
                <p className="text-lg text-gray-900">{selectedSubmission.level}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-lg font-semibold text-gray-900">{selectedSubmission.subject}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Message</label>
                <p className="text-base text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status.toUpperCase()}
                </span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Submitted At</label>
                <p className="text-base text-gray-900">
                  {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactsPage;