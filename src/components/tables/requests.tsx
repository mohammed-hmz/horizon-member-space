"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Hash, MessageSquare, Calendar } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase/config";
import AlertDialogDestructiveDemo from "../globalAlert";
export interface UserRequest {
  id: string;
  name: string;
  email: string;
  year: string;
  message: string;
  status: string;
  createdAt: string;
}
type UserRequestsProps = {
  userRequests: UserRequest[]
}

export default function UserRequests({ userRequests }: UserRequestsProps) {
  const [selectedUser, setSelectedUser] = useState<UserRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alert, setAlert] = useState<{trigger: boolean; message: string; color: string , description: string}>({trigger: false, message: '', color: '', description: ''});
  const handleRowClick = (user: UserRequest) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleSetStatusFireStore =async (id: string, status: string) => {
    try {
      // Step 1: Create the user with a random temporary password
       if (selectedUser) {
             setIsUpdating(true);
             if (status === 'approved') {
           const response = await fetch('/api/add-member', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ email: selectedUser.email , name: selectedUser.name }),
           });
           if (response.status === 500) {
            setAlert({trigger: true, message: response.statusText, color: 'red', description: 'Failed to create member account please try again later'});
            setIsUpdating(false);
            setIsDialogOpen(false);
             return;
           }else {
            setAlert({trigger: true, message: "Member created successfully.", color: 'green', description: 'The member has been added to the system'});
           }
             }
             
       const docRef = doc(firebaseDb, "signupRequests", id);
        await  updateDoc(docRef, { status: status })
           selectedUser.status = status;
              // await deleteDoc(doc(firebaseDb, "signupRequests", id));
              setIsUpdating(false);
              setIsDialogOpen(false);
                console.log("Status updated successfully!");
       }}catch(error)  {
           console.error("Error updating status: ", error);
         }
          
    
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning-100 text-warning-800 hover:bg-warning-100 dark:bg-warning-500/20 dark:text-warning-400";
      case "approved":
        return "bg-success-100 text-success-800 hover:bg-success-100 dark:bg-success-500/20 dark:text-success-400";
      case "rejected":
        return "bg-error-100 text-error-800 hover:bg-error-100 dark:bg-error-500/20 dark:text-error-400";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-title-md font-bold text-gray-900 dark:text-white">Join Requests</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {userRequests.length} Total Requests
        </Badge>
      </div>

      <AlertDialogDestructiveDemo open={alert.trigger} onOpenChange={(open) => setAlert({...alert, trigger: open})} message={alert.message} description={alert.description} color={alert.color} />

      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">User Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-theme-sm text-gray-500 dark:text-gray-400">Full Name</th>
                  <th className="text-left py-3 px-4 font-medium text-theme-sm text-gray-500 dark:text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-theme-sm text-gray-500 dark:text-gray-400">Promotion</th>
                  <th className="text-left py-3 px-4 font-medium text-theme-sm text-gray-500 dark:text-gray-400">Request Date</th>
                  <th className="text-left py-3 px-4 font-medium text-theme-sm text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {userRequests.length > 0 ? userRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    onClick={() => handleRowClick(request)}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{request.name}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{request.email}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{request.year}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                )): (
                  <tr>
                    <td colSpan={5} className="py-6 px-4 text-center text-gray-500 dark:text-gray-400">
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-dark border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900 dark:text-white">Request Details</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Complete information about the join request
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                  <User className="w-5 h-5 mt-0.5 text-brand-600 dark:text-brand-400" />
                  <div>
                    <p className="text-theme-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-md font-semibold text-gray-900 dark:text-white">{selectedUser.name}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                  <Mail className="w-5 h-5 mt-0.5 text-brand-600 dark:text-brand-400" />
                  <div>
                    <p className="text-theme-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-md font-semibold break-all text-gray-900 dark:text-white">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                  <Hash className="w-5 h-5 mt-0.5 text-brand-600 dark:text-brand-400" />
                  <div>
                    <p className="text-theme-sm font-medium text-gray-500 dark:text-gray-400">Promotion</p>
                    <p className="text-md font-semibold text-gray-900 dark:text-white">{selectedUser.year}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                  <Calendar className="w-5 h-5 mt-0.5 text-brand-600 dark:text-brand-400" />
                  <div>
                    <p className="text-theme-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                    <Badge className={`${getStatusColor(selectedUser.status)} text-base mt-1`}>
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800">
                <MessageSquare className="w-5 h-5 mt-0.5 text-brand-600 dark:text-brand-400" />
                <div className="flex-1">
                  <p className="text-theme-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Message to Join</p>
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{selectedUser.message}</p>
                </div>
              </div>

                {isUpdating?
                <div className="flex justify-center">
                  <Spinner size="md" color="black" />
                </div>
                : selectedUser.status === 'pending' ? (
                    <div className="flex justify-center">
                  <button
                    onClick={() => handleSetStatusFireStore(selectedUser.id, 'approved')}
                    className="mr-3 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition"
                  >
                    Approve
                  </button>
                <button
                  onClick={() => handleSetStatusFireStore(selectedUser.id, 'rejected')}
                  className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition"
                >
                  Reject
                </button>
                </div>
              ): null}
              

              <div className="text-theme-sm text-gray-500 dark:text-gray-400 text-right">
                Request submitted on {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}