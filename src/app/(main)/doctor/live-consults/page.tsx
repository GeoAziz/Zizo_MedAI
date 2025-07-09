
"use client";
import { useState, useEffect, useRef } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, UserCircle, Video, Mic, Send, Paperclip, Sparkles, Brain, Activity, FileText, BarChart3, AlertTriangle, PhoneOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { suggestDiagnosis, type SuggestDiagnosisInput, type SuggestDiagnosisOutput } from '@/ai/flows/suggest-diagnosis';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: 'patient' | 'doctor' | 'ai';
  text: string;
  timestamp: string;
}

interface Patient {
    id: string;
    name: string;
    age: number;
    condition: string;
    symptoms: string;
    medicalHistory: string;
}

export default function DoctorLiveConsultsPage() {
  const mockPatientsData: Patient[] = [
    { id: "P001", name: "Johnathan P. Doe", age: 38, condition: "Hypertension, Asthma", symptoms: "Persistent cough, mild fever, and fatigue for the last 3 days.", medicalHistory: "Asthma diagnosed in childhood, seasonal allergies. Allergic to penicillin." },
    { id: "P002", name: "Jane A. Smith", age: 45, condition: "Diabetes Type 2", symptoms: "Increased thirst, frequent urination, and unexplained weight loss.", medicalHistory: "Family history of diabetes. Takes Metformin 500mg daily." },
    { id: "P003", name: "Alice B. Brown", age: 29, condition: "Migraines", symptoms: "Severe throbbing headache on one side of the head, nausea, and sensitivity to light.", medicalHistory: "Occasional migraines, no other chronic conditions." },
  ];

  const [isConsultActive, setIsConsultActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentTime, setCurrentTime] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const { toast } = useToast();

  const chatAreaRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const patientIdFromQuery = searchParams.get('patientId');

  useEffect(() => {
    if (patientIdFromQuery && mockPatientsData.find(p => p.id === patientIdFromQuery)) {
      setSelectedPatientId(patientIdFromQuery);
    }
  }, [patientIdFromQuery, mockPatientsData]);

  const patientDetails = mockPatientsData.find(p => p.id === selectedPatientId);

  useEffect(() => {
    // Ensure this runs only on the client
    const updateClientTime = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    updateClientTime();
    const timer = setInterval(updateClientTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartConsult = () => {
    if (!patientDetails) {
        toast({ title: "No Patient Selected", description: "Please select a patient to start the consultation.", variant: "destructive" });
        return;
    }
    setIsConsultActive(true);
    setMessages([
      { id: '1', sender: 'ai', text: `Zizo_MediAI: Hello Dr. Welcome. Patient ${patientDetails.name} (${patientDetails.id}) is ready for consultation. Reported Symptoms: ${patientDetails.symptoms}. Medical history: ${patientDetails.medicalHistory}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  };
  
  const handleEndConsult = () => {
    setIsConsultActive(false);
    setMessages([]);
    // setSelectedPatientId(null); // Optionally reset patient selection
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !patientDetails) return;
    const newMsg: Message = {
      id: (messages.length + 1).toString(),
      sender: 'doctor',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");

    // Mock AI response for simple chat
    setTimeout(() => {
      const aiResponses = [
        "Zizo_MediAI: Understood. I've logged that note. Are there any other observations?",
        "Zizo_MediAI: Noted. Is there anything else I can assist with?",
        "Zizo_MediAI: Acknowledged. I'm ready for your next command.",
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, {
        id: (prev.length + 1).toString(),
        sender: 'ai',
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };
  
  const handleSuggestDiagnosis = async () => {
    if (!patientDetails) return;

    setIsDiagnosing(true);
    setMessages(prev => [...prev, {
        id: (prev.length + 1).toString(),
        sender: 'ai',
        text: "Zizo_MediAI: Analyzing patient data to suggest potential diagnoses. Please wait...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    try {
        const input: SuggestDiagnosisInput = {
            symptoms: patientDetails.symptoms,
            medicalHistory: patientDetails.medicalHistory,
        };
        const result = await suggestDiagnosis(input);
        
        let diagnosisText = "Zizo_MediAI: Based on the provided information, here are some potential diagnoses:\n";
        if (result && result.length > 0) {
            result.forEach(diag => {
                diagnosisText += `\n• ${diag.diagnosis} (Confidence: ${(diag.confidence * 100).toFixed(0)}%): ${diag.rationale}`;
            });
        } else {
            diagnosisText = "Zizo_MediAI: I was unable to determine a specific diagnosis based on the limited information. Further testing or more detailed symptoms may be required.";
        }

        setMessages(prev => [...prev, {
            id: (prev.length + 1).toString(),
            sender: 'ai',
            text: diagnosisText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

    } catch (error) {
        console.error("Error suggesting diagnosis:", error);
        toast({
            title: "AI Diagnosis Failed",
            description: "There was an error communicating with the AI service. Please try again.",
            variant: "destructive"
        });
         setMessages(prev => [...prev, {
            id: (prev.length + 1).toString(),
            sender: 'ai',
            text: "Zizo_MediAI: An error occurred while generating diagnoses. Please check the system logs.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    } finally {
        setIsDiagnosing(false);
    }
  };

  if (!isConsultActive) {
    return (
      <div className="space-y-6">
        <PageHeader title="Live Consultations" description="Start AI-augmented sessions with diagnostic tools." icon={Bot} />
        <Card className="shadow-xl rounded-xl text-center max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Start New Consultation</CardTitle>
            <CardDescription>Select a patient to initiate an AI-assisted live consultation session.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[250px] flex flex-col items-center justify-center p-6">
            <Bot className="h-20 w-20 text-primary/50 mb-6" />
             <div className="w-full max-w-xs space-y-4">
                <Select value={selectedPatientId || ""} onValueChange={setSelectedPatientId}>
                    <SelectTrigger className="w-full bg-input">
                        <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockPatientsData.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button size="lg" onClick={handleStartConsult} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!selectedPatientId}>
                  <Sparkles className="mr-2 h-5 w-5" /> Start Consult
                </Button>
             </div>
            {!selectedPatientId && <p className="text-sm text-muted-foreground mt-4">Please select a patient to begin.</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patientDetails) {
    // This case should ideally not be reached if isConsultActive is true but as a fallback:
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mb-4"/>
            <p className="text-lg font-semibold">Error: Patient details not found.</p>
            <Button onClick={() => setIsConsultActive(false)} className="mt-4">Go Back</Button>
        </div>
    );
  }


  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader 
        title={`Live Consult: ${patientDetails.name} (${patientDetails.id})`}
        description={`Ongoing AI-augmented session. Current time: ${currentTime}`}
        icon={Bot}
        actions={<Button variant="destructive" onClick={handleEndConsult}><PhoneOff className="mr-2 h-4 w-4"/>End Consultation</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Panel: Video & Patient Info */}
        <Card className="lg:col-span-2 shadow-xl rounded-xl flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="font-headline text-xl">Patient: {patientDetails.name} </CardTitle>
            <CardDescription>Age: {patientDetails.age} | Known Conditions: {patientDetails.condition}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center bg-secondary/30 dark:bg-secondary/10 p-2 relative overflow-hidden">
            <Image 
                src="https://placehold.co/600x350.png" 
                alt="Patient Video Feed Placeholder" 
                width={600} 
                height={350} 
                className="rounded-md shadow-md object-cover w-full h-full"
                data-ai-hint="video call doctor patient"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-card/80 dark:bg-card/50 p-3 rounded-lg shadow-lg backdrop-blur-sm">
              <Button variant="outline" size="icon" disabled title="Toggle Video"><Video className="h-5 w-5"/></Button>
              <Button variant="outline" size="icon" disabled title="Toggle Mic"><Mic className="h-5 w-5"/></Button>
            </div>
             <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button variant="outline" size="sm" asChild><Link href={`/doctor/charts?patientId=${patientDetails.id}`}><BarChart3 className="mr-2 h-4 w-4"/>View Chart</Link></Button>
                <Button variant="outline" size="sm" asChild><Link href={`/doctor/prescribe?patientId=${patientDetails.id}`}><FileText className="mr-2 h-4 w-4"/>e-Prescribe</Link></Button>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel: Chat & AI Tools */}
        <Card className="shadow-xl rounded-xl flex flex-col h-full">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Brain className="w-5 h-5 text-primary"/>Zizo_MediAI Assistant</CardTitle>
            <CardDescription>Chat and AI-powered insights for {patientDetails.name}.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            <ScrollArea className="flex-1 p-4" ref={chatAreaRef}>
              <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg shadow ${
                    msg.sender === 'doctor' ? 'bg-primary text-primary-foreground' :
                    msg.sender === 'patient' ? 'bg-muted text-muted-foreground' : 'bg-accent text-accent-foreground whitespace-pre-wrap'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'doctor' ? 'text-primary-foreground/70' : 
                      msg.sender === 'ai' ? 'text-accent-foreground/70' : 'text-muted-foreground/70'
                    } text-right`}>{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              </div>
            </ScrollArea>
            <div className="border-t p-3 space-y-2 flex-shrink-0">
                 <p className="text-xs text-muted-foreground text-center mb-1">AI Quick Actions:</p>
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" disabled><Activity className="mr-1 h-4 w-4"/> Check Vitals</Button>
                    <Button variant="outline" size="sm" onClick={handleSuggestDiagnosis} disabled={isDiagnosing}>
                        {isDiagnosing ? <Activity className="mr-1 h-4 w-4 animate-spin"/> : <Sparkles className="mr-1 h-4 w-4"/>}
                        Suggest Dx
                    </Button>
                    <Button variant="outline" size="sm" disabled>Order Test</Button>
                    <Button variant="outline" size="sm" disabled>Summarize</Button>
                </div>
            </div>
          </CardContent>
           <CardFooter className="border-t p-4 flex-shrink-0">
            <div className="flex w-full items-center gap-2">
              <Input 
                placeholder="Type message or command..." 
                className="flex-1 bg-input" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button variant="ghost" size="icon" disabled title="Attach File"><Paperclip className="h-5 w-5"/></Button>
              <Button onClick={handleSendMessage} title="Send Message"><Send className="h-5 w-5"/></Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
