"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import type { LatLngExpression } from "leaflet";

// If you get a type error for leaflet, run: npm i --save-dev @types/leaflet
// Or add a global.d.ts file with: declare module 'leaflet';
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

export default function EmergencyTrackingPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<any | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const unsubResources = onSnapshot(collection(db, 'resources'), snap => {
      setResources(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, err => {
      setError("Failed to load resources.");
      setLoading(false);
    });
    const unsubIncidents = onSnapshot(collection(db, 'incidents'), snap => {
      setIncidents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, err => {
      setError("Failed to load incidents.");
      setLoading(false);
    });
    setLoading(false);
    return () => {
      unsubResources();
      unsubIncidents();
    };
  }, []);

  // Filter logic for resources/incidents
  const filteredResources = filterType === 'all' ? resources : resources.filter(r => r.type === filterType);
  const filteredIncidents = filterType === 'all' ? incidents : incidents.filter(i => i.type === filterType);

  return (
    <div className="space-y-8 w-full max-w-full px-4">
      <PageHeader title="Emergency Response" description="Live tracking of Zizo_MediFleet and incident details." icon={Siren} />
      <Card className="shadow-xl rounded-xl w-full max-w-full">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">
            <MapPin className="w-7 h-7" /> Emergency Map (Geospatial)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full h-[900px] bg-black rounded-lg shadow-inner relative flex items-center justify-center">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-white text-lg">Loading...</div>
            ) : (
              typeof window !== "undefined" && (
                <MapContainer center={[0,0] as LatLngExpression} zoom={13} style={{ height: 900, width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {filteredResources.map(res => (
                    <Marker key={res.id} position={[res.coordinates?.lat || 0, res.coordinates?.lng || 0]}>
                      <Popup>
                        <strong>{res.name}</strong><br/>
                        Type: {res.type}<br/>
                        Status: {res.status}<br/>
                        {res.eta && <>ETA: {res.eta}<br/></>}
                        {res.lastUpdated && <>Last Updated: {res.lastUpdated}<br/></>}
                        {res.location && <>Location: {res.location}<br/></>}
                      </Popup>
                    </Marker>
                  ))}
                  {filteredIncidents.map(inc => (
                    <Marker key={inc.id} position={[inc.coordinates?.lat || 0, inc.coordinates?.lng || 0]}>
                      <Popup>
                        <strong>{inc.type}</strong><br/>
                        Status: {inc.status}<br/>
                        {inc.priority && <>Priority: {inc.priority}<br/></>}
                        {inc.lastUpdated && <>Last Updated: {inc.lastUpdated}<br/></>}
                        {inc.location && <>Location: {inc.location}<br/></>}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )
            )}
            {/* Filter controls */}
            <div className="absolute top-4 left-4 z-10 w-[300px] bg-black/80 text-white rounded-xl shadow-lg p-4">
              <label className="block text-xs font-semibold mb-1">Filter by Type:</label>
              <select className="w-full bg-black/60 text-white rounded px-2 py-1" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="all">All</option>
                <option value="Ambulance">Ambulance</option>
                <option value="Drone">Drone</option>
                <option value="Medical Staff">Medical Staff</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Outbreak Response">Outbreak Response</option>
              </select>
            </div>
            {/* Error state */}
            {error && (
              <div className="absolute bottom-4 left-4 bg-red-700 text-white px-4 py-2 rounded shadow-lg">{error}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
