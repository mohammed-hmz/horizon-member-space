import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Plus, Trash2 } from 'lucide-react';
import { Project, User } from '@/types';
import UserAvatar from '@/components/ui/userAvatar';
import { StatusBadge } from '@/components/nav/ui/status-badge'
interface ProjectDetailDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
}

const ProjectDetailDialog: React.FC<ProjectDetailDialogProps> = ({ project, open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="aspect-video bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 -mt-6 -mx-6 mb-6 flex items-center justify-center">
          <div className="text-white text-6xl font-bold opacity-30">
            {project.title.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <DialogHeader>
          <div className="flex items-start gap-4">
            <UserAvatar user={project.creator} size="lg" />
            <div className="flex-1">
              <DialogTitle className="text-3xl mb-2">{project.title}</DialogTitle>
              <div className="flex items-center gap-3">
                <StatusBadge status={project.status} />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <span className="text-sm text-muted-foreground">by {(project.creator as any)?.displayName ?? (project.creator as any)?.name ?? 'Unknown'}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{project.description || 'No description provided'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Created</h4>
                <p className="text-sm text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Last Updated</h4>
                <p className="text-sm text-muted-foreground">{new Date(project.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            {project.status === 'ACTIVE' && (
              <div className="flex gap-2 pt-4">
                <Button variant="outline">Archive Project</Button>
                <Button variant="outline">Mark as Complete</Button>
                <Button variant="destructive">Cancel Project</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <div className="space-y-4">
              <Button className="w-full">
                <UserPlus className="h-4 w-4 mr-2" /> Add Member
              </Button>
              <div className="grid gap-3">
                {project.members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={member.user} />
                      <div>
                        <p className="font-medium">{member.user.displayName}</p>
                        <p className="text-sm text-muted-foreground">{member.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{member.role}</Badge>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="updates" className="mt-6">
            <div className="space-y-4">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Create Update
              </Button>
              <div className="space-y-3">
                {project.updates?.map((update) => (
                  <div key={update.id} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <UserAvatar user={update.createdBy} size="sm" />
                      <span className="font-medium">{update.title}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{update.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="text-center py-8">
              {/* <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" /> */}
              <p className="text-muted-foreground mb-4">Link this project to calendar events</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add to Calendar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Project created</span>
                <span>{new Date(project.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Last modified</span>
                <span>{new Date(project.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailDialog;