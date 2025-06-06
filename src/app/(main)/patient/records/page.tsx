
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Lock, Download, GitCommitVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


const mockMedicalRecords = [
  {
    id: "REC001",
    date: "2024-07-15",
    type: "Doctor's Visit",
    title: "Follow-up with Dr. Eva Core",
    summary: "Discussed ongoing hypertension management. Blood pressure readings stable. Medication adherence confirmed. Advised continued lifestyle modifications.",
    tags: ["Cardiology", "Hypertension", "Check-up"]
  },
  {
    id: "REC002",
    date: "2024-06-20",
    type: "Lab Report",
    title: "Lipid Panel Results",
    summary: "Total Cholesterol: 220 mg/dL (High). LDL: 150 mg/dL (High). HDL: 40 mg/dL (Low). Triglycerides: 180 mg/dL (High). Advised dietary changes and follow-up.",
    tags: ["Lab Results", "Cholesterol"]
  },
  {
    id: "REC003",
    date: "2024-05-05",
    type: "AI Consultation",
    title: "Symptom Analysis: Persistent Cough",
    summary: "Patient reported persistent cough and fatigue. AI suggested potential viral infection or allergies. Recommended RICE protocol and monitoring. Advised to see a doctor if symptoms worsen.",
    tags: ["AI Consult", "Respiratory"]
  },
  {
    id: "REC004",
    date: "2023-11-10",
    type: "Hospital Admission",
    title: "Asthma Exacerbation",
    summary: "Admitted for severe asthma attack. Treated with nebulizers and corticosteroids. Discharged after 2 days with updated action plan.",
    tags: ["Emergency", "Asthma", "Hospitalization"]
  }
];

export default function PatientRecordsPage() {
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
          {mockMedicalRecords.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {mockMedicalRecords.map((record) => (
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
          ) : (
             <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No medical records found in MediChain.</p>
            </div>
          )}
        </CardContent>
         {mockMedicalRecords.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Records</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
