'use client';
import React from 'react';

// UI Components
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Custom Components
import UserAvatar from '../ui/userAvatar';
import DeleteDialog from '../ui/deleteDialoge';

// Types
import { LibraryItem, User, LibraryType } from '@/types';

// Icons
import { BookOpen, FileText, Video, Activity, ExternalLink, Edit } from 'lucide-react';
import Image from 'next/image';

interface LibraryCardProps {
  item: LibraryItem;
  currentUser: User;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ item, currentUser }) => {
  const typeIcons: Record<LibraryType, any> = {
    BOOK: BookOpen,
    JOURNAL: FileText,
    VIDEO: Video,
    AUDIO: Activity,
    OTHER: FileText
  };

  const typeColors: Record<LibraryType, string> = {
    BOOK: 'from-amber-400 to-orange-500',
    JOURNAL: 'from-blue-400 to-indigo-500',
    VIDEO: 'from-red-400 to-pink-500',
    AUDIO: 'from-purple-400 to-violet-500',
    OTHER: 'from-gray-400 to-slate-500'
  };

  const Icon = typeIcons[item.type];

  return (
    <Card className="group hover:shadow-lg transition-all overflow-hidden">
      <div className={`h-48 bg-gradient-to-br ${typeColors[item.type]} flex items-center justify-center relative`}>
        {item.thumbnail ? (
          Image ? (
            <Image 
              src={item.thumbnail}
                alt={item.title}
                width={192}
                height={192}
                className="object-cover h-48 w-full"
            />
          ) : (
            <Icon className="h-20 w-20 text-white opacity-30" />
          )
        ) : (
          <Icon className="h-20 w-20 text-white opacity-30" />
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-gray-900">{item.type}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
        <CardDescription className="line-clamp-2">{item.description || 'No description'}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserAvatar user={item.createdBy} size="sm" />
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex gap-1">
          {item.url && (
            <Button size="sm" variant="outline" asChild>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <DeleteDialog title="Delete Item" description="This will permanently delete this library item." onConfirm={() => {}} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default LibraryCard;