'use client';
import React, { useState, useMemo } from 'react';

// UI Components
// import { Button } from '@/components/ui/button';
import  CardGrid from '@/components/ui/cardGrid';
import PageHeader  from '@/components/ui/pageHeader';

// Types
import { LibraryItem, User } from '@/types';

// Components
import  LibraryCard from '@/components/library/library';
import LibraryFilters from '@/components/library/libraryFilter';
import LibraryUploadDialog from '@/components/library/libraryUploadDialog';

interface LibraryPageProps {
  currentUser: User;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const mockItems: LibraryItem[] = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      description: 'Comprehensive textbook on algorithms and data structures lorem ipsum dolor sit amet consectetur adipiscing elit lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      type: 'BOOK',
      url: 'https://blog-cdn.reedsy.com/directories/gallery/248/large_65b0ae90317f7596d6f95bfdd6131398.jpg',
      createdById: 1,
      thumbnail: 'https://blog-cdn.reedsy.com/directories/gallery/248/large_65b0ae90317f7596d6f95bfdd6131398.jpg',
      createdBy: currentUser,
      createdAt: new Date('2024-11-01'),
      isPublic: true
    },
    {
      id: 2,
      title: 'React Conference 2024',
      description: 'Full recording of the annual React conference keynote',
      type: 'VIDEO',
      url: 'https://example.com/video',
      thumbnail: 'https://example.com/video-thumbnail.jpg',
      createdById: 1,
      createdBy: currentUser,
      createdAt: new Date('2024-11-15'),
      isPublic: true
    },
    {
      id: 3,
      title: 'Software Engineering Journal',
      description: 'Latest research in software engineering practices',
      type: 'JOURNAL',
      thumbnail: 'https://example.com/journal-thumbnail.jpg',
      createdById: 1,
      createdBy: currentUser,
      createdAt: new Date('2024-10-20'),
      isPublic: true
    },
    {
      id: 4,
      title: 'Podcast: Tech Trends 2024',
      description: 'Discussion on emerging technology trends for the coming year',
      type: 'AUDIO',
      thumbnail: 'https://example.com/audio-thumbnail.jpg',
      url: 'https://example.com/audio',
      createdById: 1,
      createdBy: currentUser,
      createdAt: new Date('2024-11-10'),
      isPublic: true
    },
    {
      id: 5,
      title: 'Design System Guidelines',
      description: 'Comprehensive guide to our design system and components',
      thumbnail: 'https://example.com/other-thumbnail.jpg',
      type: 'OTHER',
      createdById: 1,
      createdBy: currentUser,
      createdAt: new Date('2024-10-05'),
      isPublic: false
    }
  ];

  const filteredItems = useMemo(() => {
    return mockItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      
      const matchesVisibility = visibilityFilter === 'all' || 
                               (visibilityFilter === 'public' && item.isPublic) ||
                               (visibilityFilter === 'private' && !item.isPublic);
      
      return matchesSearch && matchesType && matchesVisibility;
    });
  }, [searchQuery, typeFilter, visibilityFilter]);

  const handleUpload = (newItem: any) => {
    console.log('Uploading new item:', newItem);
    // Add to your state or send to API
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader 
        title="Library" 
        description="Resource collection and materials"
        action={
          <LibraryUploadDialog onUpload={handleUpload} />
        }
      />
      
      <LibraryFilters
        onSearch={setSearchQuery}
        onTypeFilter={setTypeFilter}
        onVisibilityFilter={setVisibilityFilter}
      />

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No resources found matching your criteria.</p>
        </div>
      ) : (
        <CardGrid columns={3}>
          {filteredItems.map(item => (
            <LibraryCard 
              key={item.id} 
              item={item} 
              currentUser={currentUser} 
            />
          ))}
        </CardGrid>
      )}
    </div>
  );
};

export default LibraryPage;