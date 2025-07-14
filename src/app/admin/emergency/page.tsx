import { redirect } from 'next/navigation';

export default function EmergencyPage() {
  // Redirect to the tracking page by default when /emergency is accessed
  redirect('/emergency/tracking');
}
