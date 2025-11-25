"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle2, 
  Circle, 
  Users, 
  Bell, 
  Calendar, 
  FileText, 
  Eye, 
  Clock,
  ChevronDown,
  X,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  completed: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  completedAt: any;
  priority: "low" | "medium" | "high";
};

type Member = {
  uid: string;
  name: string;
  role?: string;
};

type Notification = {
  id: string;
  message: string;
  taskId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
  readBy: string[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  category?: string;
  members: Member[];
  tasks: Task[];
  notifications: Notification[];
};

type ProjectCardProps = {
  project: Project;
  currentUserId?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, currentUserId = 'user1' }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAcceptDeclineOpen, setIsAcceptDeclineOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  // const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Category to image mapping
  const getCategoryImage = (category?: string) => {
    const categoryMap: Record<string, string> = {
      'web development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
      'mobile': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
      'design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
      'marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      'data': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    };
    return categoryMap[category?.toLowerCase() || ''] || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop';
  };

  const isNew = () => {
    const projectDate = new Date(project.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - projectDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 3;
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'bg-green-500 hover:bg-green-600',
      pending: 'bg-yellow-500 hover:bg-yellow-600',
      completed: 'bg-blue-500 hover:bg-blue-600',
      onhold: 'bg-orange-500 hover:bg-orange-600',
      inprogress: 'bg-blue-500 hover:bg-blue-600',
    };
    return statusMap[status.toLowerCase().replace(/\s+/g, '')] || 'bg-gray-500';
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      onhold: 'On Hold',
      inprogress: 'In Progress',
      active: 'Active',
      pending: 'Pending',
      completed: 'Completed',
    };
    return statusMap[status.toLowerCase().replace(/\s+/g, '')] || status;
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800 border-blue-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300',
    };
    return priorityMap[priority] || 'bg-gray-100 text-gray-800';
  };

  // const handleMarkComplete = (taskId: string) => {
  //   setCompletedTasks(prev => new Set(prev).add(taskId));
  //   setShowSuccessAlert(true);
  //   setTimeout(() => setShowSuccessAlert(false), 3000);
  // };

  const handleNotificationClick = (notificationId: string) => {
    setReadNotifications(prev => new Set(prev).add(notificationId));
  };

  const handleAcceptRole = () => {
    console.log('Role accepted');
    setIsAcceptDeclineOpen(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleDeclineRole = (reason: string) => {
    console.log('Role declined:', reason);
    setIsAcceptDeclineOpen(false);
  };

  const getFilteredTasks = () => {
    if (!selectedMember) return project.tasks;
    return project.tasks.filter(task => task.assignedTo === selectedMember);
  };

  const getMyTasks = () => {
    return project.tasks.filter(task => task.assignedTo === currentUserId);
  };

  const isTaskCompleted = (task: Task) => {
    return task.completed || false;
  };

  const getUnreadNotifications = () => {
    return project.notifications.filter(
      notif => !notif.readBy.includes(currentUserId) && !readNotifications.has(notif.id)
    );
  };

  const unreadCount = getUnreadNotifications().length;

  return (
    <>
      <Card onClick={()=>setIsDialogOpen(true)}  className="flex flex-col hover:shadow-xl transition-all bg-zinc-900 border-zinc-800 overflow-hidden relative">
        {/* Thumbnail Image */}
        <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
          <Image
            src={getCategoryImage(project.category)}
            alt={project.title}
            fill
            className=" object-cover opacity-80 hover:opacity-100 transition-opacity"
          />
          
          {/* NEW Badge - Top Left */}
          {isNew() && (
            <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white border-0 px-3 py-1 font-semibold">
              NEW
            </Badge>
          )}

          {/* Status Badge - Top Right */}
          <Badge className={`absolute top-4 right-4 ${getStatusColor(project.status)} text-white border-0 px-3 py-1`}>
            {formatStatus(project.status)}
          </Badge>

          {/* Notifications Dropdown - Bottom Right */}
          <div className="absolute bottom-4 right-4">
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                className="bg-zinc-800/90 hover:bg-zinc-700 border-zinc-700 relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-80 max-h-96 overflow-hidden bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-10">
                  <div className="flex items-center justify-between p-3 border-b border-zinc-700">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotificationsOpen(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <ScrollArea className="max-h-80">
                    <div className="p-2 space-y-2">
                      {project.notifications.length === 0 ? (
                        <div className="p-4 text-center text-zinc-400 text-sm">
                          No notifications
                        </div>
                      ) : (
                        project.notifications.map((notification) => {
                          const isRead = notification.readBy.includes(currentUserId) || 
                                       readNotifications.has(notification.id);
                          return (
                            <Alert
                              key={notification.id}
                              className={`cursor-pointer transition-all ${
                                isRead 
                                  ? 'bg-zinc-900 border-zinc-700' 
                                  : 'bg-blue-500/10 border-blue-500/50'
                              }`}
                              onClick={() => handleNotificationClick(notification.id)}
                            >
                              <AlertCircle className={`h-4 w-4 ${isRead ? 'text-zinc-500' : 'text-blue-400'}`} />
                              <AlertDescription className={`text-xs ${isRead ? 'text-zinc-400' : 'text-zinc-200'}`}>
                                {notification.message}
                                {!isRead && (
                                  <Badge variant="secondary" className="ml-2 bg-blue-600 text-white text-xs">New</Badge>
                                )}
                              </AlertDescription>
                            </Alert>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-white">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-2 text-zinc-400">
            {project.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Users className="w-4 h-4" />
            <span>{project.members.length} Members</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {project.category && (
              <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                {project.category}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            {project.members.slice(0, 3).map((member, idx) => (
              <div 
                key={member.uid}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold"
                style={{ marginLeft: idx > 0 ? '-8px' : '0', zIndex: 3 - idx }}
              >
                {member.name.charAt(0)}
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs font-semibold -ml-2">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        </CardContent>

        <Separator className="bg-zinc-800" />

        <CardFooter className="flex justify-between items-center pt-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>

      {/* Main Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader className="flex flex-row items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl text-white flex items-center gap-3">
                {project.title}
                <Badge className={`${getStatusColor(project.status)} text-white border-0`}>
                  {formatStatus(project.status)}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-zinc-400 mt-2">
                {project.description}
              </DialogDescription>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 mt-6">
            <div className="space-y-6">
              {/* Project Specification */}
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Project Specification</h3>
                  </div>
                  <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-300">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </CardHeader>
              </Card>

              {/* Team Members Section */}
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Team Members</h3>
                    </div>
                    <Badge variant="secondary" className="bg-zinc-700 text-zinc-200">
                      {project.members.length} Members
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.members.map((member) => (
                    <div 
                      key={member.uid}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedMember === member.uid 
                          ? 'bg-blue-500/10 border-blue-500/50' 
                          : 'bg-zinc-900/50 border-zinc-700 hover:border-zinc-600'
                      }`}
                      onClick={() => setSelectedMember(selectedMember === member.uid ? null : member.uid)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{member.name}</p>
                          <p className="text-sm text-zinc-400">{member.role || 'Member'}</p>
                        </div>
                      </div>
                      {member.uid === currentUserId && (
                        <Badge className="bg-blue-600 text-white">You</Badge>
                      )}
                    </div>
                  ))}
                  {selectedMember && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-zinc-600 text-zinc-300"
                      onClick={() => setSelectedMember(null)}
                    >
                      Clear Filter
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* My Tasks Section */}
              {getMyTasks().length > 0 && (
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">My Tasks</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {showSuccessAlert && (
                      <Alert className="bg-green-500/10 border-green-500/50">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <AlertDescription className="text-green-300">
                          Action completed successfully!
                        </AlertDescription>
                      </Alert>
                    )}
                    {getMyTasks().map((task) => (
                      <div 
                        key={task.id} 
                        className="p-4 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer hover:border-zinc-600 transition-all"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsAcceptDeclineOpen(true);
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-white">{task.title}</h4>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-400">{task.description}</p>
                          </div>
                          <ChevronDown className="w-5 h-5 text-zinc-400" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* All Tasks Section */}
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {selectedMember ? 'Filtered Tasks' : 'All Tasks'}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {getFilteredTasks().map((task, index) => (
                      <AccordionItem key={task.id} value={`task-${index}`} className="border-zinc-700">
                        <AccordionTrigger className="hover:no-underline hover:bg-zinc-900/50 px-3 rounded-lg">
                          <div className="flex items-center gap-3 flex-1 text-left">
                            {isTaskCompleted(task) ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                            )}
                            <span className={`text-white ${isTaskCompleted(task) ? 'line-through text-zinc-500' : ''}`}>
                              {task.title}
                            </span>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-11 space-y-2 pt-2 text-zinc-300">
                            <p className="text-sm">{task.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-zinc-500">Assigned to:</span>
                              <Badge variant="outline" className="bg-zinc-900 text-zinc-300 border-zinc-700">
                                {task.assignedToName}
                              </Badge>
                            </div>
                            {isTaskCompleted(task) && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Accept/Decline Dialog */}
      <Dialog open={isAcceptDeclineOpen} onOpenChange={setIsAcceptDeclineOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Task Assignment</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-zinc-300">{selectedTask?.description}</p>
            
            <Separator className="bg-zinc-700" />
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Accept this task?</h3>
              
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleAcceptRole}
                >
                  Accept Task
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-zinc-600 text-zinc-300"
                  onClick={() => {
                    // Show decline reasons
                  }}
                >
                  Decline
                </Button>
              </div>
            </div>

            <Separator className="bg-zinc-700" />

            <div className="space-y-3">
              <h3 className="font-semibold text-white text-sm">Decline reasons:</h3>
              
              <Button
                variant="outline"
                className="w-full justify-start text-left p-4 h-auto border-zinc-700 hover:bg-zinc-800"
                onClick={() => handleDeclineRole("I can't do it")}>
                <div>
                  <div className="font-medium text-sm text-white">
                    I can&apos;t do this type of work
                  </div>
                  <div className="text-xs text-zinc-500">
                    This task is outside my expertise
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-left p-4 h-auto border-zinc-700 hover:bg-zinc-800"
                onClick={() => handleDeclineRole("Not available")}>
                <div>
                  <div className="font-medium text-sm text-white">I&apos;m not available</div>
                  <div className="text-xs text-zinc-500">
                    I don&apos;t have time for this project
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-left p-4 h-auto border-zinc-700 hover:bg-zinc-800"
                onClick={() => handleDeclineRole("Other reason")}>
                <div>
                  <div className="font-medium text-sm text-white">Other reason</div>
                  <div className="text-xs text-zinc-500">
                    I have a different concern
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;