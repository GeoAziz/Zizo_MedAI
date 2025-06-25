
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
import { Logo } from '@/components/logo';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading: authLoading, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data);
      // The auth context's onAuthStateChanged will handle the redirect.
      toast({ title: "Login Successful!", description: "Welcome back to Zizo_MediAI." });
    } catch (error: any) {
      console.error("Login failed:", error);
      let description = "An unknown error occurred. Please try again.";
      // Provide a more helpful message for the most common login error.
      if (error.code === 'auth/invalid-credential') {
        description = "Incorrect email or password. Please check your credentials or register for a new account if you don't have one.";
      } else {
        description = error.message || description;
      }
      toast({
        title: "Login Failed",
        description: description,
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
          <CardTitle className="font-headline text-3xl text-primary">Welcome to Zizo_MediAI</CardTitle>
          <CardDescription className="text-muted-foreground">Sign in to access your dashboard.</CardDescription>
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
                      <Input type="password" placeholder="••••••••" {...field} className="bg-input focus:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-105" disabled={isSubmitting || authLoading}>
                {isSubmitting ? <Stethoscope className="h-5 w-5 animate-spin mr-2"/> : <LogIn className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Logging In...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center p-6 bg-primary/5">
          <Button variant="link" className="text-sm text-muted-foreground hover:text-foreground">
            Don't have an account? <Link href="/register" className="text-accent ml-1 font-semibold">Register</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
