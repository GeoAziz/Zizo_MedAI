"use client";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default function SharedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <AppHeader />
              <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 bg-background">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
