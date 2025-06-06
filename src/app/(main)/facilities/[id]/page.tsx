
"use client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hospital, MapPin, Clock, Users, Phone, Star, CheckCircle, Microscope, Brain, CalendarPlus } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const mockFacilitiesData = {
  "F001": {
    name: "Zizo General Hospital",
    address: "123 Health St, City Center, ZizoLand 12345",
    phone: "+1-555-0100",
    type: "General Hospital",
    capacity: "500 Beds",
    currentWaitTime: "20 min (ER)",
    rating: 4.7,
    services: ["Emergency Care", "Surgery", "Cardiology", "Pediatrics", "Oncology", "Radiology"],
    specialties: ["Advanced Cardiac Unit", "Pediatric ICU", "Robotic Surgery Center"],
    doctors: [
      { name: "Dr. Eva Core", specialty: "Cardiology" },
      { name: "Dr. Lee Min", specialty: "Pediatrics" },
      { name: "Dr. Anya Sharma", specialty: "General Surgery" },
    ],
    imageUrl: "https://placehold.co/800x400.png?text=Zizo+General+Hospital",
    dataAiHint: "modern hospital exterior"
  },
  "F002": {
    name: "MediAI Clinic North",
    address: "456 Wellness Ave, North Suburbs, ZizoLand 67890",
    phone: "+1-555-0200",
    type: "Clinic",
    capacity: "50 Beds (Observation)",
    currentWaitTime: "10 min (Walk-in)",
    rating: 4.2,
    services: ["Family Medicine", "Preventive Care", "Vaccinations", "Minor Injuries", "AI Diagnostics"],
    specialties: ["AI-Powered Symptom Checker", "Telehealth Services"],
    doctors: [
      { name: "Dr. Ken Miles", specialty: "Family Medicine" },
      { name: "Dr. Sarah Woods", specialty: "Dermatology (Visiting)" },
    ],
    imageUrl: "https://placehold.co/800x400.png?text=MediAI+Clinic+North",
    dataAiHint: "clinic building"
  },
   "F003": {
    name: "BioScan Diagnostics Hub",
    address: "789 Tech Park Rd, Innovation District, ZizoLand 54321",
    phone: "+1-555-0300",
    type: "Diagnostics Center",
    capacity: "N/A",
    currentWaitTime: "5 min (Scheduled Appt.)",
    rating: 4.9,
    services: ["MRI", "CT Scan", "X-Ray", "Ultrasound", "Genetic Testing", "Pathology Lab"],
    specialties: ["AI-Enhanced Image Analysis", "Rapid Genome Sequencing"],
    doctors: [
      { name: "Dr. Lin Chen", specialty: "Radiology" },
      { name: "Dr. Omar Hassan", specialty: "Pathology" },
    ],
    imageUrl: "https://placehold.co/800x400.png?text=BioScan+Diagnostics",
    dataAiHint: "medical lab building"
  }
};

export default function FacilityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const facilityId = typeof params.id === 'string' ? params.id : null;
  
  const facility = facilityId ? (mockFacilitiesData as any)[facilityId] : null;

  if (!facility) {
    return (
      <div className="space-y-6">
        <PageHeader title="Facility Not Found" description="The requested facility ID does not exist or is invalid." icon={Hospital} />
        <Card className="shadow-lg rounded-xl">
          <CardContent className="min-h-[200px] flex flex-col items-center justify-center text-center">
            <Hospital className="h-20 w-20 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">We couldn't find details for facility ID: {facilityId || "Unknown"}.</p>
            <Button onClick={() => router.push('/facilities')} className="mt-4">Back to Facilities List</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={facility.name}
        description={`${facility.type} - ${facility.address}`}
        icon={Hospital}
        actions={
          <Button asChild>
            <Link href={`/facilities/booking?facilityId=${facilityId}`}>
                <CalendarPlus className="mr-2 h-4 w-4"/> Book Appointment Here
            </Link>
          </Button>
        }
      />
      
      <Card className="shadow-xl rounded-xl overflow-hidden">
        <Image src={facility.imageUrl} alt={`${facility.name} building`} width={1200} height={400} className="w-full h-64 object-cover" data-ai-hint={facility.dataAiHint} />
        <CardHeader className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle className="font-headline text-3xl text-primary">{facility.name}</CardTitle>
                <div className="flex items-center gap-1 mt-2 md:mt-0">
                    {[...Array(Math.floor(facility.rating))].map((_, i) => <Star key={`f-${i}`} className="h-5 w-5 text-yellow-400 fill-yellow-400"/>)}
                    {facility.rating % 1 !== 0 && <Star key="half" className="h-5 w-5 text-yellow-400 fill-yellow-200"/>}
                    {[...Array(5 - Math.ceil(facility.rating))].map((_, i) => <Star key={`e-${i}`} className="h-5 w-5 text-yellow-200"/>)}
                    <span className="ml-1 text-sm text-muted-foreground">({facility.rating.toFixed(1)} / 5.0)</span>
                </div>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="md:col-span-2 space-y-6">
                <section>
                    <h3 className="text-xl font-semibold font-headline text-foreground mb-2">Key Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/> {facility.address}</p>
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary"/> {facility.phone}</p>
                        <p className="flex items-center gap-2"><Hospital className="h-4 w-4 text-primary"/> Type: {facility.type}</p>
                        <p className="flex items-center gap-2"><Users className="h-4 w-4 text-primary"/> Capacity: {facility.capacity}</p>
                        <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary"/> Avg. Wait: <span className="font-semibold">{facility.currentWaitTime}</span></p>
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-semibold font-headline text-foreground mb-2">Services Offered</h3>
                    <div className="flex flex-wrap gap-2">
                        {facility.services.map((service: string) => <Badge key={service} variant="secondary">{service}</Badge>)}
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-semibold font-headline text-foreground mb-2">Specialties</h3>
                     <div className="space-y-2">
                        {facility.specialties.map((specialty: string) => (
                            <div key={specialty} className="flex items-center gap-2 p-2 bg-secondary/30 rounded-md">
                                {specialty.toLowerCase().includes("ai") || specialty.toLowerCase().includes("robotic") ? 
                                    <Brain className="h-5 w-5 text-accent"/> : 
                                    <Microscope className="h-5 w-5 text-accent"/> 
                                }
                                <span className="text-sm text-foreground">{specialty}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <div className="space-y-6">
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Doctors Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {facility.doctors.map((doc: {name: string, specialty: string}) => (
                                <li key={doc.name} className="text-sm">
                                    <p className="font-medium text-foreground">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                                </li>
                            ))}
                        </ul>
                         <Button variant="link" className="p-0 h-auto mt-2 text-accent text-sm" disabled>View All Doctors</Button>
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Live Map (Conceptual)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-2">
                        <Image src="https://placehold.co/300x200.png?text=Facility+Location" alt="Facility Map" width={300} height={200} className="rounded" data-ai-hint="map location" />
                    </CardContent>
                </Card>
            </div>
        </CardContent>
         <CardFooter className="p-6 border-t">
            <Button variant="outline" onClick={() => router.back()} className="mr-2">Back to List</Button>
            <p className="text-xs text-muted-foreground">Information last updated: (Mock Data)</p>
         </CardFooter>
      </Card>
    </div>
  );
}
