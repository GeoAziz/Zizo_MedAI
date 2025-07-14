import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Thermometer, Wind, Droplets } from "lucide-react"; // Added Droplets for O2
// import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

interface VitalSignProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  unit: string;
  colorClass: string;
}

function VitalSign({ icon: Icon, label, value, unit, colorClass }: VitalSignProps) {
  return (
    <div className={`flex items-center space-x-3 transition-all duration-500 animate-pulse`} role="group" aria-label={label}>
      <div className={`rounded-full p-2 ${colorClass} bg-opacity-10`} aria-hidden="true">
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground" id={`vital-label-${label}`}>{label}</p>
        <p className="text-lg font-semibold text-foreground" aria-labelledby={`vital-label-${label}`}> 
          {value !== undefined && value !== null && value !== "-" ? (
            <>{value} <span className="text-xs text-muted-foreground">{unit}</span></>
          ) : (
            <span className="text-xs text-muted-foreground">No data</span>
          )}
        </p>
      </div>
    </div>
  );
}

interface Vitals {
  heartRate: { value: any; unit: string };
  temperature: { value: any; unit: string };
  oxygen: { value: any; unit: string };
  bloodPressure?: { value: any; unit: string };
  respiration?: { value: any; unit: string };
  // Add more vitals as needed
}

interface VitalsCardProps {
  vitals: Vitals;
  title?: string;
}

export function VitalsCard({ vitals, title = "Current Vitals" }: VitalsCardProps) {
  // Error boundary for vitals
  if (!vitals || !vitals.heartRate || !vitals.temperature || !vitals.oxygen) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Vitals data unavailable. Please check your device or connection.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-lg rounded-lg" role="region" aria-label="Vitals Overview">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <VitalSign
          icon={Heart}
          label="Heart Rate"
          value={vitals.heartRate.value}
          unit={vitals.heartRate.unit}
          colorClass="text-red-500"
        />
        <VitalSign
          icon={Thermometer}
          label="Temperature"
          value={vitals.temperature.value}
          unit={vitals.temperature.unit}
          colorClass="text-orange-500"
        />
        <VitalSign
          icon={Droplets}
          label="Oxygen Sat."
          value={vitals.oxygen.value}
          unit={vitals.oxygen.unit}
          colorClass="text-blue-500"
        />
        {vitals.bloodPressure && (
          <VitalSign
            icon={Wind}
            label="Blood Pressure"
            value={vitals.bloodPressure.value}
            unit={vitals.bloodPressure.unit}
            colorClass="text-purple-500"
          />
        )}
        {vitals.respiration && (
          <VitalSign
            icon={Wind}
            label="Respiration"
            value={vitals.respiration.value}
            unit={vitals.respiration.unit}
            colorClass="text-green-500"
          />
        )}
        {/* Example: Add more vitals here as needed */}
      </CardContent>
    </Card>
  );
}

// Live vitals hook for real-time updates from Firestore
export function useLiveVitals(userId: string) {
  const [vitals, setVitals] = useState<Vitals | null>(null);
  useEffect(() => {
    if (!userId) return;
    const vitalsRef = collection(doc(collection(db, "users"), userId), "vitals");
    const unsubscribe = onSnapshot(vitalsRef, (snapshot) => {
      let latest: any = null;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!latest || (data.createdAt && data.createdAt.toMillis() > (latest.createdAt?.toMillis?.() ?? 0))) {
          latest = data;
        }
      });
      if (latest) {
        setVitals({
          heartRate: { value: latest.heartRate ?? "-", unit: "bpm" },
          temperature: { value: latest.temperature ?? "-", unit: "°C" },
          oxygen: { value: latest.oxygen ?? "-", unit: "%" },
          bloodPressure: latest.bloodPressure ? { value: latest.bloodPressure, unit: "mmHg" } : undefined,
          respiration: typeof latest.respiration === "number" ? { value: latest.respiration, unit: "rpm" } : undefined,
        });
      }
    });
    return () => unsubscribe();
  }, [userId]);
  return vitals;
}

// EmergencyTrackingCard: Shows ambulance location on Google Maps and telehealth call button
interface EmergencyTrackingCardProps {
  ambulanceLat: number;
  ambulanceLng: number;
  patientLat: number;
  patientLng: number;
}

export function EmergencyTrackingCard({ ambulanceLat, ambulanceLng, patientLat, patientLng }: EmergencyTrackingCardProps) {
  const [showCall, setShowCall] = useState(false);
  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">Ambulance Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <iframe
            title="Ambulance Location"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: 8 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${ambulanceLat},${ambulanceLng}&destination=${patientLat},${patientLng}&zoom=14`}
          />
        </div>
        <Button variant="outline" className="w-full" onClick={() => setShowCall(true)}>
          Start Telehealth Video Call
        </Button>
        {showCall && <TelehealthCallModal onClose={() => setShowCall(false)} />}
      </CardContent>
    </Card>
  );
}

// TelehealthCallModal: Real WebRTC video call implementation
import { useRef, useEffect } from "react";

function TelehealthCallModal({ onClose }: { onClose: () => void }) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    let localStream: MediaStream;
    let peerConnection: RTCPeerConnection;
    let signalingSocket: WebSocket;
    let roomId = "demo-room";
    let signalingUrl = "wss://webrtc-signaling.zizomed.ai/session";

    async function startWebRTC() {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      peerConnection = new RTCPeerConnection();
      peerRef.current = peerConnection;
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      signalingSocket = new WebSocket(signalingUrl);
      signalingSocket.onopen = () => {
        signalingSocket.send(JSON.stringify({ type: "join", roomId }));
      };
      signalingSocket.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "offer") {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.offer));
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          signalingSocket.send(JSON.stringify({ type: "answer", answer, roomId }));
        } else if (msg.type === "answer") {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.answer));
        } else if (msg.type === "candidate") {
          await peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
        }
      };
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          signalingSocket.send(JSON.stringify({ type: "candidate", candidate: event.candidate, roomId }));
        }
      };
      // Create offer if first in room
      signalingSocket.onopen = async () => {
        signalingSocket.send(JSON.stringify({ type: "join", roomId }));
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        signalingSocket.send(JSON.stringify({ type: "offer", offer, roomId }));
      };
    }
    startWebRTC();
    return () => {
      if (peerRef.current) peerRef.current.close();
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">Telehealth Video Call</h2>
        <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-1/2 rounded" />
          <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 rounded" />
        </div>
        <Button variant="outline" className="w-full" onClick={onClose}>End Call</Button>
      </div>
    </div>
  );
}

// Hook to request FCM permission and listen for messages
export function useFCMNotifications() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const messaging = getMessaging();
      // Request permission and get token
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY })
            .then((currentToken) => {
              if (currentToken) {
                // Save token to Firestore for server-side notifications
                // You can call a backend API to associate this token with the user
                // Example: fetch('/api/save-fcm-token', { method: 'POST', body: JSON.stringify({ token: currentToken }) })
              }
            });
        }
      });
      // Listen for foreground messages
      onMessage(messaging, (payload) => {
        // Show a toast or alert for incoming notification
        alert(payload.notification?.title + "\n" + payload.notification?.body);
      });
    } catch (err) {
      // FCM not available or not supported
    }
  }, []);
}
