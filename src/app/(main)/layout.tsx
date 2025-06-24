"use client";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AuthProvider } from "@/context/auth-context";
import { SidebarProvider, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes"; 

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
      </ThemeProvider>
    </AuthProvider>
  );
}
