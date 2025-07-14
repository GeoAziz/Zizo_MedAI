
"use client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, Bot, MessageSquare, Search, BookOpen } from "lucide-react";

export default function SupportPage() {
  const mockFaqs = [
    {
      question: "How do I use the AI Consultation feature?",
      answer: "Navigate to 'AI Consultation' from your dashboard. Describe your symptoms in detail, add any relevant medical history, and click 'Get AI Diagnosis'. Zizo_MediAI will provide potential insights. Remember, this is not a substitute for professional medical advice."
    },
    {
      question: "Is my data secure on Zizo_MediAI?",
      answer: "Yes, Zizo_MediAI uses state-of-the-art encryption and security protocols, including the conceptual MediChain for record storage, to protect your personal health information. (Note: This is a prototype, real data security would require extensive implementation)."
    },
    {
      question: "How do I book an appointment?",
      answer: "Go to the 'Facilities' section, find a suitable facility or doctor, and use the 'Book Visit' or 'Book Appointment' options. Fill in the required details to schedule. (Booking functionality is currently mocked)."
    },
    {
      question: "What is the Virtual Body Viewer?",
      answer: "The Virtual Body Viewer is a conceptual feature designed to provide an interactive 3D visualization of your health, integrating data from wearables and scans. It's currently for illustrative purposes."
    },
    {
      question: "Who can I contact for technical support?",
      answer: "For technical issues, you can use the 'AI Support Chat' (conceptual) or submit a bug report through the 'Settings' page. For urgent medical concerns, always contact emergency services or your healthcare provider."
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Support Center" description="Find answers, tutorials, and get help with Zizo_MediAI." icon={LifeBuoy} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <Card className="lg:col-span-2 shadow-xl rounded-xl">
          <CardHeader className="bg-primary/5">
            <CardTitle className="font-headline text-xl text-primary flex items-center gap-2"><BookOpen className="w-5 h-5"/>Frequently Asked Questions</CardTitle>
            <CardDescription>Find quick answers to common questions about Zizo_MediAI.</CardDescription>
            <div className="relative pt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search FAQs..." className="pl-10 bg-input w-full" disabled/>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {mockFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                {mockFaqs.map((faq, index) => (
                    <AccordionItem value={`faq-${index}`} key={index} className="border-b last:border-b-0">
                    <AccordionTrigger className="hover:no-underline text-left text-base font-semibold text-foreground">
                        {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 pt-1 pb-3 px-1">
                        {faq.answer}
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            ): (
                <p className="text-muted-foreground text-center py-4">No FAQs available at the moment.</p>
            )}
          </CardContent>
        </Card>

        {/* Contact & AI Support Card */}
        <div className="space-y-8">
            <Card className="shadow-xl rounded-xl">
                <CardHeader className="bg-accent/10">
                <CardTitle className="font-headline text-xl text-accent flex items-center gap-2"><Bot className="w-5 h-5" />AI Support Chat (Conceptual)</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">Get instant help from our Zizo_SupportAI for common issues and navigation assistance.</p>
                <Button variant="outline" className="w-full" disabled>Start AI Chat</Button>
                </CardContent>
            </Card>

            <Card className="shadow-xl rounded-xl">
                <CardHeader className="bg-accent/10">
                <CardTitle className="font-headline text-xl text-accent flex items-center gap-2"><MessageSquare className="w-5 h-5" />Contact Support Team</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <p className="text-muted-foreground">For complex issues or feedback, please reach out to our human support team. (This is a mock form)</p>
                    <div>
                        <label htmlFor="support-subject" className="block text-sm font-medium text-foreground mb-1">Subject</label>
                        <Input id="support-subject" placeholder="e.g., Issue with login" className="bg-input" disabled/>
                    </div>
                    <div>
                        <label htmlFor="support-message" className="block text-sm font-medium text-foreground mb-1">Message</label>
                        <Textarea id="support-message" placeholder="Describe your issue in detail..." className="min-h-[100px] bg-input" disabled/>
                    </div>
                    <Button className="w-full" disabled>Submit Ticket</Button>
                </CardContent>
            </Card>
        </div>
      </div>
       <p className="text-center text-sm text-muted-foreground">
        Support features are conceptual. For real medical emergencies, please call your local emergency number.
      </p>
    </div>
  );
}
