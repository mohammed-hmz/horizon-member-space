import React from 'react';

// UI Components
import { Button } from '@/components/ui/button';
import  CardGrid from '@/components/ui/cardGrid';
import PageHeader  from '@/components/ui/pageHeader';

// Types
import { Event, User } from '@/types';

// Components
import  EventCard  from '@/components/events/eventCard';

// Icons
import { Plus } from 'lucide-react';

interface EventsPageProps {
  currentUser: User;
}

const EventsPage: React.FC<EventsPageProps> = ({ currentUser }) => {
  const mockEvents: Event[] = [
    {
      id: 1,
      title: 'Tech Talk: AI in Education',
      description: 'Join us for an insightful discussion on how artificial intelligence is transforming education',
      location: 'Main Auditorium',
      thumbnail: 'https://example.com/thumbnails/ai-education.jpg',
      createdById: 1,
      createdBy: currentUser,
      startAt: new Date('2024-12-15T18:00:00'),
      isPublic: true,
      maxAttendees: 100,
      attendeesCount: 45
    },
    {
      id: 2,
      title: 'Workshop: React Best Practices',
      description: 'Hands-on workshop covering modern React development patterns and techniques',
      location: 'Computer Lab 3',
        thumbnail: 'https://example.com/thumbnails/react-workshop.jpg',
      createdById: 1,
      createdBy: currentUser,
      startAt: new Date('2024-12-20T14:00:00'),
      endAt: new Date('2024-12-20T17:00:00'),
      isPublic: true,
      attendeesCount: 28
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader 
        title="Events" 
        description="Upcoming club events and activities"
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" /> 
            Create Event
          </Button>
        }
      />
      <CardGrid columns={2}>
        {mockEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            currentUser={currentUser} 
          />
        ))}
      </CardGrid>
    </div>
  );
};

export default EventsPage;