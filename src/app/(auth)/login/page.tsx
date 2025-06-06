"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { useAuth, UserRole } from '@/context/auth-context';
import { Stethoscope, User, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { setRole, role: currentRole, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentRole) {
      router.push(`/${currentRole}/dashboard`);
    }
  }, [currentRole, isLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      setRole(selectedRole);
    }
  };

  if (isLoading || (!isLoading && currentRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Stethoscope className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 p-8">
          <Logo className="mx-auto mb-4 text-4xl" />
          <CardTitle className="font-headline text-3xl text-primary">Welcome Back!</CardTitle>
          <CardDescription className="text-muted-foreground">Select your role to access Zizo_MediAI.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="bg-input focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required className="bg-input focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground/80">Select Role</Label>
              <Select value={selectedRole || 'patient'} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger id="role" className="w-full bg-input focus:ring-primary">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" /> Patient
                    </div>
                  </SelectItem>
                  <SelectItem value="doctor">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" /> Doctor
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-primary" /> Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-105">
              Login to Zizo_MediAI
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-6 bg-primary/5">
          <Button variant="link" className="text-sm text-accent hover:text-accent/80">
            Forgot Password?
          </Button>
          <Button variant="link" className="text-sm text-muted-foreground hover:text-foreground">
            Don't have an account? <span className="text-accent ml-1">Register</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
