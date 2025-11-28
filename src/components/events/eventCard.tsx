"use client";
import React, { useState } from 'react';
import { Card, CardContent,  CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Edit, Link, Download } from 'lucide-react';
import { Event, User } from '@/types';
import UserAvatar  from '@/components/ui/userAvatar';
import Image from 'next/image';
interface EventCardProps {
  event: Event;
  currentUser: User;
}

const EventCard: React.FC<EventCardProps> = ({ event, currentUser }) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden" onClick={() => setSheetOpen(true)}>
        <CardHeader className="pb-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white">
             { event.thumbnail ? (
                <Image 
                  src={event.thumbnail} 
                  alt={event.title} 
                  width={80} 
                  height={80} 
                  className="rounded-xl object-cover"
                />
              ) : (
                <Calendar className="h-10 w-10" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-xl truncate">{event.title}</CardTitle>
                <Badge variant={event.isPublic ? 'default' : 'secondary'}>
                  {event.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(event.startAt).toLocaleString()}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description || 'No description'}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <UserAvatar user={event.createdBy} size="sm" />
            <span className="text-sm text-muted-foreground">{(event.createdBy as any)?.displayName ?? (event.createdBy as any)?.name ?? 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{event.attendeesCount || 0}</span>
            <Button size="sm" className="ml-2" onClick={(e) => { e.stopPropagation(); }}>
              Register
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full p-4 sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-cyan-500 -mx-6 -mt-6 mb-6 flex items-center justify-center">
                      { event.thumbnail ? (
                <Image 
                  src={event.thumbnail} 
                  alt={event.title} 
                  width={192} 
                  height={192} 
                  className="rounded-xl object-cover"
                />
              ) : (
                <Calendar className="h-10 w-10" />
              )}
            </div>
            <SheetTitle className="text-3xl">{event.title}</SheetTitle>
            <SheetDescription>
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(event.startAt).toLocaleString()}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-muted-foreground">{event.description || 'No description available'}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Organizer</h4>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <UserAvatar user={event.createdBy} />
                <div>
                  <p className="font-medium">{(event.createdBy as any)?.displayName ?? (event.createdBy as any)?.name ?? 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{(event.createdBy as any)?.email ?? 'Unknown'}</p>
                </div>
              </div>
            </div>

            {event.maxAttendees && (
              <div>
                <h4 className="font-semibold mb-2">Capacity</h4>
                <p className="text-muted-foreground">{event.attendeesCount || 0} / {event.maxAttendees} attendees</p>
              </div>
            )}

            <div className="space-y-2">
              <Button className="w-full" size="lg">Register for Event</Button>
              <Button variant="outline" className="w-full">
                <Edit className="h-4 w-4 mr-2" /> Edit Event
              </Button>
              {event.form && (
                <Button variant="outline" className="w-full">
                  <Link className="h-4 w-4 mr-2" /> View Registration Form
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" /> Export Attendees
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EventCard;