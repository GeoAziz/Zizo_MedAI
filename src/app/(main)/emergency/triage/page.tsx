import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Stethoscope, MessageSquare, Video, AlertTriangle } from "lucide-react";

export default function EmergencyTriagePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI Triage Interface" description="Provide information to assist the responding team." icon={Stethoscope} />

      <Card className="shadow-xl rounded-xl">
        <CardHeader className="bg-destructive/5">
          <CardTitle className="font-headline text-2xl text-destructive flex items-center gap-2">
            <AlertTriangle className="w-6 h-6"/> Urgent Information Needed
          </CardTitle>
          <CardDescription>Your quick responses can help us prepare better.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="symptoms-triage" className="text-lg font-semibold text-foreground block mb-2">Describe Current Symptoms / Situation:</Label>
            <Textarea id="symptoms-triage" placeholder="E.g., Chest pain, difficulty breathing, fell and can't get up..." className="min-h-[120px] bg-input focus:ring-destructive" />
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground mb-2">Is the patient conscious?</p>
            <RadioGroup defaultValue="unknown" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="conscious-yes" />
                <Label htmlFor="conscious-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="conscious-no" />
                <Label htmlFor="conscious-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="conscious-unknown" />
                <Label htmlFor="conscious-unknown">Unknown / Not Sure</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground mb-2">Is there any severe bleeding?</p>
             <RadioGroup defaultValue="unknown-bleed" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes-bleed" id="bleed-yes" />
                <Label htmlFor="bleed-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-bleed" id="bleed-no" />
                <Label htmlFor="bleed-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown-bleed" id="bleed-unknown" />
                <Label htmlFor="bleed-unknown">Unknown / Not Sure</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button variant="destructive" size="lg" className="w-full text-lg py-3" onClick={() => alert("Information submitted to dispatch.")}>
            Submit Information to Dispatch
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">Communication Options</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" size="lg" className="w-full" disabled>
            <MessageSquare className="mr-2 h-5 w-5" /> Chat with AI Triage Bot (Coming Soon)
          </Button>
          <Button variant="outline" size="lg" className="w-full" disabled>
            <Video className="mr-2 h-5 w-5" /> Start Secure Video Call (If Requested)
          </Button>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        This interface is for providing supplementary information. It does not replace direct communication with emergency dispatchers.
      </p>
    </div>
  );
}
