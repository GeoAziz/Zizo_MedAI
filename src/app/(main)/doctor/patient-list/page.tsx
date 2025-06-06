import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function DoctorPatientListPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patient List" description="Search, filter, and view patients by status." icon={Users} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Patient Management</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Patient list and management tools coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
