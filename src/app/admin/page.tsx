"use client"
import { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, Award, TrendingUp, AlertCircle,
  FileText, Star, UserCheck, Clock, ArrowUpRight, ArrowDownRight,
  PieChart, BarChart3, Activity, ChevronRight, Loader2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  students: {
    total: number;
    active: number;
    suspended: number;
    banned: number;
    growth: number;
  };
  courses: {
    total: number;
    published: number;
    drafts: number;
    totalWeeks: number;
  };
  quizzes: {
    total: number;
    active: number;
    completed: number;
    averageScore: number;
  };
  flashcards: {
    total: number;
    byLevel: Record<string, number>;
    totalViews: number;
    masteredCount: number;
  };
  newsEvents: {
    total: number;
    news: number;
    events: number;
    totalViews: number;
  };
  executives: {
    total: number;
    active: number;
    sessions: number;
  };
  lecturers: {
    total: number;
    activeCourses: number;
  };
}

interface ActivityItem {
  id: string;
  type: 'student' | 'course' | 'quiz' | 'event';
  action: string;
  user: string;
  timestamp: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

const COLORS = ['#9179E0', '#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'];

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, coursesRes, flashcardsRes, newsEventsRes, executivesRes] = await Promise.all([
        fetch('/api/admin/students/stats'),
        fetch('/api/admin/courses?limit=1000'),
        fetch('/api/flashcards/stats'),
        fetch('/api/news-events?limit=1000'),
        fetch('/api/admin/executives')
      ]);

      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();
      const flashcardsData = await flashcardsRes.json();
      const newsEventsData = await newsEventsRes.json();
      const executivesData = await executivesRes.json();

      const courses = coursesData.data || [];
      const newsEvents = newsEventsData.data || [];
      const executives = executivesData.data || [];

      setStats({
        students: {
          total: studentsData.data?.totalStudents || 0,
          active: studentsData.data?.activeStudents || 0,
          suspended: studentsData.data?.suspendedStudents || 0,
          banned: studentsData.data?.bannedStudents || 0,
          growth: 12.5
        },
        courses: {
          total: courses.length,
          published: courses.filter((c: any) => c.status === 'PUBLISHED').length,
          drafts: courses.filter((c: any) => c.status === 'DRAFT').length,
          totalWeeks: courses.reduce((acc: number, c: any) => acc + (c.weeks?.length || 0), 0)
        },
        quizzes: {
          total: 45,
          active: 32,
          completed: 1250,
          averageScore: 78.5
        },
        flashcards: {
          total: flashcardsData.data?.total || 0,
          byLevel: flashcardsData.data?.byLevel?.reduce((acc: any, item: any) => {
            acc[item._id] = item.count;
            return acc;
          }, {}) || {},
          totalViews: 5420,
          masteredCount: 892
        },
        newsEvents: {
          total: newsEvents.length,
          news: newsEvents.filter((n: any) => n.type === 'news').length,
          events: newsEvents.filter((n: any) => n.type === 'event').length,
          totalViews: newsEvents.reduce((acc: number, n: any) => acc + (n.views || 0), 0)
        },
        executives: {
          total: executives.length,
          active: executives.filter((e: any) => e.isActive).length,
          sessions: new Set(executives.map((e: any) => e.session)).size
        },
        lecturers: {
          total: 24,
          activeCourses: courses.length
        }
      });

      setActivities([
        { id: '1', type: 'student', action: 'New student registered', user: 'John Doe', timestamp: '2 minutes ago' },
        { id: '2', type: 'course', action: 'Course published', user: 'Dr. Smith', timestamp: '15 minutes ago' },
        { id: '3', type: 'quiz', action: 'Quiz completed', user: 'Jane Smith', timestamp: '1 hour ago' },
        { id: '4', type: 'event', action: 'Event created', user: 'Admin', timestamp: '2 hours ago' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      title: 'Manage Lecturers',
      description: 'View and manage lecturer profiles',
      icon: Users,
      href: '/admin/lecturers',
      color: 'bg-purple-500'
    },
    {
      title: 'Create Course',
      description: 'Add new course material',
      icon: BookOpen,
      href: '/admin/courses/create',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Quiz',
      description: 'Design new assessment',
      icon: FileText,
      href: '/admin/quizzes',
      color: 'bg-green-500'
    },
    {
      title: 'Add Event',
      description: 'Schedule new event',
      icon: Calendar,
      href: '/admin/events',
      color: 'bg-orange-500'
    }
  ];

  const studentTrendData = [
    { name: 'Jan', students: 120 },
    { name: 'Feb', students: 145 },
    { name: 'Mar', students: 168 },
    { name: 'Apr', students: 189 },
    { name: 'May', students: 205 },
    { name: 'Jun', students: stats?.students.total || 220 }
  ];

  const courseDistributionData = stats ? [
    { name: 'Published', value: stats.courses.published },
    { name: 'Drafts', value: stats.courses.drafts }
  ] : [];

  const levelDistributionData = stats ? Object.entries(stats.flashcards.byLevel).map(([level, count]) => ({
    name: level,
    value: count
  })) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#9179E0] animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#9179E0] cursor-pointer"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                {stats.students.growth}%
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.students.total}</h3>
            <p className="text-purple-100">Total Students</p>
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-sm">
              <span>Active: {stats.students.active}</span>
              <span>Suspended: {stats.students.suspended}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Activity className="w-4 h-4" />
                {stats.courses.published}/{stats.courses.total}
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.courses.total}</h3>
            <p className="text-blue-100">Total Courses</p>
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-sm">
              <span>Published: {stats.courses.published}</span>
              <span>Weeks: {stats.courses.totalWeeks}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                {stats.quizzes.averageScore}%
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.quizzes.total}</h3>
            <p className="text-green-100">Active Quizzes</p>
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-sm">
              <span>Completed: {stats.quizzes.completed}</span>
              <span>Active: {stats.quizzes.active}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Star className="w-4 h-4" />
                {stats.newsEvents.totalViews}
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.newsEvents.total}</h3>
            <p className="text-orange-100">News & Events</p>
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between text-sm">
              <span>News: {stats.newsEvents.news}</span>
              <span>Events: {stats.newsEvents.events}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Student Growth</h2>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#9179E0" 
                  strokeWidth={3}
                  dot={{ fill: '#9179E0', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Course Status</h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={courseDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent || 0 * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {courseDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className="group flex items-start gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-[#9179E0] transition-all hover:shadow-lg"
                  >
                    <div className={`${action.color} p-3 rounded-xl text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#9179E0] transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#9179E0] transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'student' ? 'bg-purple-100' :
                    activity.type === 'course' ? 'bg-blue-100' :
                    activity.type === 'quiz' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'student' && <UserCheck className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'course' && <BookOpen className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'quiz' && <FileText className="w-4 h-4 text-green-600" />}
                    {activity.type === 'event' && <Calendar className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.user}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.flashcards.total}</h3>
            <p className="text-gray-600 mb-3">Flashcards</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Views:</span>
              <span className="font-semibold text-gray-900">{stats.flashcards.totalViews}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.executives.total}</h3>
            <p className="text-gray-600 mb-3">Executives</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Active:</span>
              <span className="font-semibold text-gray-900">{stats.executives.active}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.lecturers.total}</h3>
            <p className="text-gray-600 mb-3">Lecturers</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Courses:</span>
              <span className="font-semibold text-gray-900">{stats.lecturers.activeCourses}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.flashcards.masteredCount}</h3>
            <p className="text-gray-600 mb-3">Mastered Cards</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Rate:</span>
              <span className="font-semibold text-green-600">
                {((stats.flashcards.masteredCount / stats.flashcards.total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;