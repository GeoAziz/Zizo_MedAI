import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function DoctorPrescribePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Prescribe Module" description="E-Rx creation and integration with pharmacy systems." icon={ClipboardList} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">e-Prescription System</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Prescription module coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
