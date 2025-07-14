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
    { href: '/main/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/main/patient/ai-consult', label: 'AI Consultation', icon: Bot },
    { href: '/main/patient/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/main/patient/prescriptions', label: 'Prescriptions', icon: ClipboardList },
    { href: '/main/patient/lab-results', label: 'Lab Results', icon: FlaskConical },
    { href: '/main/patient/records', label: 'Medical Records', icon: FileText },
    { href: '/main/patient/virtual-body-viewer', label: 'Virtual Body', icon: Scan },
  ],
  doctor: [
    { href: '/main/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/main/doctor/patient-list', label: 'Patient List', icon: Users },
    { href: '/main/doctor/live-consults', label: 'Live Consults', icon: Bot },
    { href: '/main/doctor/charts', label: 'Digital Charts', icon: BarChart3 },
    { href: '/main/doctor/prescribe', label: 'Prescribe', icon: ClipboardList },
    { href: '/main/doctor/surgery-schedule', label: 'Surgery Schedule', icon: CalendarDays },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/system-map', label: 'System Map', icon: Map },
    { href: '/admin/resource-dispatch', label: 'Resource Dispatch', icon: Waypoints },
    { href: '/admin/outbreak-monitor', label: 'Outbreak Monitor', icon: Activity },
    { href: '/admin/user-management', label: 'User Management', icon: Users },
    { href: '/admin/ai-logs', label: 'AI Logs', icon: GitFork },
    { href: '/admin/facilities', label: 'Facilities', icon: Hospital },
    { href: '/admin/emergency/tracking', label: 'Emergency', icon: Siren },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/support', label: 'Support', icon: LifeBuoy },
  ],
  shared: [ 
    { href: '/facilities', label: 'Facilities', icon: Hospital },
    { href: '/emergency', label: 'Emergency', icon: Siren },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/support', label: 'Support', icon: LifeBuoy },
  ]
};

export const getNavItemsForRole = (role: string | null): NavItem[] => {
  if (!role) return [];
  const roleSpecificNavs = navLinks[role] || [];
  const sharedNavs = navLinks.shared || [];
  
  const uniqueSharedNavs = sharedNavs.filter(sharedItem => 
    !roleSpecificNavs.find(roleItem => roleItem.label === sharedItem.label)
  );
  
  return [...roleSpecificNavs, ...uniqueSharedNavs];
};
