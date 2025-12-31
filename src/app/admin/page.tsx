"use client"
import React, { useState, useEffect } from 'react';
import type { FC, ComponentType, SVGProps } from 'react';
import { Users, BookOpen, FileText, Calendar, TrendingUp, Award, Activity } from 'lucide-react';

type StatId = 'students' | 'courses' | 'quizzes' | 'events';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type Stat = {
  id: StatId;
  label: string;
  icon: IconComponent;
  color: string;
  bgLight: string;
  textColor: string;
};

const STAT_CARDS: Stat[] = [
  {
    id: 'students',
    label: 'Total Students',
    icon: Users,
    color: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    id: 'courses',
    label: 'Active Courses',
    icon: BookOpen,
    color: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  {
    id: 'quizzes',
    label: 'Total Quizzes',
    icon: FileText,
    color: 'bg-green-500',
    bgLight: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    id: 'events',
    label: 'Upcoming Events',
    icon: Calendar,
    color: 'bg-orange-500',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-600'
  }
];

interface StatCardProps {
  stat: Stat;
  value: number;
  trend: number;
  isLoading: boolean;
}

const StatCard: FC<StatCardProps> = ({ stat, value, trend, isLoading }) => {
  const Icon = stat.icon;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
          </div>
          <div className={`${stat.bgLight} p-3 rounded-xl`}>
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all hover:shadow-lg group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</h3>
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-4 h-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`${stat.bgLight} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${stat.textColor}`} />
        </div>
      </div>
    </div>
  );
};

type Activity = {
  title: string;
  time: string;
  color: string;
};

interface ActivityItemProps {
  activity?: Activity;
  isLoading: boolean;
}

const ActivityItem: FC<ActivityItemProps> = ({ activity, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }

  if (!activity) return null;

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
      <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
        <Activity className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  );
};

type QuickAction = {
  icon: IconComponent;
  title: string;
  description: string;
  bgLight: string;
  textColor: string;
};

interface QuickActionCardProps {
  action: QuickAction;
  isLoading: boolean;
}

const QuickActionCard: FC<QuickActionCardProps> = ({ action, isLoading }) => {
  const Icon = action.icon;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        </div>
      </div>
    );
  }

  return (
    <button className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg text-left group w-full">
      <div className={`${action.bgLight} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${action.textColor}`} />
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
      <p className="text-sm text-gray-600">{action.description}</p>
    </button>
  );
};

const AdminDashboard: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Record<StatId, number>>({
    students: 0,
    courses: 0,
    quizzes: 0,
    events: 0
  });
  const [trends, setTrends] = useState<Record<StatId, number>>({
    students: 0,
    courses: 0,
    quizzes: 0,
    events: 0
  });

  const quickActions: QuickAction[] = [
    {
      icon: Users,
      title: 'Add Student',
      description: 'Register a new student to the platform',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Create Course',
      description: 'Set up a new course with content',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: FileText,
      title: 'New Quiz',
      description: 'Design a quiz for assessment',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: Calendar,
      title: 'Schedule Event',
      description: 'Plan an upcoming event or session',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const recentActivities: Activity[] = [
    {
      title: 'New student registration: John Doe',
      time: '2 minutes ago',
      color: 'bg-blue-500'
    },
    {
      title: 'Quiz "React Fundamentals" completed by 45 students',
      time: '15 minutes ago',
      color: 'bg-green-500'
    },
    {
      title: 'Course "Advanced JavaScript" updated',
      time: '1 hour ago',
      color: 'bg-purple-500'
    },
    {
      title: 'Event "Career Workshop" scheduled for next week',
      time: '2 hours ago',
      color: 'bg-orange-500'
    },
    {
      title: 'System backup completed successfully',
      time: '3 hours ago',
      color: 'bg-gray-500'
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStats({
        students: 245,
        courses: 12,
        quizzes: 38,
        events: 5
      });

      setTrends({
        students: 12.5,
        courses: 8.3,
        quizzes: -3.2,
        events: 25.0
      });

      setIsLoading(false);
    };

    void fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {STAT_CARDS.map((stat) => (
            <StatCard
              key={stat.id}
              stat={stat}
              value={stats[stat.id]}
              trend={trends[stat.id]}
              isLoading={isLoading}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-700">View All</button>
              </div>
              <div className="space-y-2">
                {isLoading
                  ? [...Array(5)].map((_, i) => <ActivityItem key={i} isLoading={true} />)
                  : recentActivities.map((activity, i) => (
                      <ActivityItem key={i} activity={activity} isLoading={false} />
                    ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Top Performers</h2>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-4">
                {isLoading
                  ? [...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    ))
                  : [...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">Student Name {i + 1}</p>
                          <p className="text-xs text-gray-500">{95 - i * 2}% avg score</p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <QuickActionCard key={i} action={action} isLoading={isLoading} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;