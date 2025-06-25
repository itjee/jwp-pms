import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MoreVertical } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
          
          <Link
            to={`/projects/${project.id}`}
            className="block group"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {project.name}
            </h3>
          </Link>
          
          {project.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          {project.endDate && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{project.members.length} members</span>
          </div>
        </div>

        {/* Team Avatars */}
        <div className="flex -space-x-2">
          {project.members.slice(0, 3).map((member, index) => (
            <div
              key={member.id}
              className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-500 text-xs font-medium text-white ring-2 ring-white dark:ring-gray-800"
              title={member.fullName || member.username}
            >
              {member.fullName?.[0] || member.username[0]}
            </div>
          ))}
          {project.members.length > 3 && (
            <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-400 text-xs font-medium text-white ring-2 ring-white dark:ring-gray-800">
              +{project.members.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;