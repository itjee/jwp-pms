import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import TaskCard from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks }) => {
  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
    { status: 'in_progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900' },
    { status: 'in_review', title: 'In Review', color: 'bg-purple-100 dark:bg-purple-900' },
    { status: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900' },
    { status: 'blocked', title: 'Blocked', color: 'bg-red-100 dark:bg-red-900' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);
        
        return (
          <div key={column.status} className="flex-shrink-0 w-80">
            <div className={`rounded-lg p-4 ${column.color}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {columnTasks.length}
                </span>
              </div>
              
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {columnTasks.map((task) => (
                  <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <TaskCard task={task} />
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;