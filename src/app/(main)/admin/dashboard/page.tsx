import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LayoutDashboard, Map, Server, Users, AlertOctagon, Activity, Network, GitFork } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Zizo_HealOps Command: System overview and management tools." icon={LayoutDashboard} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Server className="w-5 h-5" />System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
              <p className="text-foreground">Active Nodes:</p>
              <p className="font-bold text-lg text-primary">42</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
              <p className="text-foreground">System Load:</p>
              <p className="font-bold text-lg text-green-600">Normal</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
              <p className="text-foreground">Pending Incidents:</p>
              <p className="font-bold text-lg text-orange-500">2</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Map className="w-5 h-5" />System Map</CardTitle>
            <CardDescription>Real-time view of all hospital/clinic nodes.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Image src="https://placehold.co/300x200.png" alt="System Map Placeholder" width={300} height={200} className="rounded-md shadow-md" data-ai-hint="network map" />
          </CardContent>
          <CardFooter>
             <Button asChild variant="outline" className="w-full" disabled>
                <Link href="/admin/system-map">View Full Map</Link>
             </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><Activity className="w-5 h-5" />Outbreak Monitor</CardTitle>
            <CardDescription className="text-primary-foreground/80">AI predictions, heatmaps, and simulations.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm mb-4">Track potential outbreaks and visualize spread patterns with AI-driven insights.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full bg-background/20 hover:bg-background/30 border-primary-foreground text-primary-foreground hover:text-primary-foreground" disabled>
                <Link href="/admin/outbreak-monitor">Access Monitor</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Users className="w-5 h-5" />User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage roles, permissions, and view activity logs.</p>
          </CardContent>
           <CardFooter>
             <Button asChild variant="outline" className="w-full">
                <Link href="/admin/user-management">Manage Users</Link>
             </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Network className="w-5 h-5" />Resource Dispatch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Assign drones, ambulances, and staff to crises.</p>
          </CardContent>
           <CardFooter>
             <Button asChild variant="outline" className="w-full" disabled>
                <Link href="/admin/resource-dispatch">Dispatch Resources</Link>
             </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><GitFork className="w-5 h-5" />AI Logs Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Review Zizo_MediAI decision trees and logs.</p>
          </CardContent>
           <CardFooter>
             <Button asChild variant="outline" className="w-full">
                <Link href="/admin/ai-logs">View AI Logs</Link>
             </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg rounded-xl md:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><AlertOctagon className="w-5 h-5" />Live Status Board & Incident Reporting</CardTitle>
             <CardDescription>Monitor beds, ventilators, triage load, and manage medical issues/errors.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">Live status board and incident reporting module is currently under development.</p>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div><p className="text-2xl font-bold text-green-600">95%</p><p className="text-sm text-muted-foreground">Bed Occupancy</p></div>
                <div><p className="text-2xl font-bold text-orange-500">15m</p><p className="text-sm text-muted-foreground">Avg. Wait Time</p></div>
            </div>
          </CardContent>
           <CardFooter>
             <Button variant="outline" disabled className="w-full">Access Full Status Board</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
