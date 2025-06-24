"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Logo } from '@/components/logo';
import { useAuth, UserRole } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Stethoscope, User, ShieldAlert } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['patient', 'doctor', 'admin'], { required_error: "Please select a role." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { signUp, isLoading: authLoading, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", role: "patient" },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await signUp(data);
      // The auth context's onAuthStateChanged will handle the redirect.
      toast({ title: "Registration Successful!", description: "Your account has been created." });
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || user) {
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
          <CardTitle className="font-headline text-3xl text-primary">Create Your Account</CardTitle>
          <CardDescription className="text-muted-foreground">Join Zizo_MediAI to manage your health.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} className="bg-input focus:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="•••••••• (min. 6 characters)" {...field} className="bg-input focus:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input focus:ring-primary">
                           <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="patient">
                          <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Patient</div>
                        </SelectItem>
                        <SelectItem value="doctor">
                           <div className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Doctor</div>
                        </SelectItem>
                        <SelectItem value="admin">
                           <div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-primary" /> Admin</div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-105" disabled={isSubmitting || authLoading}>
                {isSubmitting ? <Stethoscope className="h-5 w-5 animate-spin mr-2"/> : <UserPlus className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Creating Account...' : 'Register'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-6 bg-primary/5">
          <Button variant="link" className="text-sm text-muted-foreground hover:text-foreground">
            Already have an account? <Link href="/login" className="text-accent ml-1 font-semibold">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
