import React from 'react';
import { useQuery } from '@apollo/client';
import { Plus, Mail, Phone, MapPin } from 'lucide-react';
import { GET_USERS } from '@/graphql/queries/auth';
import { Loading } from '@/components/common/Loading';

const TeamPage: React.FC = () => {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) {
    return <Loading message="Loading team members..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Error loading team: {error.message}</p>
      </div>
    );
  }

  const users = data?.users || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your team members and their roles
          </p>
        </div>
        <button className="btn-primary mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user: any) => (
          <div key={user.id} className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || user.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {user.fullName?.[0] || user.username[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.fullName || user.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.position || user.role}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {user.email && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.department && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{user.department}</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                user.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                user.role === 'developer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;