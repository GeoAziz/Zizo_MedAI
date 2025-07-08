
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, UserCircle, Upload, Edit, Save, Search, Image as ImageIcon, FileText, Maximize, RotateCcw, ZoomIn, ZoomOut, BrainCircuit, Activity, Lightbulb, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useToast } from '@/hooks/use-toast';
import { analyzeMedicalImage, type AnalyzeImageInput, type AnalyzeImageOutput } from '@/ai/flows/analyze-medical-image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';


interface ChartEntry {
  date: string;
  type: string;
  content: string;
  image: string | null;
  dataAiHint?: string; 
}

const mockPatientsForChart = [
  { id: "P001", name: "Johnathan P. Doe", dob: "1985-05-15" },
  { id: "P002", name: "Jane A. Smith", dob: "1990-02-20" },
  { id: "P003", name: "Alice B. Brown", dob: "1978-11-10" },
];

const mockChartEntries: Record<string, ChartEntry[]> = {
  "P001": [
    { date: "2024-07-25", type: "SOAP Note", content: "Patient reports stable condition. BP 130/80. Continue medication Losartan 50mg OD. Reviewed recent EKG - normal sinus rhythm.", image: null },
    { date: "2024-07-10", type: "X-Ray Analysis", content: "Chest X-Ray shows clear lungs. No acute abnormalities. Mild scoliosis noted.", image: "https://placehold.co/400x300.png", dataAiHint: "chest xray" },
    { date: "2024-06-15", type: "EKG Report", content: "Normal sinus rhythm, rate 72bpm. No significant ST changes.", image: "https://placehold.co/400x300.png", dataAiHint: "ekg strip" },
  ],
  "P002": [
    { date: "2024-07-22", type: "Consultation Note", content: "Reviewed lab results (HbA1c 7.2%). Discussed diet and exercise modifications. Adjusted Metformin dosage to 1000mg BID.", image: null },
    { date: "2024-07-01", type: "Retinal Scan", content: "Early signs of diabetic retinopathy detected in left eye. Refer to ophthalmology.", image: "https://placehold.co/400x300.png", dataAiHint: "retina scan" },
  ],
  "P003": [
    { date: "2024-07-18", type: "Spirometry Test", content: "FEV1 85% predicted. Good response to albuterol. Patient counselled on inhaler technique.", image: "https://placehold.co/400x300.png", dataAiHint: "spirometry results" },
  ]
};


export default function DoctorChartsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(mockPatientsForChart[0].id);
  const [annotations, setAnnotations] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeImageOutput | null>(null);
  const { toast } = useToast();

  const patient = mockPatientsForChart.find(p => p.id === selectedPatientId);
  const patientChartEntries = selectedPatientId ? (mockChartEntries as any)[selectedPatientId] || [] : [];
  
  useEffect(() => {
    // Reset state when patient changes
    if (patientChartEntries.length > 0) {
      const firstImageEntry = patientChartEntries.find((entry: ChartEntry) => entry.image);
      if (firstImageEntry) {
        setCurrentImage(firstImageEntry.image);
        setAnnotations(firstImageEntry.content);
      } else {
        setCurrentImage(null);
        setAnnotations(patientChartEntries[0]?.content || "");
      }
    } else {
      setCurrentImage(null);
      setAnnotations("");
    }
    setAnalysis(null); // Clear previous analysis
    setIsAnalyzing(false);
  }, [selectedPatientId]);


  const handleEntryClick = (entry: ChartEntry) => {
    setCurrentImage(entry.image);
    setAnnotations(entry.content);
    setAnalysis(null); // Clear analysis when a new entry is selected
  };

  const filteredPatients = mockPatientsForChart.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAnalyzeImage = async () => {
    if (!currentImage) {
      toast({ title: "No Image Selected", description: "Please select a chart entry with an image to analyze.", variant: "destructive" });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeMedicalImage({
        imageUrl: currentImage,
        patientContext: annotations, // Use current notes as context
      });
      setAnalysis(result);
      toast({ title: "Analysis Complete", description: "AI suggestions are now available in the 'AI Analysis' tab." });
    } catch (error) {
      console.error("Image analysis failed:", error);
      toast({ title: "Analysis Failed", description: "The AI could not process this image. Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Digital Charting System" 
        description="Annotate records, upload imaging, and leverage AI for analysis." 
        icon={BarChart3}
        actions={
            <Button disabled><Save className="mr-2 h-4 w-4" /> Save Chart Changes</Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Selection & Chart History */}
        <Card className="lg:col-span-1 shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Select Patient</CardTitle>
             <div className="relative mt-2">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search patient..." 
                  className="pl-8 bg-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={selectedPatientId || ""} onValueChange={setSelectedPatientId}>
                <SelectTrigger className="w-full mt-2 bg-input">
                    <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                    {filteredPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>)}
                </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {patient && (
                <div className="mb-4 p-3 bg-secondary/30 rounded-md">
                    <p className="font-semibold text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">DOB: {patient.dob}</p>
                </div>
            )}
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Chart Entries:</h4>
            {patientChartEntries.length > 0 ? (
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                    {patientChartEntries.map((entry: ChartEntry, index: number) => (
                        <li key={index} className="p-2 border border-border rounded-md hover:bg-secondary/20 cursor-pointer" onClick={() => handleEntryClick(entry)}>
                            <p className="text-sm font-medium text-foreground flex items-center gap-1">
                                {entry.image ? <ImageIcon className="h-3 w-3 text-primary" /> : <FileText className="h-3 w-3 text-primary" />}
                                {entry.type}
                            </p>
                            <p className="text-xs text-muted-foreground">{entry.date}</p>
                        </li>
                    ))}
                </ul>
            ): (
                <p className="text-sm text-muted-foreground">No chart entries for this patient.</p>
            )}
          </CardContent>
        </Card>

        {/* Imaging & Annotation Area */}
        <Card className="lg:col-span-3 shadow-xl rounded-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-xl">Imaging & Annotations</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleAnalyzeImage} disabled={!currentImage || isAnalyzing}>
                        {isAnalyzing ? <Activity className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>}
                        {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                    </Button>
                    <Button variant="outline" size="icon" disabled><Maximize className="h-4 w-4" /></Button>
                </div>
            </div>
            <CardDescription>View medical images, add notes, and use AI for preliminary analysis.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-secondary/30 p-4 rounded-lg flex items-center justify-center min-h-[300px] relative">
              {currentImage ? (
                <Image src={currentImage} alt="Medical Imaging Placeholder" width={400} height={300} className="rounded-md shadow-md object-contain max-h-[400px]" data-ai-hint={patientChartEntries.find((e: ChartEntry) => e.image === currentImage)?.dataAiHint || "medical scan"} />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mx-auto mb-2" />
                  <p>No image selected or available for this entry.</p>
                  <p className="text-xs">Select an entry with an image from the list.</p>
                </div>
              )}
               <div className="absolute top-2 left-2 flex gap-1">
                  <Button variant="ghost" size="icon" disabled title="Draw"><Edit className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="icon" disabled title="Zoom In"><ZoomIn className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="icon" disabled title="Zoom Out"><ZoomOut className="h-4 w-4"/></Button>
                  <Button variant="ghost" size="icon" disabled title="Rotate"><RotateCcw className="h-4 w-4"/></Button>
               </div>
            </div>
            <div className="md:col-span-1 space-y-4">
               <Tabs defaultValue="notes" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes">Doctor's Notes</TabsTrigger>
                    <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notes" className="mt-4">
                     <div className="space-y-2">
                        <Label htmlFor="annotations" className="font-semibold">Notes / Annotations</Label>
                        <Textarea 
                            id="annotations" 
                            placeholder="Enter notes here..." 
                            className="min-h-[200px] mt-1 bg-input"
                            value={annotations}
                            onChange={(e) => setAnnotations(e.target.value)}
                            disabled={!selectedPatientId}
                        />
                        <Button className="w-full" disabled={!selectedPatientId || !annotations}>Save Annotation</Button>
                     </div>
                  </TabsContent>
                  <TabsContent value="ai-analysis" className="mt-4">
                    {isAnalyzing && <AnalysisSkeleton />}
                    {!isAnalyzing && analysis && <AnalysisResult analysis={analysis} />}
                    {!isAnalyzing && !analysis && (
                        <div className="text-center text-muted-foreground p-4 min-h-[250px] flex flex-col justify-center items-center">
                            <BrainCircuit className="h-12 w-12 mb-2" />
                            <p className="text-sm font-semibold">AI Analysis</p>
                            <p className="text-xs">Click "Analyze with AI" on an image to get AI-powered insights.</p>
                        </div>
                    )}
                  </TabsContent>
                </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const AnalysisResult = ({ analysis }: { analysis: AnalyzeImageOutput }) => (
  <div className="space-y-4">
    <div>
      <h4 className="font-semibold text-foreground mb-1">AI Summary</h4>
      <p className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md">{analysis.summary}</p>
    </div>
    <div>
      <h4 className="font-semibold text-foreground mb-2">Potential Conditions</h4>
      <div className="space-y-2">
        {analysis.potentialConditions.map((item, i) => (
          <div key={i} className="p-2 border rounded-md">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">{item.condition}</p>
              <Badge variant="secondary">{(item.confidence * 100).toFixed(0)}%</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{item.rationale}</p>
          </div>
        ))}
      </div>
    </div>
     <div>
      <h4 className="font-semibold text-foreground mb-2">Observations</h4>
      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
        {analysis.observations.map((obs, i) => <li key={i}>{obs}</li>)}
      </ul>
    </div>
    <div className="!mt-6 p-2 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 text-xs rounded-md flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>This is an AI-generated analysis and is not a substitute for professional medical advice.</span>
    </div>
  </div>
);

const AnalysisSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div>
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-12 w-full" />
        </div>
         <div>
            <Skeleton className="h-5 w-1/2 mb-2" />
            <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
        </div>
        <div>
            <Skeleton className="h-5 w-1/3 mb-2" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-4 w-full" />
            </div>
        </div>
    </div>
);


// Helper Label component (if not already global)
const Label = ({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & {children: React.ReactNode}) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" {...props}>
    {children}
  </label>
);
