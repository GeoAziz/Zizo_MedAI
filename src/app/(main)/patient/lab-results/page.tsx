
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FlaskConical, Microscope, LineChart, FileDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const mockLabResults = [
  { id: "L001", testName: "Complete Blood Count (CBC)", date: "2024-07-20", status: "Normal", reportUrl: "#", trend: "stable" },
  { id: "L002", testName: "Lipid Panel", date: "2024-07-20", status: "Action Required", reportUrl: "#", trend: "increasing" },
  { id: "L003", testName: "Thyroid Stimulating Hormone (TSH)", date: "2024-06-15", status: "Normal", reportUrl: "#", trend: "stable" },
  { id: "L004", testName: "Glucose, Plasma", date: "2024-07-20", status: "Monitor", reportUrl: "#", trend: "decreasing" },
  { id: "L005", testName: "Urinalysis", date: "2024-05-10", status: "Normal", reportUrl: "#", trend: "stable" },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "Normal": return "default";
    case "Action Required": return "destructive";
    case "Monitor": return "secondary"; // or a custom yellow-like variant
    default: return "outline";
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "increasing": return <TrendingUp className="h-4 w-4 text-red-500" />;
    case "decreasing": return <TrendingDown className="h-4 w-4 text-green-500" />;
    case "stable": return <Minus className="h-4 w-4 text-gray-500" />;
    default: return null;
  }
};

export default function PatientLabResultsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Lab Results" 
        description="Access your visual reports, timelines, and genome charts." 
        icon={FlaskConical}
        actions={
          <div className="flex gap-2">
            <Button disabled><LineChart className="mr-2 h-4 w-4" /> View Trends</Button>
            <Button disabled variant="outline"><FileDown className="mr-2 h-4 w-4" /> Download All</Button>
          </div>
        }
      />
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2"><Microscope className="w-5 h-5 text-primary"/>Lab Results Viewer</CardTitle>
          <CardDescription>Summary of your recent lab tests. Click 'View Report' for detailed information.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockLabResults.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test ID</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLabResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.id}</TableCell>
                    <TableCell>{result.testName}</TableCell>
                    <TableCell>{result.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(result.status)}>{result.status}</Badge>
                    </TableCell>
                    <TableCell className="flex justify-center items-center">{getTrendIcon(result.trend)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>View Report</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
              <FlaskConical className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No lab results available at this time.</p>
            </div>
          )}
        </CardContent>
        {mockLabResults.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Results</Button>
          </CardFooter>
        )}
      </Card>

      <Card className="shadow-xl rounded-xl">
        <CardHeader>
            <CardTitle className="font-headline text-lg text-primary">Genome Chart (Conceptual)</CardTitle>
            <CardDescription>Personalized genomic insights and risk factors. This feature is highly advanced and conceptual.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] bg-secondary/30 p-6 rounded-lg">
            <Image src="https://placehold.co/600x300.png" alt="Genome Chart Placeholder" width={600} height={300} className="rounded-md shadow-md" data-ai-hint="dna sequence abstract" />
            <p className="mt-4 text-sm text-muted-foreground">Interactive genome visualization coming in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
