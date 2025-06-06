
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getNavItemsForRole } from "@/config/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { SheetTitle } from "@/components/ui/sheet"; // Import SheetTitle

export function AppSidebar() {
  const { role, logout } = useAuth();
  const pathname = usePathname();
  const navItems = getNavItemsForRole(role);
  const { state: sidebarState, isMobile } = useSidebar(); // Get sidebar state and isMobile flag

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 flex items-center justify-between">
         {/* Add a visually hidden title for accessibility in mobile sheet view */}
         {isMobile && <SheetTitle className="sr-only">Main menu</SheetTitle>}
         <Logo className={cn((sidebarState === "collapsed" && !isMobile) && "hidden")}/>
      </SidebarHeader>
      <SidebarContent asChild>
        <ScrollArea className="h-full">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== `/${role}/dashboard` && pathname.startsWith(item.href))}
                  tooltip={(sidebarState === "collapsed" && !isMobile) ? item.label : undefined}
                  disabled={item.disabled}
                  className="justify-start"
                >
                  <Link href={item.disabled ? "#" : item.href}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className={cn("truncate", (sidebarState === "collapsed" && !isMobile) && "sr-only")}>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-2" />
         <Button 
            variant="ghost" 
            className={cn(
                "w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                (sidebarState === "collapsed" && !isMobile) && "justify-center p-2"
            )} 
            onClick={logout}
            aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
          <span className={cn((sidebarState === "collapsed" && !isMobile) && "sr-only")}>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
