"use client";
import { useEffect, useState, useRef } from "react";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Map, Network } from "lucide-react";
import { Canvas } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';

export default function AdminSystemMapPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<any | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);
  const [hoveredFacility, setHoveredFacility] = useState<any | null>(null);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const snapshot = await getDocs(collection(db, 'facilities'));
        const facilityList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFacilities(facilityList);
      } catch (err) {
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    }
    async function fetchSystemStatus() {
      try {
        const statusDoc = await getDoc(doc(db, 'system_status', 'main'));
        setSystemStatus(statusDoc.exists() ? statusDoc.data() : null);
      } catch (err) {
        setSystemStatus(null);
      }
    }
    fetchFacilities();
    fetchSystemStatus();
  }, []);

  // Tooltip component for hovered node
  function FacilityTooltip({ facility, position }: { facility: any, position: [number, number, number] }) {
    return (
      <group position={position}>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[8, 2, 0.5]} />
          <meshStandardMaterial color="#fff" opacity={0.95} transparent />
        </mesh>
        <Html position={[0, 3, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="bg-white/90 text-xs rounded px-2 py-1 shadow-lg border border-gray-200">
            <strong>{facility.name}</strong><br />
            {facility.status} | {facility.type}
          </div>
        </Html>
      </group>
    );
  }

  // Add a subtle grid for spatial reference
  function GridPlane() {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#e0e7ef" opacity={0.3} transparent />
      </mesh>
    );
  }

  // Device definitions for the network map
  const networkDevices = [
    { id: 'isp', name: 'ISP Router', ip: '192.168.0.1', position: [0, 30, 0], color: '#38bdf8' },
    { id: 'core', name: 'MEDAI Core Router', ip: '10.0.0.1', position: [0, 15, 0], color: '#6366f1' },
    { id: 'fw', name: 'Firewall', ip: '10.0.0.2', position: [-10, 5, 0], color: '#fbbf24' },
    { id: 'switch', name: 'Data Center Switch', ip: '10.0.0.3', position: [10, 5, 0], color: '#22c55e' },
    { id: 'ai', name: 'AI Server', ip: '10.0.1.10', position: [20, -5, 0], color: '#B249FF' },
    { id: 'db', name: 'Database Server', ip: '10.0.1.20', position: [10, -15, 0], color: '#4A64FE' },
    { id: 'auth', name: 'Auth Server', ip: '10.0.1.30', position: [-10, -15, 0], color: '#E8EAFE' },
    { id: 'client', name: 'Web/Mobile Client', ip: '10.0.2.10', position: [-20, -5, 0], color: '#38bdf8' },
    { id: 'provider', name: 'Provider Terminal', ip: '10.0.2.20', position: [-20, -15, 0], color: '#22c55e' },
    { id: 'monitor', name: 'Monitoring Device', ip: '10.0.3.10', position: [20, -15, 0], color: '#fbbf24' },
    { id: 'sos', name: 'SOS Emergency Hub', ip: '10.0.99.99', position: [0, -25, 0], color: '#ff003c', highlight: true },
  ];

  // Connection lines (from, to)
  const networkConnections = [
    ['isp', 'core'],
    ['core', 'fw'],
    ['core', 'switch'],
    ['fw', 'switch'],
    ['switch', 'ai'],
    ['switch', 'db'],
    ['switch', 'auth'],
    ['switch', 'client'],
    ['switch', 'provider'],
    ['switch', 'monitor'],
    ['switch', 'sos'],
  ];

  function DeviceNode({
    device,
    hovered,
    setHovered,
    setSelected
  }: {
    device: any,
    hovered: any,
    setHovered: (device: any | null) => void,
    setSelected: (device: any) => void
  }) {
    return (
      <group position={device.position}>
        <mesh
          onPointerOver={() => setHovered(device)}
          onPointerOut={() => setHovered(null)}
          onClick={() => setSelected(device)}
          scale={device.highlight ? 1.5 : 1}
        >
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color={hovered?.id === device.id ? '#B249FF' : device.color} emissive={device.highlight ? '#ff003c' : device.color} emissiveIntensity={device.highlight ? 1.5 : 0.5} />
        </mesh>
        <Html position={[0, 3, 0]} center>
          <div className={`px-2 py-1 rounded shadow-lg text-xs font-bold ${device.highlight ? 'bg-red-700 text-white' : 'bg-background text-foreground'}`}
            style={{ border: device.highlight ? '2px solid #ff003c' : '1px solid #B249FF', boxShadow: device.highlight ? '0 0 10px #ff003c' : '0 0 6px #B249FF' }}>
            {device.name}<br /><span className="font-mono text-xs">{device.ip}</span>
          </div>
        </Html>
      </group>
    );
  }

  function NetworkLines() {
    return networkConnections.map(([fromId, toId], idx) => {
      const from = networkDevices.find(d => d.id === fromId);
      const to = networkDevices.find(d => d.id === toId);
      if (!from || !to) return null;
      return (
        <Line key={idx} points={[from.position as [number, number, number], to.position as [number, number, number]]} color="#B249FF" lineWidth={2} transparent opacity={0.8} />
      );
    });
  }

  return (
    <div className="space-y-8 w-full max-w-[1800px] mx-auto px-4">
      <PageHeader title="System Map" description="Real-time visualization of all Zizo_MediAI interconnected nodes." icon={Map} />
      <Card className="shadow-xl rounded-xl w-full max-w-full">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Network className="w-6 h-6" />Live Network Visualization</CardTitle>
          <CardDescription>Interactive 3D map showing status, load, and connectivity of all facilities.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[700px] grid grid-cols-1 xl:grid-cols-3 gap-8 w-full max-w-full">
          <div className="col-span-2 h-[700px] bg-background rounded-lg shadow-inner w-full max-w-full relative flex items-center justify-center">
            <Canvas style={{ width: '100%', height: '700px', background: '#181A20' }} camera={{ position: [0, 0, 60], fov: 50 }}>
              <ambientLight intensity={1.2} />
              <pointLight position={[0, 40, 40]} intensity={2} />
              {/* Futuristic grid plane */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -30, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#22223A" opacity={0.5} transparent />
              </mesh>
              {/* Glowing network lines */}
              <NetworkLines />
              {/* Device nodes */}
              {networkDevices.map(device => (
                <DeviceNode key={device.id} device={device} hovered={hoveredFacility} setHovered={setHoveredFacility} setSelected={setSelectedFacility} />
              ))}
              {/* Add subtle glow effect for SOS node */}
              {(() => {
                const highlightDevice = networkDevices.find(d => d.highlight);
                return highlightDevice ? (
                  <mesh position={highlightDevice.position as [number, number, number]}>
                    <sphereGeometry args={[3.5, 32, 32]} />
                    <meshStandardMaterial color="#ff003c" emissive="#ff003c" emissiveIntensity={2} opacity={0.3} transparent />
                  </mesh>
                ) : null;
              })()}
            </Canvas>
            {/* Floating info panel for selected node */}
            {selectedFacility && (
              <div className="absolute top-8 left-8 bg-white/95 rounded-lg shadow-xl border border-primary p-6 z-20 w-96">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xl text-primary">{selectedFacility.name}</span>
                  <button className="text-xs text-muted-foreground hover:text-primary" onClick={() => setSelectedFacility(null)}>Close</button>
                </div>
                <div className="space-y-2">
                  <div>IP: <span className="font-mono">{selectedFacility.ip}</span></div>
                  <div>Type: <span>{selectedFacility.id}</span></div>
                  {selectedFacility.highlight && <div className="font-bold text-red-600">SOS Emergency Hub</div>}
                </div>
              </div>
            )}
          </div>
          {/* Node Status Panel */}
          <div className="w-full max-w-lg space-y-4 p-6 bg-card rounded-lg shadow flex flex-col justify-start">
            <h3 className="font-semibold text-xl text-foreground border-b pb-2 mb-2">Node Status Overview</h3>
            {loading ? (
              <div>Loading...</div>
            ) : facilities.length > 0 ? (
              facilities.map(node => (
                <div key={node.id} className="p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${node.status === 'Online' || node.status === 'Active' ? 'text-green-600' : node.status === 'Offline' || node.status === 'Inactive' ? 'text-red-500' : node.status === 'Busy' || node.status === 'Warning' ? 'text-yellow-500' : 'text-foreground'}`}>{node.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-muted/30">{node.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{node.type} - {node.region}</p>
                  <p className="text-xs text-muted-foreground">Load: <span className={`font-medium ${node.load === "High" ? "text-orange-500" : "text-foreground"}`}>{node.load}</span></p>
                </div>
              ))
            ) : (
              <div>No facility data found.</div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-full">
        <Card className="shadow-xl rounded-xl w-full">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            {systemStatus ? (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold">Total Users</p>
                  <p>{systemStatus.totalUsers}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Doctors</p>
                  <p>{systemStatus.totalDoctors}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Patients</p>
                  <p>{systemStatus.totalPatients}</p>
                </div>
                <div>
                  <p className="font-semibold">API Latency (ms)</p>
                  <p>{systemStatus.apiLatencyMs}</p>
                </div>
              </div>
            ) : (
              <div>No system status data found.</div>
            )}
          </CardContent>
        </Card>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        This system map and status board are now powered by live Firestore data and 3D visualization. Layout is fully responsive for wide screens.
      </p>
    </div>
  );
}
