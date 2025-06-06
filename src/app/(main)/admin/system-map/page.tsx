import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";
import Image from "next/image";

export default function AdminSystemMapPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Map" description="View all hospital/clinic nodes in real-time." icon={Map} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Live Network Visualization</CardTitle>
          <CardDescription>This feature is currently under development. Interactive map coming soon!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center bg-secondary/30">
           <Image src="https://placehold.co/800x400.png" alt="System Map Placeholder" width={800} height={400} className="rounded-md shadow-md" data-ai-hint="network diagram city" />
        </CardContent>
      </Card>
    </div>
  );
}
