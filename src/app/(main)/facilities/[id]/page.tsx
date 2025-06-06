"use client"
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital } from "lucide-react";
import { useParams } from 'next/navigation';

export default function FacilityDetailsPage() {
  const params = useParams();
  const facilityId = params.id;

  return (
    <div className="space-y-6">
      <PageHeader title={`Facility Details: ${facilityId}`} description="Information, capacity, doctors available, and ratings." icon={Hospital} />
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">{`Details for Facility ${facilityId}`}</CardTitle>
          <CardDescription>This feature is currently under development. Detailed facility information coming soon!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">{`Detailed information for facility ID ${facilityId} will be displayed here.`}</p>
        </CardContent>
      </Card>
    </div>
  );
}
