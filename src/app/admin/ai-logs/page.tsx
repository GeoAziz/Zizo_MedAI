"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitFork, Search, Filter, CheckCircle, AlertTriangle, XCircle, Eye, Code, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface AiLogEntry {
  id: string;
  timestamp: string;
  flowName: string;
  userId?: string;
  status: 'Success' | 'Failure' | 'Running' | 'Warning';
  durationMs: number;
  inputPayload?: object;
  outputPayload?: object;
  errorMessage?: string;
}

export default function AdminAiLogsPage() {
  const [aiLogs, setAiLogs] = useState<AiLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [flowFilter, setFlowFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AiLogEntry | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const logsSnap = await getDocs(collection(db, 'ai_logs'));
        setAiLogs(logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as AiLogEntry));
      } catch (err) {
        setAiLogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const getStatusIcon = (status: AiLogEntry['status']) => {
    if (status === "Success") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "Failure") return <XCircle className="h-4 w-4 text-red-500" />;
    if (status === "Warning") return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (status === "Running") return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    return null;
  };

  const filteredLogs = aiLogs.filter(log =>
    ((log.flowName || "").toLowerCase().includes(searchTerm.toLowerCase()) || ((log.userId || "").toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (flowFilter === 'all' || log.flowName === flowFilter)
  );
  
  // Extract unique flow names for filter dropdown
  const flowNames = Array.from(new Set(aiLogs.map(log => log.flowName)));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Zizo_MediAI Operational Logs" 
        description="Review AI decision trees, flow executions, and system performance." 
        icon={GitFork}
      />
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="font-headline text-xl">AI Flow Audit Trail</CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by Flow Name or User ID..." 
                        className="pl-10 bg-input w-full md:min-w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={flowFilter} onValueChange={setFlowFilter}>
                    <SelectTrigger className="w-full md:w-[200px] bg-input">
                        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Filter by flow" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Flows</SelectItem>
                        {flowNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground">Loading AI logs...</p>
            </div>
          ) : filteredLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Flow Name</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration (ms)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.flowName}</TableCell>
                    <TableCell>{log.userId || "N/A"}</TableCell>
                    <TableCell className="flex items-center gap-1">{getStatusIcon(log.status)} {log.status}</TableCell>
                    <TableCell>{log.durationMs}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}><Eye className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        {selectedLog && selectedLog.id === log.id && (
                           <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2"><Code className="w-5 h-5 text-primary"/>Log Details: {selectedLog.id}</DialogTitle>
                                <DialogDescription>
                                    Flow: {selectedLog.flowName} | Status: {selectedLog.status} | Timestamp: {selectedLog.timestamp}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto p-1">
                                <h4 className="font-semibold">Input Payload:</h4>
                                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                                    {JSON.stringify(selectedLog.inputPayload, null, 2) || "No input payload."}
                                </pre>
                                <h4 className="font-semibold">Output Payload / Result:</h4>
                                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                                    {JSON.stringify(selectedLog.outputPayload, null, 2) || (selectedLog.status === 'Failure' || selectedLog.status === 'Warning' ? selectedLog.errorMessage : "No output payload.")}
                                </pre>
                                {selectedLog.errorMessage && (
                                    <>
                                        <h4 className="font-semibold text-destructive">Error Message:</h4>
                                        <p className="text-destructive text-sm">{selectedLog.errorMessage}</p>
                                    </>
                                )}
                                <p className="text-sm"><span className="font-semibold">Duration:</span> {selectedLog.durationMs} ms</p>
                                <p className="text-sm"><span className="font-semibold">User ID:</span> {selectedLog.userId || "N/A"}</p>
                            </div>
                           </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
              <GitFork className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No AI logs found matching your criteria.</p>
            </div>
          )}
        </CardContent>
        {filteredLogs.length > 0 && (
          <CardFooter className="flex justify-center">
            <Button variant="outline" disabled>Load More Logs</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
