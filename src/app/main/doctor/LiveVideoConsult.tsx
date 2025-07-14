import React, { useRef, useEffect, useState } from 'react';
import Peer from 'simple-peer';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, doc, setDoc } from 'firebase/firestore';

interface LiveVideoConsultProps {
  consultId: string;
  isInitiator: boolean;
}

export const LiveVideoConsult: React.FC<LiveVideoConsultProps> = ({ consultId, isInitiator }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(localStream => {
      setStream(localStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      const p = new Peer({ initiator: isInitiator, trickle: false, stream: localStream });
      setPeer(p);
      // Firestore signaling
      const signalsRef = collection(db, 'consults', consultId, 'signals');
      p.on('signal', async data => {
        await addDoc(signalsRef, { signal: data, sender: isInitiator ? 'initiator' : 'receiver' });
      });
      const unsub = onSnapshot(signalsRef, snap => {
        snap.docs.forEach(docSnap => {
          const { signal, sender } = docSnap.data();
          if ((isInitiator && sender === 'receiver') || (!isInitiator && sender === 'initiator')) {
            p.signal(signal);
          }
        });
      });
      p.on('stream', remoteStream => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
      return () => {
        unsub();
        p.destroy();
        localStream.getTracks().forEach(track => track.stop());
      };
    });
  }, [consultId, isInitiator]);

  return (
    <div className="flex gap-4">
      <div>
        <video ref={localVideoRef} autoPlay muted playsInline className="rounded-lg border w-64 h-48" />
        <div className="text-xs text-muted-foreground">You</div>
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay playsInline className="rounded-lg border w-64 h-48" />
        <div className="text-xs text-muted-foreground">Remote</div>
      </div>
    </div>
  );
};
