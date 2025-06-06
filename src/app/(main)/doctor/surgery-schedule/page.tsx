import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function DoctorSurgerySchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Surgery Schedule" description="Robotic/AI-assisted scheduling and logging." icon={CalendarDays} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Surgery Management</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Surgery scheduling tools coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
