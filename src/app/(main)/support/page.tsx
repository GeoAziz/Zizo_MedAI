import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Support Center" description="Get help with Zizo_MediAI features and report issues." icon={LifeBuoy} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Help & Support</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Support resources and chat coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
