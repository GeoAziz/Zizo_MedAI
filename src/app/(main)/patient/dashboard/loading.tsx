
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboard, ActivitySquare, Bot, CalendarDays, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function PatientDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <PageHeader title="Patient Dashboard" description="Your personal health overview and quick actions." icon={LayoutDashboard} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary"><ActivitySquare className="w-6 h-6"/>Health Overview</CardTitle>
            <CardDescription>Real-time vitals and a glimpse of your holographic scan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vitals Skeleton */}
            <Card className="shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Current Vitals</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-6 w-[60px]" />
                  </div>
                </div>
                 <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-6 w-[60px]" />
                  </div>
                </div>
                 <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-6 w-[60px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
             {/* Image Skeleton */}
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg text-center">
              <Skeleton className="h-[300px] w-full rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* AI Consult Skeleton */}
        <Card className="shadow-lg rounded-xl flex flex-col justify-between bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Bot className="w-6 h-6"/>AI Consultation</CardTitle>
            <Skeleton className="h-4 w-4/5 mt-1 bg-primary-foreground/20" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-primary-foreground/20" />
              <Skeleton className="h-4 w-3/4 bg-primary-foreground/20" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full bg-primary-foreground/20 rounded-md" />
          </CardFooter>
        </Card>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments Skeleton */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><CalendarDays className="w-5 h-5"/>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </CardContent>
           <CardFooter>
            <Skeleton className="h-10 w-full rounded-md" />
          </CardFooter>
        </Card>

        {/* Prescriptions Skeleton */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><ClipboardList className="w-5 h-5"/>Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </CardContent>
           <CardFooter>
            <Skeleton className="h-10 w-full rounded-md" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
