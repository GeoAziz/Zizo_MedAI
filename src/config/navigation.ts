import type { NavItem } from '@/context/auth-context';
import {
  LayoutDashboard,
  Bot,
  ClipboardList,
  FlaskConical,
  Scan,
  HeartPulse,
  Users,
  Hospital,
  Network,
  ShieldAlert,
  Settings,
  LifeBuoy,
  Map,
  Clock,
  Activity,
  CalendarDays,
  FileText,
  Microscope,
  BarChart3,
  Brain,
  GitFork,
  Waypoints,
  Siren,
  Orbit
} from 'lucide-react';

export const navLinks: Record<string, NavItem[]> = {
  patient: [
    { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patient/ai-consult', label: 'AI Consultation', icon: Bot },
    { href: '/patient/appointments', label: 'Appointments', icon: CalendarDays, disabled: true },
    { href: '/patient/prescriptions', label: 'Prescriptions', icon: ClipboardList, disabled: true },
    { href: '/patient/lab-results', label: 'Lab Results', icon: FlaskConical, disabled: true },
    { href: '/patient/records', label: 'Medical Records', icon: FileText, disabled: true },
    { href: '/patient/virtual-body-viewer', label: 'Virtual Body', icon: Scan },
  ],
  doctor: [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctor/patient-list', label: 'Patient List', icon: Users, disabled: true },
    { href: '/doctor/live-consults', label: 'Live Consults', icon: Bot, disabled: true },
    { href: '/doctor/charts', label: 'Digital Charts', icon: BarChart3, disabled: true },
    { href: '/doctor/prescribe', label: 'Prescribe', icon: ClipboardList, disabled: true },
    { href: '/doctor/surgery-schedule', label: 'Surgery Schedule', icon: CalendarDays, disabled: true },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/system-map', label: 'System Map', icon: Map, disabled: true },
    { href: '/admin/resource-dispatch', label: 'Resource Dispatch', icon: Waypoints, disabled: true },
    { href: '/admin/outbreak-monitor', label: 'Outbreak Monitor', icon: Activity, disabled: true },
    { href: '/admin/user-management', label: 'User Management', icon: Users, disabled: true },
    { href: '/admin/ai-logs', label: 'AI Logs', icon: GitFork, disabled: true },
  ],
  shared: [ // These items might appear for multiple roles, or in a general section
    { href: '/facilities', label: 'Facilities', icon: Hospital },
    { href: '/emergency', label: 'Emergency', icon: Siren },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/support', label: 'Support', icon: LifeBuoy, disabled: true },
  ]
};

export const getNavItemsForRole = (role: string | null): NavItem[] => {
  if (!role) return [];
  const roleSpecificNavs = navLinks[role] || [];
  const sharedNavs = navLinks.shared || [];
  
  // Filter out shared items that might already be in role-specific (e.g. settings if admin has specific settings)
  const uniqueSharedNavs = sharedNavs.filter(sharedItem => 
    !roleSpecificNavs.find(roleItem => roleItem.label === sharedItem.label)
  );
  
  return [...roleSpecificNavs, ...uniqueSharedNavs];
};
