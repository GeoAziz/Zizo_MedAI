"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Lock, Download, GitCommitVertical, Search, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getMedicalRecords, type MedicalRecord } from '@/services/records';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    async function fetchRecords() {
      setIsLoading(true);
      try {
        const data = await getMedicalRecords(user.uid);
        setRecords(data);
      } catch (error) {
        console.error("Failed to fetch medical records:", error);
        toast({
          title: "Error",
          description: "Could not fetch your medical records. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecords();
  }, [user, toast]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </div>
          ))}
        </div>
      );
    }
    
    if (records.length === 0) {
      return (
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No medical records found in MediChain.</p>
        </div>
      );
    }

    return (
      <Accordion type="single" collapsible className="w-full">
        {records.map((record) => (
          <AccordionItem value={record.id} key={record.id} className="border-b border-border last:border-b-0">
            <AccordionTrigger className="hover:no-underline text-left py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                <div className="flex-1 mb-2 sm:mb-0">
                  <p className="font-semibold text-foreground">{record.title}</p>
                  <p className="text-sm text-muted-foreground">{record.date} - <span className="text-primary font-medium">{record.type}</span></p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {record.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-foreground/90 pt-2 pb-4 px-1">
              <p>{record.summary}</p>
              <Button variant="link" size="sm" className="p-0 h-auto text-accent" disabled>View Full Record (Conceptual)</Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Medical Records" 
        description="View your encrypted history from MediChain, download records, and use the timeline slider." 
        icon={FileText}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search records..." className="pl-10 bg-input w-full md:w-[200px]" disabled/>
            </div>
            <Button disabled><GitCommitVertical className="mr-2 h-4 w-4" /> View Timeline</Button>
            <Button disabled variant="outline"><Download className="mr-2 h-4 w-4" /> Download All</Button>
          </div>
        }
      />
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Lock className="w-5 h-5 text-green-600"/>MediChain Secure Records</CardTitle>
              <CardDescription>Your health history, encrypted and accessible. Timeline slider feature is conceptual.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
        {!isLoading && records.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Records</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
