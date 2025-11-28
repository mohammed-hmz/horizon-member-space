import React from 'react';

interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Icon className="h-16 w-16 text-muted-foreground mb-4" />
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
    {action}
  </div>
);

export default EmptyState;