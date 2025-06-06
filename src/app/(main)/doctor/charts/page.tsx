import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function DoctorChartsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Digital Charts" description="Annotate patient records and upload imaging." icon={BarChart3} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Patient Charting System</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Digital charting tools coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
