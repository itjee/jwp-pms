import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, MessageCircle, Paperclip } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500';
      case 'high':
        return 'border-l-4 border-orange-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
        return 'border-l-4 border-green-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`card p-4 hover:shadow-md transition-shadow ${getPriorityColor(task.priority)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {task.project.name}
            </span>
            {isOverdue && (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Overdue
              </span>
            )}
          </div>
          
          <Link
            to={`/tasks/${task.id}`}
            className="block group"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {task.title}
            </h3>
          </Link>
          
          {task.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Task Meta */}
          <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            {task.dueDate && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span className={isOverdue ? 'text-red-600 dark:text-red-400' : ''}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {task.estimatedHours && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{task.estimatedHours}h</span>
              </div>
            )}

            {/* Comments count - placeholder */}
            <div className="flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" />
              <span>0</span>
            </div>

            {/* Attachments count - placeholder */}
            <div className="flex items-center">
              <Paperclip className="h-3 w-3 mr-1" />
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Assignees */}
        <div className="ml-4">
          <div className="flex -space-x-2">
            {task.assignees.slice(0, 3).map((assignee, index) => (
              <div
                key={assignee.id}
                className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-500 text-xs font-medium text-white ring-2 ring-white dark:ring-gray-800"
                title={assignee.fullName || assignee.username}
              >
                {assignee.fullName?.[0] || assignee.username[0]}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-400 text-xs font-medium text-white ring-2 ring-white dark:ring-gray-800">
                +{task.assignees.length - 3}
              </div>
            )}
            {task.assignees.length === 0 && (
              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400 ring-2 ring-white dark:ring-gray-800">
                <User className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex px-2 py-1 text-xs rounded-full"
              style={{ backgroundColor: tag.color + '20', color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;