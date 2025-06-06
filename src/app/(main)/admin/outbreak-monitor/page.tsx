import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import Image from "next/image";

export default function AdminOutbreakMonitorPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Outbreak Monitor" description="AI predictions, heatmaps, and simulation tools." icon={Activity} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Epidemic Intelligence Platform</CardTitle>
          <CardDescription>This feature is currently under development. Interactive heatmaps and simulations coming soon!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center bg-secondary/30">
          <Image src="https://placehold.co/800x400.png" alt="Outbreak Heatmap Placeholder" width={800} height={400} className="rounded-md shadow-md" data-ai-hint="heatmap virus spread" />
        </CardContent>
      </Card>
    </div>
  );
}
