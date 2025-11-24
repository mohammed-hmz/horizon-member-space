import ProjectCard from '@/components/club-projects/projects-list';
import { Project } from '@/components/club-projects/projects-list';

 
 const projects: Project[] = [
  {
    id: "proj-1",
    title: "E-Commerce Platform Redesign",
    description: "Complete overhaul of the e-commerce platform with modern UI/UX, improved checkout flow, and mobile optimization",
    status: "inprogress",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (NEW)
    category: "web development",
    members: [
      { uid: "user1", name: "John Doe", role: "Project Manager" },
      { uid: "user2", name: "Jane Smith", role: "Frontend Developer" },
      { uid: "user3", name: "Mike Johnson", role: "UI/UX Designer" },
      { uid: "user4", name: "Sarah Wilson", role: "Backend Developer" }
    ],
    tasks: [
      {
        id: "task-1",
        title: "Design Homepage Mockup",
        description: "Create initial design concepts for the new homepage with focus on user engagement",
        assignedTo: "user3",
        assignedToName: "Mike Johnson",
        completed: false,
        completedAt: null,
        priority: "high"
      },
      {
        id: "task-2",
        title: "Setup Development Environment",
        description: "Configure Next.js project with TypeScript, Tailwind, and testing framework",
        assignedTo: "user2",
        assignedToName: "Jane Smith",
        completed: true,
        completedAt: new Date(),
        priority: "medium"
      },
      {
        id: "task-3",
        title: "Review Project Requirements",
        description: "Go through all stakeholder requirements and document them properly",
        assignedTo: "user1",
        assignedToName: "John Doe",
        completed: false,
        completedAt: null,
        priority: "high"
      },
      {
        id: "task-4",
        title: "API Integration Planning",
        description: "Plan the backend API architecture and endpoints",
        assignedTo: "user4",
        assignedToName: "Sarah Wilson",
        completed: false,
        completedAt: null,
        priority: "medium"
      }
    ],
    notifications: [
      {
        id: "notif-1",
        message: "New task 'Design Homepage Mockup' has been assigned to Mike Johnson",
        taskId: "task-1",
        createdAt: new Date(),
        readBy: []
      },
      {
        id: "notif-2",
        message: "Jane Smith completed 'Setup Development Environment'",
        taskId: "task-2",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        readBy: ["user2"]
      },
      {
        id: "notif-3",
        message: "Project deadline updated to next month",
        taskId: "task-1",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        readBy: ["user1", "user2"]
      }
    ]
  },
  {
    id: "proj-2",
    title: "Mobile App Development",
    description: "Build iOS and Android apps for customer engagement with real-time notifications and offline support",
    status: "active",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    category: "mobile",
    members: [
      { uid: "user1", name: "John Doe", role: "Lead Developer" },
      { uid: "user4", name: "Sarah Wilson", role: "QA Engineer" },
      { uid: "user5", name: "David Lee", role: "Mobile Developer" }
    ],
    tasks: [
      {
        id: "task-5",
        title: "API Integration",
        description: "Connect mobile app to backend services with authentication",
        assignedTo: "user1",
        assignedToName: "John Doe",
        completed: false,
        completedAt: null,
        priority: "high"
      },
      {
        id: "task-6",
        title: "Write Test Cases",
        description: "Create comprehensive test suite for all features",
        assignedTo: "user4",
        assignedToName: "Sarah Wilson",
        completed: false,
        completedAt: null,
        priority: "medium"
      },
      {
        id: "task-7",
        title: "Push Notifications Setup",
        description: "Implement Firebase Cloud Messaging for push notifications",
        assignedTo: "user5",
        assignedToName: "David Lee",
        completed: true,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priority: "high"
      }
    ],
    notifications: [
      {
        id: "notif-4",
        message: "Project milestone: Development phase started",
        taskId: "task-5",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        readBy: []
      },
      {
        id: "notif-5",
        message: "David Lee completed 'Push Notifications Setup'",
        taskId: "task-7",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        readBy: ["user5"]
      }
    ]
  },
  {
    id: "proj-3",
    title: "Brand Identity Design",
    description: "Create comprehensive brand identity including logo, color palette, typography, and brand guidelines",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (NEW)
    category: "design",
    members: [
      { uid: "user3", name: "Mike Johnson", role: "Lead Designer" },
      { uid: "user6", name: "Emily Brown", role: "Graphic Designer" }
    ],
    tasks: [
      {
        id: "task-8",
        title: "Logo Concepts",
        description: "Create 5 different logo concepts for client review",
        assignedTo: "user3",
        assignedToName: "Mike Johnson",
        completed: false,
        completedAt: null,
        priority: "high"
      },
      {
        id: "task-9",
        title: "Color Palette Research",
        description: "Research and propose color schemes based on brand personality",
        assignedTo: "user6",
        assignedToName: "Emily Brown",
        completed: false,
        completedAt: null,
        priority: "medium"
      },
      {
        id: "task-10",
        title: "Brand Guidelines Document",
        description: "Compile all brand elements into a comprehensive guidelines document",
        assignedTo: "user3",
        assignedToName: "Mike Johnson",
        completed: false,
        completedAt: null,
        priority: "low"
      }
    ],
    notifications: [
      {
        id: "notif-6",
        message: "Client feedback received on initial concepts",
        taskId: "task-8",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        readBy: []
      }
    ]
  },
  {
    id: "proj-4",
    title: "Marketing Campaign Q4",
    description: "Launch comprehensive digital marketing campaign across social media, email, and paid advertising channels",
    status: "onhold",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    category: "marketing",
    members: [
      { uid: "user7", name: "Alex Martinez", role: "Marketing Manager" },
      { uid: "user8", name: "Lisa Chen", role: "Content Creator" },
      { uid: "user1", name: "John Doe", role: "Data Analyst" }
    ],
    tasks: [
      {
        id: "task-11",
        title: "Social Media Content Calendar",
        description: "Plan and schedule social media posts for the next quarter",
        assignedTo: "user8",
        assignedToName: "Lisa Chen",
        completed: true,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        priority: "medium"
      },
      {
        id: "task-12",
        title: "Campaign Analytics Setup",
        description: "Configure tracking and analytics for all campaign channels",
        assignedTo: "user1",
        assignedToName: "John Doe",
        completed: false,
        completedAt: null,
        priority: "high"
      },
      {
        id: "task-13",
        title: "Email Marketing Templates",
        description: "Design and code responsive email templates",
        assignedTo: "user8",
        assignedToName: "Lisa Chen",
        completed: false,
        completedAt: null,
        priority: "medium"
      }
    ],
    notifications: [
      {
        id: "notif-7",
        message: "Project on hold pending budget approval",
        taskId: "task-12",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        readBy: ["user7"]
      },
      {
        id: "notif-8",
        message: "Lisa Chen completed 'Social Media Content Calendar'",
        taskId: "task-11",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        readBy: ["user8", "user7"]
      }
    ]
  },
  {
    id: "proj-5",
    title: "Data Analytics Dashboard",
    description: "Build real-time analytics dashboard with data visualization, custom reports, and export functionality",
    status: "completed",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    category: "data",
    members: [
      { uid: "user1", name: "John Doe", role: "Data Engineer" },
      { uid: "user2", name: "Jane Smith", role: "Frontend Developer" },
      { uid: "user9", name: "Robert Taylor", role: "Data Scientist" }
    ],
    tasks: [
      {
        id: "task-14",
        title: "Database Schema Design",
        description: "Design optimized database schema for analytics data",
        assignedTo: "user1",
        assignedToName: "John Doe",
        completed: true,
        completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        priority: "high"
      },
      {
        id: "task-15",
        title: "Dashboard UI Development",
        description: "Build responsive dashboard interface with charts and graphs",
        assignedTo: "user2",
        assignedToName: "Jane Smith",
        completed: true,
        completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        priority: "high"
      },
      {
        id: "task-16",
        title: "Predictive Models",
        description: "Develop machine learning models for trend prediction",
        assignedTo: "user9",
        assignedToName: "Robert Taylor",
        completed: true,
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        priority: "medium"
      }
    ],
    notifications: [
      {
        id: "notif-9",
        message: "Project successfully completed and deployed",
        taskId: "task-16",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        readBy: ["user1", "user2", "user9"]
      }
    ]
  },
  {
    id: "proj-6",
    title: "Customer Support Portal",
    description: "Develop self-service customer support portal with ticketing system, knowledge base, and live chat",
    status: "inprogress",
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago (NEW)
    category: "web development",
    members: [
      { uid: "user2", name: "Jane Smith", role: "Full Stack Developer" },
      { uid: "user4", name: "Sarah Wilson", role: "Backend Developer" },
      { uid: "user3", name: "Mike Johnson", role: "UI/UX Designer" },
      { uid: "user1", name: "John Doe", role: "Technical Lead" }
    ],
    tasks: [
      {
        id: "task-17",
        title: "Ticketing System Backend",
        description: "Implement RESTful API for ticket creation, updates, and management",
        assignedTo: "user4",
        assignedToName: "Sarah Wilson",
        completed: false,
        completedAt: null,
        priority: "high"
      },
      {
        id: "task-18",
        title: "Knowledge Base UI",
        description: "Design and implement searchable knowledge base interface",
        assignedTo: "user2",
        assignedToName: "Jane Smith",
        completed: false,
        completedAt: null,
        priority: "medium"
      },
      {
        id: "task-19",
        title: "Live Chat Integration",
        description: "Integrate third-party live chat service",
        assignedTo: "user1",
        assignedToName: "John Doe",
        completed: false,
        completedAt: null,
        priority: "high"
      },
      {
        id: "task-20",
        title: "User Interface Design",
        description: "Create wireframes and high-fidelity mockups",
        assignedTo: "user3",
        assignedToName: "Mike Johnson",
        completed: true,
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        priority: "high"
      }
    ],
    notifications: [
      {
        id: "notif-10",
        message: "Mike Johnson completed 'User Interface Design'",
        taskId: "task-20",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        readBy: ["user3"]
      },
      {
        id: "notif-11",
        message: "Sprint planning meeting scheduled for tomorrow",
        taskId: "task-17",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        readBy: []
      },
      {
        id: "notif-12",
        message: "New high-priority task assigned",
        taskId: "task-19",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        readBy: []
      }
    ]
  }
];

  // if (projects === undefined) {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
  //       <Loader size={40} />
  //     </div>
  //   );
  // }
export default function App() {
  if (projects.length === 0) {
    return <div className="p-6 text-muted-foreground">No projects found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
