
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboard, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DoctorDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <PageHeader title="Doctor Dashboard" description="Manage patients, consultations, and schedules." icon={LayoutDashboard} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-lg rounded-xl">
            <CardHeader>
              <Skeleton className="h-6 w-3/5" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary"><Users className="w-5 h-5" />Patient List</CardTitle>
          <Skeleton className="h-4 w-1/3 mt-1" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-[80px]" /></TableHead>
                <TableHead><Skeleton className="h-5 w-[120px]" /></TableHead>
                <TableHead><Skeleton className="h-5 w-[80px]" /></TableHead>
                <TableHead><Skeleton className="h-5 w-[100px]" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-5 w-[80px] ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(4)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
