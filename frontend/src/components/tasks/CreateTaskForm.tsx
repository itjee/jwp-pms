import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TASK } from '@/graphql/mutations/tasks';
import { GET_PROJECTS } from '@/graphql/queries/projects';
import { TaskInput } from '@/types/task';
import { useToastHelpers } from '@/context/ToastContext';

const schema = yup.object({
  title: yup.string().required('Task title is required'),
  description: yup.string(),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  projectId: yup.number().required('Project is required'),
  estimatedHours: yup.number().positive('Estimated hours must be positive').integer('Estimated hours must be an integer'),
  startDate: yup.string(),
  dueDate: yup.string(),
});

interface CreateTaskFormProps {
  onSuccess: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onSuccess }) => {
  const { success, error } = useToastHelpers();
  const [createTask, { loading }] = useMutation(CREATE_TASK);
  const { data: projectsData } = useQuery(GET_PROJECTS);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'todo',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: TaskInput) => {
    try {
      await createTask({
        variables: {
          taskInput: {
            ...data,
            projectId: parseInt(data.projectId.toString()),
            estimatedHours: data.estimatedHours ? parseInt(data.estimatedHours.toString()) : undefined,
          },
        },
      });
      
      success('Task created', 'Your new task has been created successfully');
      reset();
      onSuccess();
    } catch (err: any) {
      error('Failed to create task', err.message || 'Please try again');
    }
  };

  const projects = projectsData?.projects || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="label">
            Task Title *
          </label>
          <input
            {...register('title')}
            type="text"
            className="input"
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="input"
            placeholder="Task description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="projectId" className="label">
            Project *
          </label>
          <select {...register('projectId')} className="input">
            <option value="">Select a project</option>
            {projects.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.projectId.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="label">
            Status *
          </label>
          <select {...register('status')} className="input">
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.status.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="label">
            Priority *
          </label>
          <select {...register('priority')} className="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.priority.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="estimatedHours" className="label">
            Estimated Hours
          </label>
          <input
            {...register('estimatedHours')}
            type="number"
            className="input"
            placeholder="Hours"
            min="1"
            step="1"
          />
          {errors.estimatedHours && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.estimatedHours.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="startDate" className="label">
            Start Date
          </label>
          <input
            {...register('startDate')}
            type="date"
            className="input"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dueDate" className="label">
            Due Date
          </label>
          <input
            {...register('dueDate')}
            type="date"
            className="input"
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.dueDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-secondary"
          disabled={loading}
        >
          Reset
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          ) : (
            'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateTaskForm;