// app/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Event {
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
  registered: number;
}

interface Announcement {
  title: string;
  description: string;
  postedBy: string;
  date: string;
  icon: string;
}

interface Activity {
  icon: string;
  text: string;
  time: string;
  bgColor: string;
}

export default function ClubDashboard() {
  const [stats] = useState({
    totalMembers: 247,
    activeEvents: 8,
    totalProjects: 12,
  });

  const events: Event[] = [
    {
      day: '25',
      month: 'NOV',
      title: 'Web Development Workshop',
      time: '2:00 PM - 5:00 PM',
      location: 'Lab 301',
      registered: 45,
    },
    {
      day: '28',
      month: 'NOV',
      title: 'AI & Machine Learning Seminar',
      time: '4:00 PM - 6:00 PM',
      location: 'Main Hall',
      registered: 92,
    },
    {
      day: '02',
      month: 'DEC',
      title: 'Hackathon 2025 Kickoff',
      time: '9:00 AM - 9:00 PM',
      location: 'Innovation Center',
      registered: 120,
    },
    {
      day: '05',
      month: 'DEC',
      title: 'Career Fair & Networking',
      time: '1:00 PM - 5:00 PM',
      location: 'Campus Plaza',
      registered: 68,
    },
  ];

  const announcements: Announcement[] = [
    {
      title: 'New Partnership with Tech Giant',
      description: 'Excited to announce our collaboration with a leading tech company for exclusive workshops and internship opportunities.',
      postedBy: 'Sarah Ahmed',
      date: 'Nov 20, 2025',
      icon: '🤝',
    },
    {
      title: 'Hackathon Registration Now Open',
      description: 'Registration for our annual hackathon is live! Limited spots available. Early bird discount ends this week.',
      postedBy: 'Mohammed Kante',
      date: 'Nov 18, 2025',
      icon: '💻',
    },
    {
      title: 'New Lab Equipment Acquired',
      description: 'Our innovation lab has been upgraded with state-of-the-art VR headsets and 3D printers for all members to use.',
      postedBy: 'Layla Benali',
      date: 'Nov 15, 2025',
      icon: '🎯',
    },
    {
      title: 'Member Spotlight Program Launch',
      description: 'Starting next month, we will feature outstanding members and their projects on our social media channels.',
      postedBy: 'Sarah Ahmed',
      date: 'Nov 12, 2025',
      icon: '⭐',
    },
    {
      title: 'Winter Break Schedule Announced',
      description: 'Club activities will resume on January 8th. Office hours during break will be Monday and Wednesday 10AM-2PM.',
      postedBy: 'Mohammed Kante',
      date: 'Nov 10, 2025',
      icon: '❄️',
    },
  ];

  const activities: Activity[] = [
    {
      icon: '✅',
      text: '<strong>Sarah Ahmed</strong> approved the budget for the upcoming hackathon event',
      time: '2 hours ago',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: '👥',
      text: '<strong>15 new members</strong> joined the club this week',
      time: '5 hours ago',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: '📋',
      text: '<strong>Layla Benali</strong> posted a new workshop schedule for December',
      time: '1 day ago',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      icon: '🎉',
      text: '<strong>Web Development Workshop</strong> reached full capacity (50 attendees)',
      time: '2 days ago',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: '💰',
      text: '<strong>Budget report</strong> submitted for Q4 2025',
      time: '3 days ago',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  const eventsData = [
    { month: 'Jan', events: 3 },
    { month: 'Feb', events: 5 },
    { month: 'Mar', events: 4 },
    { month: 'Apr', events: 6 },
    { month: 'May', events: 5 },
    { month: 'Jun', events: 7 },
    { month: 'Jul', events: 6 },
    { month: 'Aug', events: 8 },
    { month: 'Sep', events: 7 },
    { month: 'Oct', events: 9 },
    { month: 'Nov', events: 8 },
  ];

  const exportReport = () => {
    const reportData = {
      clubName: 'University Tech Club',
      reportDate: new Date().toLocaleDateString(),
      statistics: stats,
      upcomingEvents: events,
      announcements: announcements,
    };

    let csvContent = 'University Tech Club - Dashboard Report\n';
    csvContent += `Generated: ${reportData.reportDate}\n\n`;
    
    csvContent += 'CLUB STATISTICS\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Total Members,${reportData.statistics.totalMembers}\n`;
    csvContent += `Active Events,${reportData.statistics.activeEvents}\n`;
    csvContent += `Total Projects,${reportData.statistics.totalProjects}\n\n`;
    
    csvContent += 'UPCOMING EVENTS\n';
    csvContent += 'Date,Event Title,Time,Location,Registered\n';
    events.forEach(event => {
      csvContent += `${event.day} ${event.month},"${event.title}",${event.time},${event.location},${event.registered}\n`;
    });
    
    csvContent += '\nLATEST ANNOUNCEMENTS\n';
    csvContent += 'Title,Description,Posted By,Date\n';
    announcements.forEach(announcement => {
      csvContent += `"${announcement.title}","${announcement.description}",${announcement.postedBy},${announcement.date}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `club-dashboard-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#fcfcf9] dark:bg-[#1f2121]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-[#13343b] dark:text-[#f5f5f5] mb-2">
                University Tech Club
              </h1>
              <p className="text-base text-[#626c71] dark:text-[#a7a9a9]/70">
                Dashboard Overview - November 2025
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={exportReport}
                className="bg-[rgba(94,82,64,0.12)] hover:bg-[rgba(94,82,64,0.2)] dark:bg-[rgba(119,124,124,0.15)] dark:hover:bg-[rgba(119,124,124,0.25)] border-0"
              >
                Export Report
              </Button>
              <Button className="bg-[#21808d] hover:bg-[#1d7480] dark:bg-[#32b8c6] dark:hover:bg-[#2da6b2] text-white">
                + New Event
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card className="bg-[#fffffd] dark:bg-[#262828] border-[rgba(94,82,64,0.12)] dark:border-[rgba(119,124,124,0.2)]">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="text-xs font-medium text-[#626c71] dark:text-[#a7a9a9]/70 uppercase tracking-wide">
                Total Members
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(59,130,246,0.08)] dark:bg-[rgba(29,78,216,0.15)] flex items-center justify-center text-lg">
                👥
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-[#13343b] dark:text-[#f5f5f5] mb-1">
                {stats.totalMembers}
              </div>
              <p className="text-xs text-[#626c71] dark:text-[#a7a9a9]/70">Club members</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fffffd] dark:bg-[#262828] border-[rgba(94,82,64,0.12)] dark:border-[rgba(119,124,124,0.2)]">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="text-xs font-medium text-[#626c71] dark:text-[#a7a9a9]/70 uppercase tracking-wide">
                Active Events
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.08)] dark:bg-[rgba(180,83,9,0.15)] flex items-center justify-center text-lg">
                📅
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-[#13343b] dark:text-[#f5f5f5] mb-1">
                {stats.activeEvents}
              </div>
              <p className="text-xs text-[#626c71] dark:text-[#a7a9a9]/70">Upcoming events</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fffffd] dark:bg-[#262828] border-[rgba(94,82,64,0.12)] dark:border-[rgba(119,124,124,0.2)]">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="text-xs font-medium text-[#626c71] dark:text-[#a7a9a9]/70 uppercase tracking-wide">
                Total Projects
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.08)] dark:bg-[rgba(21,128,61,0.15)] flex items-center justify-center text-lg">
                💻
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-[#13343b] dark:text-[#f5f5f5] mb-1">
                {stats.totalProjects}
              </div>
              <p className="text-xs text-[#626c71] dark:text-[#a7a9a9]/70">Active initiatives</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Quick Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events This Year Chart */}
          <Card className="bg-[#fffffd] dark:bg-[#262828] border-[rgba(94,82,64,0.12)] dark:border-[rgba(119,124,124,0.2)]">
            <CardHeader>
              <CardTitle>Events This Year</CardTitle>
              <CardDescription>Monthly event count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eventsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(94, 82, 64, 0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#626c71"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#626c71"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(31, 33, 33, 0.9)',
                      border: '1px solid rgba(33, 128, 141, 0.3)',
                      borderRadius: '8px',
                      color: '#f5f5f5'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="events" 
                    stroke="#21808d" 
                    strokeWidth={2}
                    dot={{ fill: '#21808d', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Latest Announcements */}
          <Card className="bg-[#fffffd] dark:bg-[#262828] border-[rgba(94,82,64,0.12)] dark:border-[rgba(119,124,124,0.2)]">
            <CardHeader>
              <CardTitle>Latest Announcements</CardTitle>
              <CardDescription>Recent club news and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                {announcements.slice(0, 5).map((announcement, index) => (
                  <div
                    key={index}
                    className="p-3 bg-[#fcfcf9] dark:bg-[#1f2121] rounded-lg border border-[rgba(94,82,64,0.2)] dark:border-[rgba(119,124,124,0.3)]"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="text-xl flex-shrink-0">{announcement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#13343b] dark:text-[#f5f5f5] mb-1 line-clamp-1">
                          {announcement.title}
                        </h3>
                        <p className="text-xs text-[#626c71] dark:text-[#a7a9a9]/70 mb-2 line-clamp-2 leading-relaxed">
                          {announcement.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-[#626c71] dark:text-[#a7a9a9]/70">
                          <span className="font-medium">By {announcement.postedBy}</span>
                          <span>{announcement.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-[#fffffd] dark:bg-[#262828] border-[rgba(94,82,64,0.12)] dark:border-[rgba(119,124,124,0.2)] mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access key sections quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="w-full justify-start h-auto py-4 bg-[#21808d] hover:bg-[#1d7480] dark:bg-[#32b8c6] dark:hover:bg-[#2da6b2] text-white"
                onClick={() => console.log('View Events clicked')}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="text-2xl">📅</div>
                  <div className="text-left">
                    <div className="font-semibold">View Events</div>
                    <div className="text-xs opacity-90">Browse all upcoming activities</div>
                  </div>
                </div>
              </Button>

              <Button 
                className="w-full justify-start h-auto py-4 bg-[#a84b2f] hover:bg-[#8f3f28] dark:bg-[#e68161] dark:hover:bg-[#d47050] text-white"
                onClick={() => console.log('View Announcements clicked')}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="text-2xl">📢</div>
                  <div className="text-left">
                    <div className="font-semibold">View Announcements</div>
                    <div className="text-xs opacity-90">Read latest club updates</div>
                  </div>
                </div>
              </Button>

              <Button 
                className="w-full justify-start h-auto py-4 bg-[#626c71] hover:bg-[#525a5f] dark:bg-[#777c7c] dark:hover:bg-[#666b6b] text-white"
                onClick={() => console.log('View Projects clicked')}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="text-2xl">💻</div>
                  <div className="text-left">
                    <div className="font-semibold">View Projects</div>
                    <div className="text-xs opacity-90">Explore ongoing initiatives</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-[#fffffd] dark:bg-[#262828] border-[rgba(94,82,64,0.12)] dark:border-[rgba(119,124,124,0.2)] mb-8">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next club activities and workshops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-[#fcfcf9] dark:bg-[#1f2121] rounded-lg border border-[rgba(94,82,64,0.2)] dark:border-[rgba(119,124,124,0.3)]"
                >
                  <div className="flex-shrink-0 w-[60px] h-[60px] bg-[#21808d] dark:bg-[#32b8c6] text-[#fcfcf9] rounded-lg flex flex-col items-center justify-center">
                    <div className="text-xl font-semibold leading-none">{event.day}</div>
                    <div className="text-[11px] uppercase mt-1">{event.month}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#13343b] dark:text-[#f5f5f5] mb-1">
                      {event.title}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-[#626c71] dark:text-[#a7a9a9]/70">
                      <span className="flex items-center gap-1">🕐 {event.time}</span>
                      <span className="flex items-center gap-1">📍 {event.location}</span>
                      <span className="flex items-center gap-1">👥 {event.registered} registered</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#fffffd] dark:bg-[#262828] border-[rgba(94,82,64,0.12)] dark:border-[rgba(119,124,124,0.2)]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and club activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className={`flex gap-4 pb-4 ${
                    index !== activities.length - 1 ? 'border-b border-[rgba(94,82,64,0.2)] dark:border-[rgba(119,124,124,0.3)]' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div 
                      className="text-sm text-[#13343b] dark:text-[#f5f5f5] mb-1" 
                      dangerouslySetInnerHTML={{ __html: activity.text }} 
                    />
                    <div className="text-[11px] text-[#626c71] dark:text-[#a7a9a9]/70">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Install these dependencies:
// npx shadcn@latest add card button badge
// npm install recharts

// tailwind.config.ts
// import type { Config } from "tailwindcss";

// const config: Config = {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [require("tailwindcss-animate")],
// };
// export default config;