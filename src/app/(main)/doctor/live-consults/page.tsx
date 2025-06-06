import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function DoctorLiveConsultsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Live Consultations" description="Start AI-augmented sessions with diagnostic tools." icon={Bot} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">AI-Augmented Consultations</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Live consultation tools coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
