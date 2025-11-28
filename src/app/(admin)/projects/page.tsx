import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Search, Plus } from 'lucide-react';
import { Project, User } from '@/types';
import PageHeader  from '@/components/ui/pageHeader';
import CardGrid from '@/components/ui/cardGrid';
import ProjectCard from '@/components/projects/projectCard';

interface ProjectsPageProps {
  currentUser: User;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ currentUser }) => {
  const mockProjects: Project[] = [
    {
      id: 1,
      title: 'Annual Hackathon 2025',
      slug: 'annual-hackathon-2025',
      description: 'Organizing the biggest coding competition of the year with prizes and workshops',
      category: 'Event',
      status: 'ACTIVE',
      creatorId: 1,
      creator: currentUser,
      createdAt: new Date('2024-11-01'),
      updatedAt: new Date('2024-11-20'),
      members: [],
      updates: []
    },
    {
      id: 2,
      title: 'Website Redesign',
      slug: 'website-redesign',
      description: 'Complete overhaul of club website with modern design and features',
      category: 'Technical',
      status: 'ACTIVE',
      creatorId: 1,
      creator: currentUser,
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date('2024-11-25'),
      members: [],
      updates: []
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader 
        title="Projects" 
        description="Manage and track all club projects"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
            <Button><Plus className="h-4 w-4 mr-2" /> Create Project</Button>
          </div>
        }
      />
      <CardGrid columns={3}>
        {mockProjects.map(project => (
          <ProjectCard key={project.id} project={project} currentUser={currentUser} />
        ))}
      </CardGrid>
    </div>
  );
};

export default ProjectsPage;