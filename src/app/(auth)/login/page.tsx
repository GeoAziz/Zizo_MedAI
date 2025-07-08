
"use client";

import { useState } from 'react';
import Link from 'next/link';
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

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg role="img" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.62-3.82 1.62-2.91 0-5.22-2.34-5.22-5.23s2.31-5.23 5.22-5.23c1.62 0 2.78.62 3.64 1.45l2.4-2.33c-1.5-1.33-3.41-2.12-5.83-2.12-4.82 0-8.72 3.88-8.72 8.72s3.9 8.72 8.72 8.72c2.53 0 4.62-.84 6.13-2.35 1.59-1.59 2.1-3.9 2.1-6.15 0-.44-.04-.88-.1-1.31H12.48z"
            />
        </svg>
    );
}

export default function LoginPage() {
  const { login, loginWithGoogle, isLoading: authLoading, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast({ title: "Login Successful!", description: "Welcome back to Zizo_MediAI." });
    } catch (error: any) {
      console.error("Login failed:", error);
      let description = "An unknown error occurred. Please try again.";
      if (error.code === 'auth/invalid-credential') {
        description = "Incorrect email or password. Please check your credentials.";
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

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      // The auth context will handle redirection. We can show a generic toast.
      toast({ title: "Authenticating with Google...", description: "Please follow the prompts." });
    } catch (error: any) {
        console.error("Google login failed:", error);
        toast({
            title: "Google Login Failed",
            description: error.message || "An unknown error occurred. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  // The AuthProvider now handles redirects, so we just show a loading spinner
  // if isLoading is true or a user object exists but the role isn't determined yet.
  if (authLoading || (user && !user.role)) {
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
          <div className="flex items-center justify-center mt-2">
            <LogIn className="mr-2 h-7 w-7 text-primary" />
            <CardTitle className="font-headline text-2xl text-primary">Sign In</CardTitle>
          </div>
 <CardDescription className="text-muted-foreground mt-2">
            Access your Zizo_MediAI dashboard by signing in below.
          </CardDescription>
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
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
          </div>
           <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isSubmitting || authLoading}>
                <GoogleIcon className="mr-2 h-4 w-4"/> Google
            </Button>
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
