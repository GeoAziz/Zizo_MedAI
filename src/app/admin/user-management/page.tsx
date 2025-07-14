"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Edit, Trash2, Search, Filter, ShieldCheck, CheckCircle, XCircle, MoreHorizontal, Activity } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUsers, type UserRecord } from '@/services/users';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { createUserAction, updateUserAction, deleteUserAction, type CreateUserFormValues } from '@/actions/userActions';

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['patient', 'doctor'], { required_error: "Please select a role." }),
});

export default function AdminUserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRecord | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string; role: "patient" | "doctor" | "admin" }>({ name: '', email: '', role: 'patient' });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", password: "", role: "patient" },
  });

  const getStatusBadgeVariant = (status?: string) => {
    if (status === "Active") return "default";
    if (status === "Suspended") return "destructive";
    return "secondary";
  };
  
  const getRoleBadgeClass = (role: string) => {
    if (role === "admin") return "bg-purple-500/20 text-purple-700";
    if (role === "doctor") return "bg-blue-500/20 text-blue-700";
    if (role === "patient") return "bg-green-500/20 text-green-700";
    return "";
  };
  

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch users.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]);

  const onSubmit: SubmitHandler<CreateUserFormValues> = async (data) => {
    setIsSubmitting(true);
    const result = await createUserAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({ title: "Success", description: "User has been created successfully." });
      setIsAddUserOpen(false);
      form.reset();
      fetchUsers(); // Refresh the user list
    } else {
      toast({ title: "Error", description: result.error || "Failed to create user.", variant: "destructive" });
    }
  };

  const handleEditOpen = (user: UserRecord) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };
  const handleEditSave = async () => {
    if (!editUser) return;
    setEditLoading(true);
    const result = await updateUserAction(editUser.uid, editForm);
    setEditLoading(false);
    if (result.success) {
      toast({ title: 'User updated', description: 'User details updated successfully.' });
      setEditUser(null);
      fetchUsers();
    } else {
      toast({ title: 'Error', description: result.error || 'Failed to update user.', variant: 'destructive' });
    }
  };
  const handleDeleteOpen = (user: UserRecord) => {
    setDeleteUser(user);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    const result = await deleteUserAction(deleteUser.uid);
    setDeleteLoading(false);
    if (result.success) {
      toast({ title: 'User deleted', description: 'User has been removed.' });
      setDeleteUser(null);
      fetchUsers();
    } else {
      toast({ title: 'Error', description: result.error || 'Failed to delete user.', variant: 'destructive' });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-5 w-24" /></TableHead>
              <TableHead><Skeleton className="h-5 w-40" /></TableHead>
              <TableHead><Skeleton className="h-5 w-16" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(4)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    
    if (filteredUsers.length === 0) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
            <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No users found matching your criteria.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.uid}>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <Badge className={getRoleBadgeClass(user.role)}>{user.role}</Badge>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditOpen(user)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteOpen(user)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <PageHeader 
          title="User Management" 
          description="Administer user accounts, roles, and permissions." 
          icon={Users}
          actions={
            <div className="flex gap-2">
              <DialogTrigger asChild>
                <Button><UserPlus className="mr-2 h-4 w-4" /> Add New User</Button>
              </DialogTrigger>
            </div>
          }
        />
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                Fill in the details to create a new user account. An email will not be sent.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="user@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="role" render={({ field }) => (
                        <FormItem><FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="patient">Patient</SelectItem>
                                    <SelectItem value="doctor">Doctor</SelectItem>
                                </SelectContent>
                            </Select>
                        <FormMessage /></FormItem>
                    )}/>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Activity className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
        {!isLoading && filteredUsers.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Users</Button>
          </CardFooter>
        )}
      </Card>
      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={v => !v && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium">Name</label>
            <input type="text" className="w-full border rounded px-2 py-1" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="w-full border rounded px-2 py-1" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
            <label className="block text-sm font-medium">Role</label>
            <select className="w-full border rounded px-2 py-1" value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value as "patient" | "doctor" | "admin" }))}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSave} disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete User Dialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={v => !v && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Are you sure you want to delete <span className="font-bold">{deleteUser?.name}</span>? This action cannot be undone.</p>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Delete'}</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
