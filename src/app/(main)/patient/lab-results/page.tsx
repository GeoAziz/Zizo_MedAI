import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export default function PatientLabResultsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Lab Results" description="Access your visual reports, timelines, and genome charts." icon={FlaskConical} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Lab Results Viewer</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Lab result viewing coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
