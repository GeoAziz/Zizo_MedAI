
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FlaskConical, Microscope, LineChart, FileDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getLabResults, type LabResult } from '@/services/labs';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function PatientLabResultsPage() {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
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


  useEffect(() => {
    if (!user) return;

    async function fetchLabResults() {
      setIsLoading(true);
      try {
        const data = await getLabResults(user.uid);
        setLabResults(data);
      } catch (error) {
        console.error("Failed to fetch lab results:", error);
        toast({
          title: "Error",
          description: "Could not fetch your lab results. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchLabResults();
  }, [user, toast]);

  const renderContent = () => {
    if (isLoading) {
      return (
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
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                <TableCell><div className="flex justify-start"><Skeleton className="h-5 w-5" /></div></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    
    if (labResults.length === 0) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
          <FlaskConical className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No lab results available at this time.</p>
        </div>
      );
    }

    return (
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
          {labResults.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">{result.id}</TableCell>
              <TableCell>{result.testName}</TableCell>
              <TableCell>{result.date}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(result.status)}>{result.status}</Badge>
              </TableCell>
              <TableCell className="flex justify-start items-center">{getTrendIcon(result.trend)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" disabled>View Report</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

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
          {renderContent()}
        </CardContent>
        {!isLoading && labResults.length > 0 && (
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
