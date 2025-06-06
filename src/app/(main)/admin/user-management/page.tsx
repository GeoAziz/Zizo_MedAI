
"use client";

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Edit, Trash2, Search, Filter, ShieldCheck, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface User {
  id: string;
  name: string;
  email: string;
  role: 'Patient' | 'Doctor' | 'Admin';
  status: 'Active' | 'Suspended' | 'Pending Verification';
  lastLogin: string;
}

const mockUsers: User[] = [
  { id: "USR001", name: "Johnathan P. Doe", email: "john.p.doe@example.com", role: "Patient", status: "Active", lastLogin: "2024-07-28 10:15 AM" },
  { id: "USR002", name: "Dr. Eva Core", email: "eva.core@zizomed.ai", role: "Doctor", status: "Active", lastLogin: "2024-07-28 09:30 AM" },
  { id: "USR003", name: "Admin User", email: "admin@zizomed.ai", role: "Admin", status: "Active", lastLogin: "2024-07-27 05:00 PM" },
  { id: "USR004", name: "Jane A. Smith", email: "jane.smith@example.com", role: "Patient", status: "Suspended", lastLogin: "2024-07-20 11:00 AM" },
  { id: "USR005", name: "Dr. Lee Min", email: "lee.min@zizomed.ai", role: "Doctor", status: "Pending Verification", lastLogin: "N/A" },
];

const getStatusBadgeVariant = (status: User['status']) => {
  if (status === "Active") return "default";
  if (status === "Suspended") return "destructive";
  if (status === "Pending Verification") return "secondary";
  return "outline";
};

const getRoleBadgeClass = (role: User['role']) => {
  if (role === "Admin") return "bg-purple-500/20 text-purple-700";
  if (role === "Doctor") return "bg-blue-500/20 text-blue-700";
  if (role === "Patient") return "bg-green-500/20 text-green-700";
  return "";
};

export default function AdminUserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // In a real app, users would be fetched and managed with state
  // For now, just filtering the mockUsers
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        description="Administer user accounts, roles, permissions, and activity." 
        icon={Users}
        actions={
          <div className="flex gap-2">
            <Button disabled><UserPlus className="mr-2 h-4 w-4" /> Add New User</Button>
            <Button variant="outline" disabled><ShieldCheck className="mr-2 h-4 w-4" /> Manage Roles</Button>
          </div>
        }
      />
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="font-headline text-xl">User Roster & Administration</CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search users by name or email..." 
                        className="pl-10 bg-input w-full md:min-w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" disabled><Filter className="h-4 w-4"/></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge className={getRoleBadgeClass(user.role)}>{user.role}</Badge></TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge></TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem disabled><Edit className="mr-2 h-4 w-4" />Edit User</DropdownMenuItem>
                            {user.status === "Active" && <DropdownMenuItem disabled className="text-orange-600 focus:text-orange-600"><XCircle className="mr-2 h-4 w-4" />Suspend User</DropdownMenuItem>}
                            {user.status === "Suspended" && <DropdownMenuItem disabled className="text-green-600 focus:text-green-600"><CheckCircle className="mr-2 h-4 w-4" />Reactivate User</DropdownMenuItem>}
                            <DropdownMenuSeparator />
                             <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" disabled>
                                    <Trash2 className="mr-2 h-4 w-4" />Delete User
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the user account for {user.name}.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => alert(`User ${user.name} would be deleted. (Mock action)`)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
              <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
        {filteredUsers.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Users</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
