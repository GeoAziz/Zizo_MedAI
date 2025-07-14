"use client";

import { useState, useEffect } from "react";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Waypoints, Orbit, Ambulance, UserCheck, AlertTriangle, RefreshCw, MapPin } from "lucide-react";
import Image from "next/image";
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';

type Resource = {
  id: string;
  name: string;
  type: string;
  status: string;
  location?: string;
  assignedTo?: string;
};

type Incident = {
  id: string;
  type: string;
  location: string;
  status: string;
};

export default function AdminResourceDispatchPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackModal, setTrackModal] = useState<{ open: boolean, resource: Resource | null }>({ open: false, resource: null });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const resSnap = await getDocs(collection(db, 'resources'));
      const resourcesArr = resSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unnamed Resource',
          type: data.type || 'Unknown',
          status: data.status || 'Unknown',
          location: data.location,
          assignedTo: data.assignedTo,
        } as Resource;
      });
      setResources(resourcesArr);
      const incSnap = await getDocs(collection(db, 'incidents'));
      const incidentsArr = incSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type || 'Unknown',
          location: data.location || 'Unknown',
          status: data.status || 'Unknown',
        } as Incident;
      });
      setIncidents(incSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident)));
      if (resourcesArr.length === 0 || incidentsArr.length === 0) {
        setError('No data found. Please verify Firestore seed, rules, and admin access.');
      }
    } catch (err) {
      setResources([]);
      setIncidents([]);
      setError('Error fetching data. Check Firestore connection and rules.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getResourceIcon = (type: string) => {
    if (type === "Drone") return <Orbit className="h-5 w-5 text-primary" />;
    if (type === "Ambulance") return <Ambulance className="h-5 w-5 text-red-500" />;
    if (type === "Medical Staff") return <UserCheck className="h-5 w-5 text-green-600" />;
    return null;
  };

  const handleDispatch = async () => {
    if (selectedResource && selectedIncident) {
      try {
        await updateDoc(doc(db, 'resources', selectedResource), {
          assignedTo: selectedIncident,
          status: 'En Route',
        });
        fetchData();
        alert(`Resource ${selectedResource} dispatched to incident ${selectedIncident}.`);
      } catch (err) {
        alert('Failed to dispatch resource. Check admin permissions and Firestore rules.');
      }
    } else {
      alert("Please select a resource and an incident to dispatch.");
    }
  };

  // 3D Sci-Fi Incident Map
  function IncidentNode({
    incident,
    position,
    assigned,
    onHover,
    onClick,
  }: {
    incident: Incident;
    position: [number, number, number];
    assigned: boolean;
    onHover: (incident: Incident | null) => void;
    onClick: (incident: Incident) => void;
  }) {
    return (
      <group position={position}>
        <mesh
          onPointerOver={() => onHover(incident)}
          onPointerOut={() => onHover(null)}
          onClick={() => onClick(incident)}
        >
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial color={assigned ? '#B249FF' : '#38bdf8'} emissive={assigned ? '#B249FF' : '#38bdf8'} emissiveIntensity={assigned ? 1.2 : 0.7} />
        </mesh>
        <Html position={[0, 3, 0]} center>
          <div className="px-2 py-1 rounded shadow-lg text-xs font-bold bg-background text-foreground border border-primary">
            {incident.type}<br /><span className="font-mono text-xs">{incident.location}</span>
          </div>
        </Html>
      </group>
    );
  }
  function ResourceNode({
    resource,
    position,
    onHover,
    onClick,
  }: {
    resource: Resource;
    position: [number, number, number];
    onHover: (resource: Resource | null) => void;
    onClick: (resource: Resource) => void;
  }) {
    return (
      <group position={position}>
        <mesh
          onPointerOver={() => onHover(resource)}
          onPointerOut={() => onHover(null)}
          onClick={() => onClick(resource)}
        >
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color={resource.type === 'Ambulance' ? '#f87171' : resource.type === 'Drone' ? '#22c55e' : '#6366f1'} emissive={resource.type === 'Ambulance' ? '#f87171' : resource.type === 'Drone' ? '#22c55e' : '#6366f1'} emissiveIntensity={1.2} />
        </mesh>
        <Html position={[0, 2, 0]} center>
          <div className="px-2 py-1 rounded shadow-lg text-xs font-bold bg-background text-foreground border border-muted">
            {resource.name}<br /><span className="font-mono text-xs">{resource.location}</span>
          </div>
        </Html>
      </group>
    );
  }
  function AssignmentLine({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
    return (
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute attach="attributes-position" args={[new Float32Array([...from, ...to]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#B249FF" linewidth={3} />
      </line>
    );
  }
  // Map positions for demo (spread out in grid)
  const incidentPositions: [number, number, number][] = incidents.map((inc, i) => [i * 10 - 20, 0, 0] as [number, number, number]);
  const resourcePositions: [number, number, number][] = resources.map((res, i) => [i * 8 - 16, -10, 0] as [number, number, number]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Resource Dispatch Control" 
        description="Manage and assign Zizo_MediFleet drones, ambulances, and staff to active incidents." 
        icon={Waypoints}
      />
      <div className="flex justify-end mb-2">
        <button className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded text-primary hover:bg-primary/20" onClick={fetchData}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispatch Panel */}
        <Card className="lg:col-span-1 shadow-xl rounded-xl">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg">Dispatch Resource</CardTitle>
            <CardDescription>Select a resource and incident to dispatch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Resource</label>
              <select className="w-full border rounded px-2 py-1" value={selectedResource || ''} onChange={e => setSelectedResource(e.target.value)}>
                <option value="">Select Resource</option>
                {resources.filter(r => r.status === 'Available').map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Incident</label>
              <select className="w-full border rounded px-2 py-1" value={selectedIncident || ''} onChange={e => setSelectedIncident(e.target.value)}>
                <option value="">Select Incident</option>
                {incidents.filter(i => i.status === 'Active' || i.status === 'Pending').map(i => (
                  <option key={i.id} value={i.id}>{i.type} ({i.location})</option>
                ))}
              </select>
            </div>
            <button className="w-full py-2 bg-primary text-white rounded font-bold mt-2" onClick={handleDispatch}>Dispatch</button>
          </CardContent>
          <CardFooter className="flex items-center p-3 bg-yellow-500/10 border-t border-yellow-500/30 rounded-b-xl text-sm text-yellow-700">
            <AlertTriangle className="h-8 w-8 mr-2 shrink-0" />
            Only admins can dispatch resources. All actions are logged.
          </CardFooter>
        </Card>
        {/* Resource List */}
        <Card className="lg:col-span-2 shadow-xl rounded-xl">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg">Resource List</CardTitle>
            <CardDescription>All available and assigned resources.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? <div>Loading resources...</div> : error ? <div className="text-red-500">{error}</div> : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Location</th>
                    <th className="p-2 text-left">Assigned To</th>
                    <th className="p-2 text-left">Track</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map(r => (
                    <tr key={r.id} className="border-b hover:bg-muted/10">
                      <td className="p-2">{getResourceIcon(r.type)}</td>
                      <td className="p-2 font-semibold">{r.name}</td>
                      <td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${r.status === 'Available' ? 'bg-green-100 text-green-700' : r.status === 'En Route' ? 'bg-yellow-100 text-yellow-700' : r.status === 'On Scene' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'}`}>{r.status}</span></td>
                      <td className="p-2">{r.location || '-'}</td>
                      <td className="p-2">{r.assignedTo || '-'}</td>
                      <td className="p-2">
                        <button className="px-2 py-1 bg-primary/10 rounded text-primary hover:bg-primary/20" disabled={!r.location} onClick={() => setTrackModal({ open: true, resource: r })}>Track</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Track Modal */}
      {trackModal.open && trackModal.resource && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[400px]">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Track Resource</h2>
            <div className="space-y-2">
              <div><span className="font-semibold">Name:</span> {trackModal.resource.name}</div>
              <div><span className="font-semibold">Type:</span> {trackModal.resource.type}</div>
              <div><span className="font-semibold">Status:</span> {trackModal.resource.status}</div>
              <div><span className="font-semibold">Location:</span> {trackModal.resource.location || 'Unknown'}</div>
              <div><span className="font-semibold">Assigned To:</span> {trackModal.resource.assignedTo || 'None'}</div>
            </div>
            <button className="mt-4 w-full py-2 bg-primary text-white rounded font-bold" onClick={() => setTrackModal({ open: false, resource: null })}>Close</button>
          </div>
        </div>
      )}
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Incident Map</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center bg-secondary/30 p-6 rounded-b-lg">
          <div className="col-span-2 h-[700px] bg-background rounded-lg shadow-inner w-full max-w-full relative flex items-center justify-center">
            <Canvas style={{ width: '100%', height: '700px', background: '#181A20' }} camera={{ position: [0, 0, 40], fov: 60 }}>
              <ambientLight intensity={1.2} />
              <pointLight position={[0, 40, 40]} intensity={2} />
              {/* Sci-fi grid plane */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[80, 80]} />
                <meshStandardMaterial color="#22223A" opacity={0.5} transparent />
              </mesh>
              {/* Incident nodes */}
              {incidents.map((incident, i) => (
                <IncidentNode key={incident.id} incident={incident} position={incidentPositions[i]} assigned={resources.some(r => r.assignedTo === incident.id)} onHover={() => {}} onClick={() => {}} />
              ))}
              {/* Resource nodes */}
              {resources.map((resource, i) => (
                <ResourceNode key={resource.id} resource={resource} position={resourcePositions[i]} onHover={() => {}} onClick={() => {}} />
              ))}
              {/* Assignment lines */}
              {resources.map((resource, i) => {
                if (resource.assignedTo) {
                  const incidentIdx = incidents.findIndex(inc => inc.id === resource.assignedTo);
                  if (incidentIdx !== -1) {
                    return <AssignmentLine key={resource.id} from={resourcePositions[i]} to={incidentPositions[incidentIdx]} />;
                  }
                }
                return null;
              })}
            </Canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
