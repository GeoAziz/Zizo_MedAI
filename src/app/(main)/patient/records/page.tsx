import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function PatientRecordsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Medical Records" description="View your encrypted history from MediChain, download records, and use the timeline slider." icon={FileText} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">MediChain Records</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Medical record access coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
