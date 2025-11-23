"use client";
import UserManagement from '@/components/changeRole';
import { useAuth } from '@/context/AuthContext';

export default function ManageUsersPage() {
  // For demonstration, passing dummy user and role
  const { user, userRole } = useAuth();
  if (user && userRole === 'admin') {
  return <UserManagement userRole={userRole} />;
}
}