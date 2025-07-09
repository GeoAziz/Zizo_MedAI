import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Droplets, AlertTriangleIcon, Phone, ShieldAlert, Edit3 } from "lucide-react";

interface ProfileDetailProps {
  label: string;
  value: string | string[];
  icon: React.ElementType;
}

export default function EmergencyProfilePage() {
  const emergencyProfile = {
    fullName: "Johnathan Patient Doe",
    dob: "1985-05-15",
    bloodType: "O Positive (O+)",
    allergies: ["Penicillin", "Shellfish", "Dust Mites"],
    medicalConditions: ["Asthma (Mild)", "Hypertension (Medicated)"],
    medications: ["Ventolin Inhaler (As needed)", "Lisinopril 10mg (Daily)"],
    emergencyContacts: [
      { name: "Jane Doe", relationship: "Spouse", phone: "+1-555-0101" },
      { name: "Dr. Eva Core", relationship: "Primary Physician", phone: "+1-555-0102" },
    ],
  };

  function ProfileDetail({ label, value, icon: Icon }: ProfileDetailProps) {
    return (
      <div className="flex items-start space-x-3 py-3 border-b border-border last:border-b-0">
        <Icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          {Array.isArray(value) ? (
            <ul className="list-disc list-inside">
              {value.map((item, index) => <li key={index} className="text-base font-medium text-foreground">{item}</li>)}
            </ul>
          ) : (
            <p className="text-base font-medium text-foreground">{value}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Emergency Profile" 
        description="Key medical information for emergency situations." 
        icon={ShieldAlert}
        actions={<Button variant="outline" disabled><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</Button>}
      />

      <Card className="shadow-xl rounded-xl">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center gap-3">
            <UserCircle className="h-12 w-12 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl text-primary">{emergencyProfile.fullName}</CardTitle>
              <CardDescription>Date of Birth: {emergencyProfile.dob}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <ProfileDetail label="Blood Type" value={emergencyProfile.bloodType} icon={Droplets} />
          <ProfileDetail label="Allergies" value={emergencyProfile.allergies} icon={AlertTriangleIcon} />
          <ProfileDetail label="Ongoing Medical Conditions" value={emergencyProfile.medicalConditions} icon={UserCircle} />
          <ProfileDetail label="Current Medications" value={emergencyProfile.medications} icon={UserCircle} /> 
          
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2 flex items-center gap-2"><Phone className="h-5 w-5 text-primary"/>Emergency Contacts</h3>
            {emergencyProfile.emergencyContacts.map(contact => (
              <div key={contact.name} className="py-3 border-b border-border last:border-b-0">
                <p className="text-base font-medium text-foreground">{contact.name} <span className="text-sm text-muted-foreground">({contact.relationship})</span></p>
                <p className="text-sm text-accent">{contact.phone}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
       <Card className="bg-destructive/10 border-destructive/30 shadow-lg rounded-xl">
        <CardContent className="p-6 text-center text-destructive">
          <AlertTriangleIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="font-semibold">
            Ensure this information is always up-to-date. In an emergency, accuracy can be life-saving.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Note: Replace UserCircle for medications/conditions with more appropriate icons if available or desired.
// Example: Heart for Hypertension, Lung for Asthma, Pill for Medications.
