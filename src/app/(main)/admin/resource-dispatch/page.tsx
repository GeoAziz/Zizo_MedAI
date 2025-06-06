import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waypoints } from "lucide-react";

export default function AdminResourceDispatchPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Resource Dispatch" description="Assign drones, ambulances, and staff to crises." icon={Waypoints} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Dispatch Control Panel</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Resource dispatch system coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
