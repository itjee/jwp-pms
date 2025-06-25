import React from 'react';
import { useQuery } from '@apollo/client';
import { 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Activity
} from 'lucide-react';
import { GET_DASHBOARD_STATS, GET_RECENT_ACTIVITIES } from '@/graphql/queries/dashboard';
import { Loading } from '@/components/common/Loading';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => {
  const changeColor = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="card p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900">
            {icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm ${changeType ? changeColor[changeType] : 'text-gray-600'}`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_STATS);
  const { data: activitiesData, loading: activitiesLoading } = useQuery(GET_RECENT_ACTIVITIES, {
    variables: { limit: 10 }
  });

  if (statsLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  const stats = statsData?.dashboardStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          change="+2 this month"
          changeType="positive"
          icon={<FolderOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />}
        />
        <StatCard
          title="Active Projects"
          value={stats?.activeProjects || 0}
          change={`${stats?.completedProjects || 0} completed`}
          changeType="neutral"
          icon={<TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />}
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          change={`${stats?.completedTasks || 0} completed`}
          changeType="neutral"
          icon={<CheckSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />}
        />
        <StatCard
          title="Overdue Tasks"
          value={stats?.overdueTasks || 0}
          change="Needs attention"
          changeType={stats?.overdueTasks > 0 ? "negative" : "positive"}
          icon={<AlertTriangle className="h-6 w-6 text-primary-600 dark:text-primary-400" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Project Progress
              </h2>
              <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                View all
              </button>
            </div>
            
            {/* Sample project progress bars */}
            <div className="space-y-4">
              {[
                { name: "Website Redesign", progress: 75, tasks: "12/16 tasks" },
                { name: "Mobile App", progress: 45, tasks: "8/18 tasks" },
                { name: "API Development", progress: 90, tasks: "9/10 tasks" },
              ].map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {project.tasks}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>

          {activitiesLoading ? (
            <Loading size="sm" message="Loading activities..." />
          ) : (
            <div className="space-y-4">
              {activitiesData?.recentActivities?.length > 0 ? (
                activitiesData.recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                          {activity.user?.fullName?.[0] || activity.user?.username?.[0] || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user?.fullName || activity.user?.username}</span>
                        {' '}{activity.description}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
            <FolderOpen className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Project</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
            <CheckSquare className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Create Task</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
            <Calendar className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule Event</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
            <Users className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Invite Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;