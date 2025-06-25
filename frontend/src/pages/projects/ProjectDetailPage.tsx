import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Project Detail - {id}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Project detail page implementation coming soon...
      </p>
    </div>
  );
};

export default ProjectDetailPage;