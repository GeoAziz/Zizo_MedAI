"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LayoutDashboard, Map, Server, Users, AlertOctagon, Activity, Network, GitFork } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function AdminDashboardPage() {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [nodes, setNodes] = useState<any[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(true);
  const [outbreakSummary, setOutbreakSummary] = useState<any>(null);
  const [loadingOutbreak, setLoadingOutbreak] = useState(true);
  const [resourceStats, setResourceStats] = useState<any>(null);
  const [loadingResource, setLoadingResource] = useState(true);
  const [aiLogStats, setAiLogStats] = useState<any>(null);
  const [loadingAiLogs, setLoadingAiLogs] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const docRef = doc(db, 'system_status', 'main');
        const docSnap = await getDoc(docRef);
        setSystemStatus(docSnap.exists() ? docSnap.data() : null);
      } catch (err) {
        setSystemStatus(null);
      } finally {
        setLoadingStatus(false);
      }
    }
    async function fetchNodes() {
      try {
        const snapshot = await getDocs(collection(db, 'facilities'));
        setNodes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setNodes([]);
      } finally {
        setLoadingNodes(false);
      }
    }
    async function fetchOutbreakSummary() {
      try {
        const docRef = doc(db, 'outbreak_monitor', 'summary');
        const docSnap = await getDoc(docRef);
        setOutbreakSummary(docSnap.exists() ? docSnap.data() : null);
      } catch (err) {
        setOutbreakSummary(null);
      } finally {
        setLoadingOutbreak(false);
      }
    }
    async function fetchResourceStats() {
      try {
        const docRef = doc(db, 'resource_dispatch', 'stats');
        const docSnap = await getDoc(docRef);
        setResourceStats(docSnap.exists() ? docSnap.data() : null);
      } catch (err) {
        setResourceStats(null);
      } finally {
        setLoadingResource(false);
      }
    }
    async function fetchAiLogStats() {
      try {
        const docRef = doc(db, 'ai_logs', 'stats');
        const docSnap = await getDoc(docRef);
        setAiLogStats(docSnap.exists() ? docSnap.data() : null);
      } catch (err) {
        setAiLogStats(null);
      } finally {
        setLoadingAiLogs(false);
      }
    }
    fetchStatus();
    fetchNodes();
    fetchOutbreakSummary();
    fetchResourceStats();
    fetchAiLogStats();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Zizo_HealOps Command: System overview and management tools." icon={LayoutDashboard} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Server className="w-5 h-5" />System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingStatus ? (
              <div className="text-center text-muted-foreground">Loading system status...</div>
            ) : systemStatus ? (
              <>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">Total Users:</p>
                  <p className="font-bold text-lg text-primary">{systemStatus.totalUsers}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">Active Doctors:</p>
                  <p className="font-bold text-lg text-green-600">{systemStatus.activeDoctors ?? systemStatus.totalDoctors}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">Active Patients:</p>
                  <p className="font-bold text-lg text-blue-600">{systemStatus.activePatients ?? systemStatus.totalPatients}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">API Latency:</p>
                  <p className="font-bold text-lg text-orange-500">{systemStatus.apiLatencyMs} ms</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">Last Updated:</p>
                  <p className="font-bold text-lg text-primary">{systemStatus.lastUpdated?.toDate?.().toLocaleString?.() || 'N/A'}</p>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">No system status data found.</div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Map className="w-5 h-5" />System Map</CardTitle>
            <CardDescription>Real-time view of all hospital/clinic nodes.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {loadingNodes ? (
              <div className="text-center text-muted-foreground">Loading nodes...</div>
            ) : nodes.length > 0 ? (
              <ul className="space-y-2">
                {nodes.map(node => (
                  <li key={node.id} className="flex justify-between items-center p-2 border rounded">
                    <span>{node.name || node.id}</span>
                    <span className="text-xs">{node.status || "Unknown"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground">No facility data found.</div>
            )}
          </CardContent>
          <CardFooter>
             <Button asChild variant="outline" className="w-full">
                <Link href="/admin/system-map">View Full Map</Link>
             </Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><Activity className="w-5 h-5" />Outbreak Monitor</CardTitle>
            <CardDescription className="text-primary-foreground/80">AI predictions, heatmaps, and simulations.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingOutbreak ? (
              <div className="text-center text-primary-foreground/80">Loading outbreak summary...</div>
            ) : outbreakSummary ? (
              <>
                <div className="flex justify-between items-center p-3 bg-background/20 rounded-md">
                  <p className="text-primary-foreground">Current Alert:</p>
                  <p className="font-bold text-lg text-destructive">{outbreakSummary.currentAlertLevel}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/20 rounded-md">
                  <p className="text-primary-foreground">Predicted Cases (7d):</p>
                  <p className="font-bold text-lg">{outbreakSummary.predictedCasesNextWeek}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/20 rounded-md">
                  <p className="text-primary-foreground">Confidence:</p>
                  <p className="font-bold text-lg">{outbreakSummary.confidence}%</p>
                </div>
              </>
            ) : (
              <div className="text-center text-primary-foreground/80">No outbreak data found.</div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full bg-background/20 hover:bg-background/30 border-primary-foreground text-primary-foreground hover:text-primary-foreground">
                <Link href="/admin/outbreak-monitor">Access Monitor</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Users className="w-5 h-5" />User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage roles, permissions, and view activity logs.</p>
          </CardContent>
           <CardFooter>
             <Button asChild variant="outline" className="w-full">
                <Link href="/admin/user-management">Manage Users</Link>
             </Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Network className="w-5 h-5" />Resource Dispatch</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingResource ? (
              <div className="text-center text-muted-foreground">Loading resource stats...</div>
            ) : resourceStats ? (
              <>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">Available:</p>
                  <p className="font-bold text-lg text-green-600">{resourceStats.available}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">En Route:</p>
                  <p className="font-bold text-lg text-blue-600">{resourceStats.enRoute}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">On Scene:</p>
                  <p className="font-bold text-lg text-orange-500">{resourceStats.onScene}</p>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">No resource data found.</div>
            )}
          </CardContent>
           <CardFooter>
             <Button asChild variant="outline" className="w-full">
                <Link href="/admin/resource-dispatch">Dispatch Resources</Link>
             </Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><GitFork className="w-5 h-5" />AI Logs Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAiLogs ? (
              <div className="text-center text-muted-foreground">Loading AI log stats...</div>
            ) : aiLogStats ? (
              <>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">Total Logs:</p>
                  <p className="font-bold text-lg text-primary">{aiLogStats.totalLogs}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">Success Rate:</p>
                  <p className="font-bold text-lg text-green-600">{aiLogStats.successRate}%</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-md">
                  <p className="text-foreground">Last Log:</p>
                  <p className="font-bold text-lg text-primary">{aiLogStats.lastLogTime || 'N/A'}</p>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">No AI log data found.</div>
            )}
          </CardContent>
           <CardFooter>
             <Button asChild variant="outline" className="w-full">
                <Link href="/admin/ai-logs">View AI Logs</Link>
             </Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg rounded-xl md:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><AlertOctagon className="w-5 h-5" />Live Status Board & Incident Reporting</CardTitle>
             <CardDescription>Monitor beds, ventilators, triage load, and manage medical issues/errors.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>Bed Occupancy: <span className="font-bold">95%</span></div>
              <div>Avg. Wait Time: <span className="font-bold">15m</span></div>
              <div>Ventilators Available: <span className="font-bold">12</span></div>
              <div>Triage Load: <span className="font-bold">Medium</span></div>
              <div className="text-muted-foreground">Live status board and incident reporting module is currently under development.</div>
            </div>
          </CardContent>
           <CardFooter>
             <Button variant="outline" disabled className="w-full">Access Full Status Board</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
