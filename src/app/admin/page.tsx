"use client"
import { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, Award, TrendingUp, AlertCircle,
  FileText, Star, UserCheck, Clock, ChevronRight, Loader2, Menu, X,
  Settings, LogOut, Home, GraduationCap, MessageSquare,
  Layers, Grid, Bell, Activity, BarChart3, PieChart as PieChartIcon,
  Search, Filter, Download, Plus, ArrowUpRight, Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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
  contacts: {
    total: number;
    unread: number;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, coursesRes, flashcardsRes, newsEventsRes, executivesRes, contactsRes] = await Promise.all([
        fetch('/api/admin/students/stats'),
        fetch('/api/admin/courses?limit=1000'),
        fetch('/api/flashcards/stats'),
        fetch('/api/news-events?limit=1000'),
        fetch('/api/admin/executives'),
        fetch('/api/contact?limit=1000')
      ]);

      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();
      const flashcardsData = await flashcardsRes.json();
      const newsEventsData = await newsEventsRes.json();
      const executivesData = await executivesRes.json();
      const contactsData = await contactsRes.json();

      const courses = coursesData.data || [];
      const newsEvents = newsEventsData.data || [];
      const executives = executivesData.data || [];
      const contacts = contactsData.submissions || [];

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
        },
        contacts: {
          total: contacts.length,
          unread: contacts.filter((c: any) => c.status === 'unread').length
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/admin' },
    { id: 'students', label: 'Students', icon: Users, href: '/admin/students' },
    { id: 'lecturers', label: 'Lecturers', icon: GraduationCap, href: '/admin/lecturers' },
    { id: 'courses', label: 'Courses', icon: BookOpen, href: '/admin/courses' },
    { id: 'quizzes', label: 'Quizzes', icon: FileText, href: '/admin/quizzes' },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, href: '/admin/flashcards' },
    { id: 'events', label: 'News & Events', icon: Calendar, href: '/admin/events' },
    { id: 'sponsors', label: 'Sponsors', icon: Award, href: '/admin/sponsors' },
    { id: 'contacts', label: 'Contacts', icon: MessageSquare, href: '/admin/contacts', badge: stats?.contacts.unread || 0 },
    { id: 'executives', label: 'Executives', icon: Star, href: '/admin/executives' }
  ];

  const studentTrendData = [
    { name: 'Jan', students: 120, active: 110 },
    { name: 'Feb', students: 145, active: 135 },
    { name: 'Mar', students: 168, active: 155 },
    { name: 'Apr', students: 189, active: 175 },
    { name: 'May', students: 205, active: 190 },
    { name: 'Jun', students: stats?.students.total || 220, active: stats?.students.active || 205 }
  ];

  const engagementData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 61 },
    { name: 'Thu', value: 58 },
    { name: 'Fri', value: 70 },
    { name: 'Sat', value: 35 },
    { name: 'Sun', value: 28 }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full">
        <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's your overview</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm text-gray-700 w-64"
                  />
                </div>
                
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="year">Last year</option>
                </select>

                <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-100 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-600">+{stats.students.growth}%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.students.total}</h3>
                <p className="text-sm text-gray-500 mb-4">Total Students</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Active</p>
                    <p className="text-lg font-bold text-gray-900">{stats.students.active}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Suspended</p>
                    <p className="text-lg font-bold text-gray-900">{stats.students.suspended}</p>
                  </div>
                </div>
              </div>

              {/* Courses Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-100 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-blue-600">{stats.courses.published} Live</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.courses.total}</h3>
                <p className="text-sm text-gray-500 mb-4">Total Courses</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Published</p>
                    <p className="text-lg font-bold text-gray-900">{stats.courses.published}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Weeks</p>
                    <p className="text-lg font-bold text-gray-900">{stats.courses.totalWeeks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-green-100 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-lg">
                    <Zap className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-bold text-green-600">{stats.quizzes.averageScore}%</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.quizzes.total}</h3>
                <p className="text-sm text-gray-500 mb-4">Active Quizzes</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-lg font-bold text-gray-900">{stats.quizzes.completed}</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Active</p>
                    <p className="text-lg font-bold text-gray-900">{stats.quizzes.active}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-orange-100 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  {stats.contacts.unread > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      <span className="text-xs font-bold text-red-600">{stats.contacts.unread} New</span>
                    </div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.contacts.total}</h3>
                <p className="text-sm text-gray-500 mb-4">Contact Messages</p>
                <div className="pt-4 border-t border-gray-100">
                  <a href="/admin/contacts" className="flex items-center justify-between text-sm font-semibold text-orange-600 hover:text-orange-700">
                    <span>View all messages</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Student Growth</h3>
                    <p className="text-sm text-gray-500 mt-1">Monthly registration trends</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={studentTrendData}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="students" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      fill="url(#colorStudents)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Weekly Activity</h3>
                    <p className="text-sm text-gray-500 mt-1">Engagement rate</p>
                  </div>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                  <p className="text-sm text-gray-500 mt-1">Frequently used features</p>
                </div>
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'View Contacts', desc: 'Check new messages', icon: MessageSquare, href: '/admin/contacts', color: 'orange', badge: stats.contacts.unread },
                  { title: 'Manage Students', desc: 'View student profiles', icon: Users, href: '/admin/students', color: 'indigo' },
                  { title: 'Manage Lecturers', desc: 'View lecturer profiles', icon: GraduationCap, href: '/admin/lecturers', color: 'purple' },
                  { title: 'Create Course', desc: 'Add new material', icon: BookOpen, href: '/admin/courses/create', color: 'blue' },
                  { title: 'Add Event', desc: 'Schedule new event', icon: Calendar, href: '/admin/events', color: 'green' },
                  { title: 'Manage Sponsors', desc: 'View sponsors', icon: Award, href: '/admin/sponsors', color: 'pink' },
                  { title: 'Brand Banner', desc: 'View banners', icon: Award, href: '/admin/business-banner', color: 'blue' }
                ].map((action, idx) => {
                  const Icon = action.icon;
                  const colorClasses = {
                    orange: 'bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-200',
                    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-200',
                    purple: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-200',
                    blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-200',
                    green: 'bg-green-50 text-green-600 border-green-100 hover:border-green-200',
                    pink: 'bg-pink-50 text-pink-600 border-pink-100 hover:border-pink-200'
                  };
                  
                  return (
                    <a
                      key={idx}
                      href={action.href}
                      className="group relative flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md"
                    >
                      {action.badge && action.badge > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                          {action.badge}
                        </span>
                      )}
                      <div className={`p-3 rounded-xl ${colorClasses[action.color as keyof typeof colorClasses].split(' ')[0]}`}>
                        <Icon className={`w-5 h-5 ${colorClasses[action.color as keyof typeof colorClasses].split(' ')[1]}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500">{action.desc}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-purple-100 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <Layers className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.flashcards.total}</h3>
                <p className="text-sm text-gray-500 mb-3">Flashcards</p>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                  <span className="text-gray-500">Total Views</span>
                  <span className="font-bold text-gray-900">{stats.flashcards.totalViews}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-100 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.executives.total}</h3>
                <p className="text-sm text-gray-500 mb-3">Executives</p>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                  <span className="text-gray-500">Active</span>
                  <span className="font-bold text-gray-900">{stats.executives.active}</span>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-green-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.lecturers.total}</h3>
            <p className="text-sm text-gray-500 mb-3">Lecturers</p>
            <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
              <span className="text-gray-500">Active Courses</span>
              <span className="font-bold text-gray-900">{stats.lecturers.activeCourses}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-amber-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.flashcards.masteredCount}</h3>
            <p className="text-sm text-gray-500 mb-3">Mastered Cards</p>
            <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
              <span className="text-gray-500">Mastery Rate</span>
              <span className="font-bold text-green-600">
                {((stats.flashcards.masteredCount / stats.flashcards.total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  {sidebarOpen && (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  )}
</div>
);
};
export default AdminDashboard;