import { ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function EmergencyPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Emergency Center" 
        description="Access emergency resources and information." 
        icon={ShieldAlert}
      />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Emergency Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is a shared emergency page. You can customize this for all roles.</p>
        </CardContent>
      </Card>
    </div>
  );
}
