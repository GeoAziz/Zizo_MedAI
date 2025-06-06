import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminUserManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage roles, permissions, and view activity logs." icon={Users} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">User Administration</CardTitle>
          <CardDescription>This feature is currently under development. Check back soon for updates!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">User management tools coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
