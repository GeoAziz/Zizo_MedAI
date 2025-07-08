
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
import { useSearchParams } from 'next/navigation';
import { UserPlus, Stethoscope, User, ShieldAlert } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['patient', 'doctor', 'admin'], { required_error: "Please select a role." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

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

export default function RegisterPage() {
  const { signUp, loginWithGoogle, isLoading: authLoading, user, updateUserRole } = useAuth();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "patient" },
  });

  const isGoogleSignupCompletion = searchParams.get('fromGoogle') === 'true' && user;
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await signUp(data);
      toast({ title: "Registration Successful!", description: "Your account has been created." });
      // AuthProvider will handle redirect
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

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
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

  const handleRoleSelection = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await updateUserRole(user.uid, selectedRole);
      toast({ title: "Role Updated!", description: `Your role has been set to ${selectedRole}. Redirecting...` });
      router.push(`/${selectedRole}/dashboard`);
    } catch (error: any) {
      console.error("Role update failed:", error);
      toast({ title: "Role Update Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading) {
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
          <CardTitle className="font-headline text-3xl text-primary">
            {isGoogleSignupCompletion ? "Complete Your Profile" : "Create Your Account"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isGoogleSignupCompletion ? `Welcome, ${user?.name}! Just one more step.` : "Join Zizo_MediAI to manage your health."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {isGoogleSignupCompletion ? (
            <div className="space-y-6">
              <p className="text-center text-muted-foreground">Please select your role in the Zizo_MediAI ecosystem to finish setting up your account.</p>
              <FormItem>
                <FormLabel>I am a...</FormLabel>
                <Select onValueChange={(value: string) => setSelectedRole(value as UserRole)} defaultValue={selectedRole || 'patient'}>
                  <SelectTrigger className="bg-input focus:ring-primary">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
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
              <Button className="w-full text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-105" onClick={handleRoleSelection} disabled={isSubmitting}>
                {isSubmitting ? <Stethoscope className="h-5 w-5 animate-spin mr-2"/> : <UserPlus className="mr-2 h-5 w-5" />}
                {isSubmitting ? 'Saving...' : 'Complete Registration'}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="e.g., John Doe" {...field} className="bg-input focus:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button type="submit" className="w-full text-lg py-3 rounded-lg shadow-md transition-transform hover:scale-105" disabled={isSubmitting}>
                  {isSubmitting ? <Stethoscope className="h-5 w-5 animate-spin mr-2"/> : <UserPlus className="mr-2 h-5 w-5" />}
                  {isSubmitting ? 'Creating Account...' : 'Register'}
                </Button>
              </form>
            </Form>
          )}

          {!isGoogleSignupCompletion && (
            <>
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
              <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isSubmitting}>
                <GoogleIcon className="mr-2 h-4 w-4"/> Google
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center p-6 bg-primary/5">
          {!isGoogleSignupCompletion && (
            <Button variant="link" className="text-sm text-muted-foreground hover:text-foreground">
              Already have an account? <Link href="/login" className="text-accent ml-1 font-semibold">Login</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
