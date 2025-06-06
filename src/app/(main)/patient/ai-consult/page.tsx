"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestDiagnosis, type SuggestDiagnosisInput, type SuggestDiagnosisOutput } from '@/ai/flows/suggest-diagnosis';
import { Bot, Sparkles, AlertTriangle, Activity, Lightbulb, CheckCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

const consultationSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }),
  medicalHistory: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

export default function AiConsultPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<SuggestDiagnosisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      symptoms: '',
      medicalHistory: '',
    },
  });

  const onSubmit: SubmitHandler<ConsultationFormValues> = async (data) => {
    setIsLoading(true);
    setDiagnosisResult(null);
    try {
      const result = await suggestDiagnosis(data as SuggestDiagnosisInput);
      setDiagnosisResult(result);
      toast({
        title: 'Diagnosis Suggested',
        description: 'Zizo_MediAI has provided potential diagnoses.',
      });
    } catch (error) {
      console.error("Error suggesting diagnosis:", error);
      toast({
        title: 'Error',
        description: 'Failed to get diagnosis suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Consultation Room" description="Describe your symptoms to Zizo_MediAI for analysis." icon={Bot} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-xl rounded-xl">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <Image src="https://placehold.co/80x80.png" alt="AI Doctor Avatar" width={80} height={80} className="rounded-full border-2 border-primary" data-ai-hint="doctor avatar" />
              <div>
                <CardTitle className="font-headline text-2xl text-primary">Zizo_MediAI</CardTitle>
                <CardDescription className="text-muted-foreground">Your Virtual Health Assistant</CardDescription>
              </div>
            </div>
             <p className="text-sm text-foreground/80">Please provide as much detail as possible for an accurate analysis. This tool provides suggestions and is not a substitute for professional medical advice.</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Describe your symptoms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I have a persistent cough, fever, and fatigue for the last 3 days..."
                          className="min-h-[150px] bg-input focus:ring-primary shadow-inner"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Relevant Medical History (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Allergic to penicillin, diagnosed with asthma in childhood..."
                          className="min-h-[100px] bg-input focus:ring-primary shadow-inner"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-transform hover:scale-105" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Activity className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get AI Diagnosis
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {isLoading && (
            <Card className="shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">
                  <Activity className="animate-spin h-5 w-5" />
                  AI is Thinking...
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground">Zizo_MediAI is processing your information. Please wait a moment.</p>
                <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-2 bg-primary animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          )}

          {diagnosisResult && !isLoading && (
            <Card className="shadow-xl rounded-xl">
              <CardHeader className="bg-accent/10">
                <CardTitle className="font-headline text-2xl text-accent flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" />
                  AI Diagnosis Suggestions
                </CardTitle>
                <CardDescription>Based on the information provided, here are some potential considerations. Remember to consult a healthcare professional.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {diagnosisResult.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {diagnosisResult.map((diag, index) => (
                      <AccordionItem value={`item-${index}`} key={index} className="border-b border-border last:border-b-0">
                        <AccordionTrigger className="hover:no-underline text-left">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-lg font-semibold text-foreground">{diag.diagnosis}</span>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${getConfidenceColor(diag.confidence)}`}>
                              Confidence: {(diag.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 text-foreground/90 pt-2 pb-4 px-1">
                          <p><strong className="font-medium text-foreground">Rationale:</strong> {diag.rationale}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            <AlertTriangle className="inline-block h-4 w-4 mr-1 text-orange-500" />
                            This is an AI-generated suggestion and not a definitive diagnosis. Always consult with a qualified healthcare provider for medical advice.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No specific diagnoses could be suggested based on the provided information. Please provide more details or consult a doctor.</p>
                )}
              </CardContent>
              <CardFooter>
                 <Button variant="outline" className="w-full" onClick={() => { setDiagnosisResult(null); form.reset(); }}>
                    Start New Consultation
                  </Button>
              </CardFooter>
            </Card>
          )}
          
          {!diagnosisResult && !isLoading && (
             <Card className="shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Ready for Consultation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground">Fill in your symptoms and medical history on the left to get started with your AI consultation.</p>
                <Bot className="h-16 w-16 text-primary/30 mx-auto mt-4" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function getConfidenceColor(confidence: number): string {
  if (confidence > 0.75) return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300";
  if (confidence > 0.5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300";
  return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300";
}

