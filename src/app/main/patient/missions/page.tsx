"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Target } from "lucide-react";

export default function PatientMissionsPage() {
  const { user, isLoading } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && user) {
      setLoading(true);
      const fetchMissions = async () => {
        const missionsRef = collection(doc(collection(db, 'users'), user.uid), 'missions');
        const missionsSnap = await getDocs(missionsRef);
        setMissions(missionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      };
      fetchMissions();
    }
  }, [user, isLoading]);

  if (isLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading health missions...</div>;
  }
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Please log in to view your health missions.</div>;
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 bg-background">
      <PageHeader title="Health Missions" description="Your gamified health goals and progress." icon={Target} />
      <div className="space-y-6">
        <Card className="shadow-lg rounded-xl w-full">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Target className="w-5 h-5"/>Your Missions</CardTitle>
          </CardHeader>
          <CardContent>
            {missions.length > 0 ? (
              <ul className="space-y-4">
                {missions.map((mission: any) => (
                  <li key={mission.id} className="p-4 bg-secondary/30 rounded-md flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground text-lg">{mission.title}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${mission.status === "completed" ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"}`}>{mission.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                    <p className="text-xs text-muted-foreground">Goal: {mission.goal} {mission.unit} | Progress: {mission.progress ?? 0} {mission.unit}</p>
                    {mission.reward && <p className="text-xs text-accent">Reward: {mission.reward}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No health missions assigned yet. Check back soon for gamified goals!</p>
            )}
          </CardContent>
        </Card>
        <Button asChild variant="outline" className="w-full max-w-xs mx-auto">
          <Link href="/main/patient/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
