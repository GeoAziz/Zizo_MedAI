
"use client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Hospital, MapPin, Clock, Search, CalendarPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FacilitiesPage() {
  const mockFacilities = [
    { id: "F001", name: "Zizo General Hospital", location: "City Center", capacity: "500 Beds", rating: 4.5, waitTime: "15 min", specialty: "General Medicine" },
    { id: "F002", name: "MediAI Clinic North", location: "North Suburbs", capacity: "50 Beds", rating: 4.2, waitTime: "10 min", specialty: "Family Care" },
    { id: "F003", name: "BioScan Diagnostics Hub", location: "Tech Park", capacity: "N/A", rating: 4.8, waitTime: "5 min", specialty: "Advanced Imaging" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Facility Explorer" 
        description="Find hospitals, clinics, and specialty centers near you." 
        icon={Hospital}
        actions={
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/facilities/booking">
                <CalendarPlus className="mr-2 h-4 w-4" /> Book Visit
              </Link>
            </Button>
             <Button asChild variant="outline">
              <Link href="/facilities/queue-status">
                <Clock className="mr-2 h-4 w-4" /> Queue Status
              </Link>
            </Button>
          </div>
        }
      />

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center gap-2"><MapPin className="w-5 h-5" />Map View</CardTitle>
          <CardDescription>Interactive map of all facilities (Placeholder).</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center bg-secondary/30 p-6 rounded-b-lg">
          <Image src="https://placehold.co/800x400.png" alt="Facilities Map Placeholder" width={800} height={400} className="rounded-md shadow-md" data-ai-hint="city map" />
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">Facility List</CardTitle>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search facilities..." className="pl-10 bg-input w-full md:max-w-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFacilities.map((facility) => (
            <Card key={facility.id} className="shadow-md hover:shadow-xl transition-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-headline text-lg text-foreground">{facility.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{facility.specialty}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {facility.location}</p>
                <p className="flex items-center gap-1"><Hospital className="h-4 w-4 text-primary" /> Capacity: {facility.capacity}</p>
                <p className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> Avg. Wait: {facility.waitTime}</p>
                <p>Rating: <span className="font-semibold text-accent">{facility.rating} / 5</span></p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/facilities/${facility.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
