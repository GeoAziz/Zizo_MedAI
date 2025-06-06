"use client";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { Stethoscope } from "lucide-react";
import { ThemeProvider } from "next-themes"; // Required for theme toggle

function MainAppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Stethoscope className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!role) {
    // AuthProvider will handle redirect, this is a fallback or can show a message
    return null; 
  }

  return (
    <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarRail />
          <div className="flex flex-1 flex-col">
            <AppHeader />
            <SidebarInset>
              <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-auto">
                {children}
              </main>
            </SidebarInset>
          </div>
        </div>
    </SidebarProvider>
  );
}


export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <MainAppLayoutContent>{children}</MainAppLayoutContent>
      </ThemeProvider>
    </AuthProvider>
  );
}
