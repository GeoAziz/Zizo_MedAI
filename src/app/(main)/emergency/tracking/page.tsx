import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren, MapPin, Clock, PhoneOutgoing, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EmergencyTrackingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Emergency Response" description="Live tracking of Zizo_MediFleet and incident details." icon={Siren} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xl rounded-xl">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="font-headline text-2xl text-destructive flex items-center gap-2">
              <MapPin className="w-7 h-7" /> Live Ambulance Tracker
            </CardTitle>
            <CardDescription>Real-time location and ETA of dispatched unit.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video bg-secondary/50 flex items-center justify-center">
              <Image 
                src="https://placehold.co/800x450.png" 
                alt="Live Map Placeholder" 
                width={800} 
                height={450}
                className="object-cover w-full h-full"
                data-ai-hint="city map ambulance"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center gap-2"><Clock className="w-5 h-5" />ETA & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Time of Arrival</p>
                <p className="text-4xl font-bold text-primary">8 <span className="text-lg">min</span></p>
              </div>
              <p className="text-sm text-center text-green-600 font-medium">Unit Dispatched: Drone MD-07</p>
              <p className="text-xs text-muted-foreground text-center">En route to your location.</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center gap-2"><ShieldCheck className="w-5 h-5" />Emergency Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="font-medium text-foreground">Blood Type:</span> O+</p>
              <p><span className="font-medium text-foreground">Allergies:</span> Penicillin</p>
              <p><span className="font-medium text-foreground">Emergency Contact:</span> Jane Doe (Spouse)</p>
            </CardContent>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/emergency/profile">View Full Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center gap-2"><PhoneOutgoing className="w-5 h-5" />AI Triage & Communication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            An AI assistant may contact you or your emergency contact for preliminary triage. 
            Please keep your phone line open.
          </p>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <h4 className="font-semibold text-foreground">Instructions for Patient:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Stay calm and in a safe location if possible.</li>
              <li>If you can, unlock your door for easy access.</li>
              <li>Follow any instructions provided by the AI or dispatcher.</li>
            </ul>
          </div>
          <Button variant="secondary" className="w-full" asChild>
             <Link href="/emergency/triage">Open AI Triage Interface</Link>
          </Button>
        </CardContent>
      </Card>
       <p className="text-center text-sm text-muted-foreground">
        If your situation worsens or you need immediate help, call your local emergency number.
      </p>
    </div>
  );
}
