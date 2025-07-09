
"use client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, BarChart2, Users, Bot, Percent, MapPin } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

export default function AdminOutbreakMonitorPage() {
  const mockOutbreakData = {
    currentAlertLevel: "High",
    activeRegions: 3,
    predictedCasesNextWeek: 150,
    confidence: 75, // percentage
    keyFactors: ["Increased travel from Region X", "Low vaccination rates in Area Y", "Seasonal flu overlap"],
    dominantStrain: "Influenza A (H3N2) - Variant Z",
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Outbreak Monitor" description="AI-driven predictions, heatmaps, and simulation tools for epidemic intelligence." icon={Activity} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-xl rounded-xl">
          <CardHeader className="bg-destructive/10">
            <CardTitle className="font-headline text-2xl text-destructive flex items-center gap-2"><AlertTriangle className="w-7 h-7"/>Current Alert Level: {mockOutbreakData.currentAlertLevel}</CardTitle>
            <CardDescription>Real-time assessment of potential public health threats.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-[16/7] bg-secondary/50 flex items-center justify-center">
              <Image 
                src="https://placehold.co/800x350.png" 
                alt="Outbreak Heatmap Placeholder" 
                width={800} 
                height={350}
                className="object-cover w-full h-full"
                data-ai-hint="heatmap virus spread city"
              />
            </div>
          </CardContent>
           <CardFooter className="p-4 border-t">
            <Button variant="outline" disabled className="w-full">View Interactive Heatmap (Conceptual)</Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="font-headline text-lg text-primary flex items-center gap-2"><Bot className="w-5 h-5"/>AI Prediction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Predicted New Cases (Next 7 Days)</p>
                <p className="text-3xl font-bold text-primary">{mockOutbreakData.predictedCasesNextWeek}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prediction Confidence</p>
                <div className="flex items-center gap-2">
                  <Progress value={mockOutbreakData.confidence} className="w-[70%]" />
                  <span className="text-sm font-semibold text-primary">{mockOutbreakData.confidence}%</span>
                </div>
              </div>
               <p className="text-xs text-muted-foreground pt-2">Dominant Strain: {mockOutbreakData.dominantStrain}</p>
            </CardContent>
          </Card>
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="font-headline text-lg text-accent flex items-center gap-2"><MapPin className="w-5 h-5"/>Affected Regions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{mockOutbreakData.activeRegions} <span className="text-base font-normal text-muted-foreground">regions currently active</span></p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                <li>Downtown Core</li>
                <li>North Suburbs</li>
                <li>West Industrial Park</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center gap-2"><BarChart2 className="w-5 h-5"/>Key Contributing Factors</CardTitle>
          <CardDescription>AI-identified factors influencing the current outbreak risk.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mockOutbreakData.keyFactors.map((factor, index) => (
              <li key={index} className="p-3 bg-secondary/30 rounded-md text-sm text-foreground">
                {factor}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Users className="w-5 h-5" />Simulation & Response (Conceptual)</CardTitle>
             <CardDescription>Model different intervention strategies and their potential impact.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center min-h-[150px]">
            <p className="text-muted-foreground mb-4">Interactive simulation tools are under development.</p>
            <Button variant="outline" disabled>Launch Outbreak Simulator</Button>
          </CardContent>
        </Card>
    </div>
  );
}
