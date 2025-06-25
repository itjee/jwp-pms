import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { CREATE_PROJECT } from '@/graphql/mutations/projects';
import { ProjectInput } from '@/types/project';
import { useToastHelpers } from '@/context/ToastContext';

const schema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string(),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  startDate: yup.string(),
  endDate: yup.string(),
  budget: yup.number().positive('Budget must be positive').integer('Budget must be an integer'),
});

interface CreateProjectFormProps {
  onSuccess: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSuccess }) => {
  const { success, error } = useToastHelpers();
  const [createProject, { loading }] = useMutation(CREATE_PROJECT);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'planning',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: ProjectInput) => {
    try {
      await createProject({
        variables: {
          projectInput: {
            ...data,
            budget: data.budget ? parseInt(data.budget.toString()) : undefined,
          },
        },
      });
      
      success('Project created', 'Your new project has been created successfully');
      reset();
      onSuccess();
    } catch (err: any) {
      error('Failed to create project', err.message || 'Please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="label">
            Project Name *
          </label>
          <input
            {...register('name')}
            type="text"
            className="input"
            placeholder="Enter project name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
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
            placeholder="Project description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="label">
            Status *
          </label>
          <select {...register('status')} className="input">
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
          <label htmlFor="endDate" className="label">
            End Date
          </label>
          <input
            {...register('endDate')}
            type="date"
            className="input"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.endDate.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="budget" className="label">
            Budget (₩)
          </label>
          <input
            {...register('budget')}
            type="number"
            className="input"
            placeholder="Enter project budget"
            min="0"
            step="1000"
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.budget.message}
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
            'Create Project'
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;