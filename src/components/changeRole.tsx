"use client";
import { useState, useEffect } from 'react';
import { Search, Shield, Users} from 'lucide-react';
import { User as userTp } from '@/types';
interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
}
import AlertDialogDestructiveDemo from '@/components/globalAlert';
import { useRouter } from 'next/navigation';
const roles = [
  { value: 'member', label: 'Member', description: 'Basic club access' },
  { value: 'contributor', label: 'Contributor', description: 'Can create content' },
  { value: 'moderator', label: 'Moderator', description: 'Can moderate content' },
  { value: 'manager', label: 'Manager', description: 'Can manage members' },
  { value: 'admin', label: 'Admin', description: 'Full system access' }
];

export default function UserManagement({user, userRole}: {user: userTp, userRole: string}) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const [alert, setAlert] = useState<{trigger: boolean; message: string; color: string , description: string}>({trigger: false, message: '', color: '', description: ''});

  const router = useRouter();
  useEffect(() => {
    if (!user
       || (userRole !== 'admin')
      ) {
      router.push('unauthorized');
    }
  }, [user, userRole, router]);

  useEffect(() => {
    // Mock data - replace with actual API call
  const fetchUsers = async () => {
      try {
        const response = await fetch('/api/list-users', { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await user?.getIdToken()}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users.map((u: User) => ({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName || 'member',    
            role: u.role || 'member',
            createdAt: new Date(u.createdAt).toISOString().split('T')[0]
          })));
        } else {
          console.error('Failed to fetch users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

      fetchUsers(); 
    
    
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);

    try {
          const response = await fetch('/api/assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: userId, role: newRole })
      });

      if (response.ok) {
      setUsers(users.map(u => u.uid === userId ? { ...u, role: newRole } : u));
      setAlert({trigger: true, message: 'success updating role', color: 'green', description: `Role updated successfully. User will see changes on next login.`});
         } else {
      setAlert({trigger: true, message: 'error updating role', color: 'red', description: 'Failed to update role Please try again.'});
  }
    } catch (error) {
      console.error('Error updating role:', error);
      setAlert({trigger: true, message: 'error updating role', color: 'red', description: 'Failed to update role due to server error. Please try again.'});
    } finally {
      setUpdating(null);
    }
  };


  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleInfo = (roleValue: string) => roles.find(r => r.value === roleValue) || roles[0];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <Shield className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">User Management</h1>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 ml-14">Manage user roles and permissions for your club</p>
        </div>

        {/* Notification */}
        {alert.trigger && (
          <AlertDialogDestructiveDemo 
            message={alert.message} 
            color={alert.color}
            description={alert.description}
            open={alert.trigger}
            onOpenChange={() => setAlert({trigger: false, message: '', color: '', description: ''})}
          />
        )}

        {/* Filters */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 transition-all text-neutral-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 transition-all appearance-none cursor-pointer text-neutral-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">Total Users</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{users.length}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">Filtered</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{filteredUsers.length}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">Admins</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{users.filter(u => u.role === 'admin').length}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">Members</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{users.filter(u => u.role === 'member').length}</p>
          </div>
        </div>
        {/* Users Table */}
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-600 dark:text-neutral-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left p-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">User</th>
                    <th className="text-left p-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email</th>
                    <th className="text-left p-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Role</th>
                    <th className="text-left p-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Joined</th>
                    <th className="text-left p-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Role</th>
                    {userRole === null && (<th className="text-left p-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Action</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const roleInfo = getRoleInfo(user.role);
                    const isUpdating = updating === user.uid;

                    return (
                      <tr key={user.uid} className="border-b border-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-700 hover:bg-neutral-100 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-semibold text-neutral-700 dark:text-neutral-300">
                              {user.displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-neutral-900 dark:text-white">{user.displayName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-neutral-600 dark:text-neutral-400">{user.email}</td>
                        <td className="p-4">
                          <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                            {roleInfo.label}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-600 dark:text-neutral-400 text-sm">{user.createdAt}</td>
                      
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                              disabled={isUpdating}
                              className="px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-900 dark:text-white cursor-pointer"
                            >
                              {roles.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                              ))}
                            </select>
                            {isUpdating && (
                              <div className="w-4 h-4 border-2 border-neutral-300 dark:border-neutral-600 border-t-neutral-600 dark:border-t-neutral-300 rounded-full animate-spin" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-neutral-700 dark:text-neutral-300 text-xs font-bold">i</span>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            Role changes take effect immediately, but users may need to refresh their session to see updated permissions.
          </p>
        </div>
      </div>
    </div>
  );
}