"use client";
import React, { useState } from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Users } from 'lucide-react';
import { Project, User } from '@/types';
import  UserAvatar from '@/components/ui/userAvatar';
import DeleteDialog from '@/components/ui/deleteDialoge';
import ProjectDetailDialog from './ProjectDetailDialog';
import StatusBadge from '@/components/ui/statuseBadge';
interface ProjectCardProps {
  project: Project;
  currentUser: User;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, currentUser }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const canDelete =true;

  return (
    <>
      <Card className="group hover:shadow-lg transition-all overflow-hidden cursor-pointer" onClick={() => setDetailOpen(true)}>
        <div className="aspect-video bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold opacity-20">
            {project.title.charAt(0).toUpperCase()}
          </div>
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
              <StatusBadge status={project.status} />
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
              {canDelete && <DeleteDialog title="Delete Project" description="This will permanently delete this project." onConfirm={() => {}} />}
            </div>
          </div>
          <CardDescription className="line-clamp-2 mt-2">{project.description || 'No description'}</CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <UserAvatar user={project.creator} size="sm" />
            <span className="text-sm text-muted-foreground">{project.creatorId}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{project.members?.length || 0}</span>
          </div>
        </CardFooter>
      </Card>

      <ProjectDetailDialog project={project} open={detailOpen} onOpenChange={setDetailOpen} currentUser={currentUser} />
    </>
  );
};

export default ProjectCard;