import { Hospital } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function FacilitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Facility Explorer" 
        description="Find hospitals, clinics, and specialty centers near you." 
        icon={Hospital}
      />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a shared facilities page. You can customize this for all roles.</p>
        </CardContent>
      </Card>
    </div>
  );
}
