"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, Bell, LifeBuoy, LogOut, Settings, Sun, Moon } from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth, UserRole } from "@/context/auth-context";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navLinks, getNavItemsForRole } from "@/config/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { EmergencySosButton } from '@/components/emergency-sos-button';
import { useTheme } from "next-themes"; // Assuming next-themes is installed for theme toggling
import { useRouter } from "next/navigation";
export function AppHeader() {
  const { role, logout } = useAuth();
  const { theme, setTheme } = useTheme() || { theme: 'light', setTheme: () => {} }; // Provide fallback if useTheme is not available
  const router = useRouter();


  const currentNavItems = role ? getNavItemsForRole(role) : [];

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger className="text-foreground" />
      </div>
      <div className="hidden md:block">
        <Logo />
      </div>
      
      <div className="flex w-full items-center justify-end gap-2 md:gap-4">
        <EmergencySosButton />
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        {/* Avatar and profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-6 w-6 text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              if (role === 'admin') {
                router.push('/admin/settings');
              } else if (role === 'doctor') {
                router.push('/doctor/settings');
              } else if (role === 'patient') {
                router.push('/settings');
              } else {
                router.push('/settings');
              }
            }}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-6 w-6 text-primary" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Zizo User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {role ? `${role.charAt(0).toUpperCase() + role.slice(1)}` : 'Guest'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/support" className="flex items-center gap-2 cursor-pointer">
                <LifeBuoy className="h-4 w-4" />
                <span>Support</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
