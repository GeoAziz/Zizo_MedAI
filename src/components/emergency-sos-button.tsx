"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Siren } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmergencySosButton() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSosClick = () => {
    toast({
      title: "Emergency SOS Activated!",
      description: "Dispatching Zizo_MediFleet. Navigating to emergency tracking.",
      variant: "destructive",
      duration: 5000,
    });
    // Navigate to emergency tracking page or show a modal
    router.push('/emergency/tracking');
  };

  return (
    <Button
      variant="destructive"
      size="default"
      className="rounded-full shadow-lg hover:scale-105 transition-transform animate-pulse-slow"
      onClick={handleSosClick}
    >
      <Siren className="mr-2 h-5 w-5" />
      SOS
    </Button>
  );
}

// Add to globals.css or a specific animation file if not already present:
// @keyframes pulse-slow {
//   0%, 100% { opacity: 1; transform: scale(1); }
//   50% { opacity: 0.8; transform: scale(1.02); }
// }
// .animate-pulse-slow {
//   animation: pulse-slow 2s infinite ease-in-out;
// }
// For Tailwind, add to tailwind.config.js:
// theme: {
//   extend: {
//     animation: {
//       'pulse-slow': 'pulse-slow 2s infinite ease-in-out',
//     },
//     keyframes: {
//       'pulse-slow': {
//         '0%, 100%': { opacity: '1', transform: 'scale(1)' },
//         '50%': { opacity: '0.8', transform: 'scale(1.02)' },
//       },
//     },
//   },
// },
