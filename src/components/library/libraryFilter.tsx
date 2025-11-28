'use client'
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface LibraryFiltersProps {
  onSearch: (query: string) => void;
  onTypeFilter: (type: string) => void;
  onVisibilityFilter: (visibility: string) => void;
}

const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  onSearch,
  onTypeFilter,
  onVisibilityFilter,
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search library..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <Select onValueChange={onTypeFilter}>
        <SelectTrigger className="w-32">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="BOOK">Books</SelectItem>
          <SelectItem value="VIDEO">Videos</SelectItem>
          <SelectItem value="JOURNAL">Journals</SelectItem>
          <SelectItem value="AUDIO">Audio</SelectItem>
          <SelectItem value="OTHER">Other</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={onVisibilityFilter}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Items</SelectItem>
          <SelectItem value="public">Public Only</SelectItem>
          <SelectItem value="private">Private Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LibraryFilters;