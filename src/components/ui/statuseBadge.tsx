import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '@/types';

interface StatusBadgeProps {
  status: ProjectStatus | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variants: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return (
    <Badge className={variants[status] || 'bg-gray-100 text-gray-800'} variant="secondary">
      {status}
    </Badge>
  );
};

export default StatusBadge;