import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function PatientPrescriptionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Prescriptions" description="View your current medications, refill requests, and instructions." icon={ClipboardList} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Prescriptions Overview</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Prescription management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
