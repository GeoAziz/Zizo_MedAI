
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, UserCircle, Video, Mic, Send, Paperclip, Sparkles, Brain, Activity, FileText, BarChart3 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'patient' | 'doctor' | 'ai';
  text: string;
  timestamp: string;
}

const mockPatientDetails = {
  id: "P001",
  name: "John Doe",
  age: 38,
  condition: "Hypertension, Asthma",
  symptoms: "Persistent cough, mild fever.",
  medicalHistory: "Asthma diagnosed in childhood, seasonal allergies.",
};

export default function DoctorLiveConsultsPage() {
  const [isConsultActive, setIsConsultActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Ensure this runs only on the client
    setCurrentTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartConsult = () => {
    setIsConsultActive(true);
    setMessages([
      { id: '1', sender: 'ai', text: `Zizo_MediAI: Hello Dr. Welcome. Patient ${mockPatientDetails.name} (${mockPatientDetails.id}) is ready for consultation. Reported Symptoms: ${mockPatientDetails.symptoms} Medical history: ${mockPatientDetails.medicalHistory}`, timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const newMsg: Message = {
      id: (messages.length + 1).toString(),
      sender: 'doctor',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (prev.length + 1).toString(),
        sender: 'ai',
        text: "Zizo_MediAI: Processing... Considering differential diagnoses based on symptoms. Would you like me to suggest potential diagnoses or relevant tests?",
        timestamp: new Date().toLocaleTimeString()
      }]);
    }, 1500);
  };

  if (!isConsultActive) {
    return (
      <div className="space-y-6">
        <PageHeader title="Live Consultations" description="Start AI-augmented sessions with diagnostic tools." icon={Bot} />
        <Card className="shadow-xl rounded-xl text-center">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Start New Consultation</CardTitle>
            <CardDescription>Select a patient and initiate an AI-assisted live consultation session.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col items-center justify-center">
            <Bot className="h-24 w-24 text-primary/50 mb-6" />
            <p className="text-muted-foreground mb-4">No active consultation. Ready to begin.</p>
            {/* This could be a Select component or an Input with search in a real app */}
            <Input type="text" placeholder="Enter Patient ID (e.g., P001)" defaultValue="P001" className="max-w-sm mx-auto mb-4 bg-input"/>
            <Button size="lg" onClick={handleStartConsult} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Sparkles className="mr-2 h-5 w-5" /> Start Consult with {mockPatientDetails.name}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader 
        title={`Live Consult: ${mockPatientDetails.name} (${mockPatientDetails.id})`}
        description={`Ongoing AI-augmented session. Current time: ${currentTime}`}
        icon={Bot}
        actions={<Button variant="destructive" onClick={() => setIsConsultActive(false)}>End Consultation</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Panel: Video & Patient Info */}
        <Card className="lg:col-span-2 shadow-xl rounded-xl flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="font-headline text-xl">Patient: {mockPatientDetails.name} <Badge variant="secondary">{mockPatientDetails.id}</Badge></CardTitle>
            <CardDescription>Age: {mockPatientDetails.age} | Known Conditions: {mockPatientDetails.condition}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center bg-secondary/30 p-2 relative overflow-hidden">
            <Image 
                src="https://placehold.co/600x350.png" 
                alt="Patient Video Feed Placeholder" 
                width={600} 
                height={350} 
                className="rounded-md shadow-md object-cover w-full h-full"
                data-ai-hint="video call doctor patient"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-card/80 p-3 rounded-lg shadow-lg">
              <Button variant="outline" size="icon" disabled><Video className="h-5 w-5"/></Button>
              <Button variant="outline" size="icon" disabled><Mic className="h-5 w-5"/></Button>
            </div>
             <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button variant="outline" size="sm" asChild><Link href={`/doctor/charts?patientId=${mockPatientDetails.id}`}><BarChart3 className="mr-2 h-4 w-4"/>View Chart</Link></Button>
                <Button variant="outline" size="sm" asChild><Link href={`/doctor/prescribe?patientId=${mockPatientDetails.id}`}><FileText className="mr-2 h-4 w-4"/>e-Prescribe</Link></Button>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel: Chat & AI Tools */}
        <Card className="shadow-xl rounded-xl flex flex-col h-full">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="font-headline text-lg flex items-center gap-2"><Brain className="w-5 h-5 text-primary"/>Zizo_MediAI Assistant</CardTitle>
            <CardDescription>Chat and AI-powered insights.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            <ScrollArea className="flex-1 p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg shadow ${
                    msg.sender === 'doctor' ? 'bg-primary text-primary-foreground' :
                    msg.sender === 'patient' ? 'bg-muted' : 'bg-accent text-accent-foreground'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'doctor' ? 'text-primary-foreground/70' : 
                      msg.sender === 'ai' ? 'text-accent-foreground/70' : 'text-muted-foreground'
                    } text-right`}>{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="border-t p-4 space-y-2 flex-shrink-0">
                 <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" disabled><Activity className="mr-1 h-4 w-4"/> Check Vitals</Button>
                    <Button variant="outline" size="sm" disabled><Sparkles className="mr-1 h-4 w-4"/> Suggest Dx</Button>
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
              <Button variant="ghost" size="icon" disabled><Paperclip className="h-5 w-5"/></Button>
              <Button onClick={handleSendMessage}><Send className="h-5 w-5"/></Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

    