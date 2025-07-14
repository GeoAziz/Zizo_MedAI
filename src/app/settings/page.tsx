"use client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, UserCog, Palette, Languages, BellRing, ShieldCheck, HelpCircle, MessageSquare, Save } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth-context";
import { updateUserAction } from "@/actions/userActions";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import SharedLayout from "../(shared)/layout";

export default function SettingsPage() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme() || { theme: 'light', setTheme: () => {} };
  const [name, setName] = useState(user?.name || "Main Admin");
  const [email, setEmail] = useState(user?.email || "admin@zizomed.ai");
  const [language, setLanguage] = useState("en");
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [wearables, setWearables] = useState([
    { id: 'w1', name: 'Fitbit Charge 5', connected: true },
    { id: 'w2', name: 'Apple Watch', connected: false },
  ]);

  // Avatar upload handler (mock)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Save changes handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserAction(user?.uid || "admin_main", { name, email });
      toast({ title: "Saved!", description: "Your settings have been updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save changes." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SharedLayout>
      <div className="space-y-8">
        <PageHeader title="System Settings" description="Customize your Zizo_MediAI experience." icon={Settings} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Settings Card */}
          <Card className="lg:col-span-2 shadow-xl rounded-xl">
            <CardHeader className="bg-primary/5">
              <CardTitle className="font-headline text-xl text-primary flex items-center gap-2"><UserCog className="w-5 h-5" />Account Settings</CardTitle>
              <CardDescription>Manage your profile, preferences, and security.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Place all your account settings JSX here, as previously implemented. */}
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="flex flex-col space-y-1">
                  <span>Dark Mode</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Switch between light and dark themes.
                  </span>
                </Label>
                <Switch 
                  id="theme-toggle" 
                  checked={theme === 'dark'} 
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                  aria-label="Toggle dark mode"
                />
              </div>
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Languages className="w-5 h-5 text-accent" />Language</h3>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full md:w-[200px] bg-input">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-accent" />Security</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="2fa-toggle" className="flex flex-col space-y-1">
                    <span>Two-Factor Authentication (2FA)</span>
                    <span className="font-normal leading-snug text-muted-foreground">Enhance account security.</span>
                  </Label>
                  <Switch id="2fa-toggle" disabled aria-label="Toggle 2FA" />
                </div>
                <Button variant="outline" disabled>Change Password</Button>
              </div>
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><BellRing className="w-5 h-5 text-accent" />Linked Wearables</h3>
                <p className="text-sm text-muted-foreground">Manage your connected health devices.</p>
                <ul className="mb-2">
                  {wearables.map(w => (
                    <li key={w.id} className="flex items-center gap-2 mb-1">
                      <span className={w.connected ? 'text-green-600' : 'text-muted-foreground'}>{w.name}</span>
                      {w.connected ? <Button size="sm" variant="outline" onClick={() => setWearables(ws => ws.map(x => x.id === w.id ? { ...x, connected: false } : x))}>Disconnect</Button>
                        : <Button size="sm" variant="outline" onClick={() => setWearables(ws => ws.map(x => x.id === w.id ? { ...x, connected: true } : x))}>Connect</Button>}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" onClick={() => toast({ title: 'Connect Wearable', description: 'Feature coming soon.' })}>Connect New Wearable</Button>
              </div>
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><BellRing className="w-5 h-5 text-accent" />Notifications</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications-toggle" className="flex flex-col space-y-1">
                    <span>Enable Notifications</span>
                    <span className="font-normal leading-snug text-muted-foreground">Receive important system alerts and updates.</span>
                  </Label>
                  <Switch id="notifications-toggle" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} aria-label="Toggle notifications" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border p-6">
              <Button className="ml-auto" onClick={handleSave} disabled={isSaving}><Save className="mr-2 h-4 w-4"/>{isSaving ? "Saving..." : "Save Changes"}</Button>
            </CardFooter>
          </Card>
          {/* Support & Feedback Card */}
          <div className="space-y-8">
            <Card className="shadow-xl rounded-xl">
              <CardHeader className="bg-accent/10">
                <CardTitle className="font-headline text-xl text-accent flex items-center gap-2"><HelpCircle className="w-5 h-5" />Help & Tutorials</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">Access animated guides for each feature and learn how to make the most of Zizo_MediAI.</p>
                <Button variant="outline" className="w-full" disabled>View Tutorials</Button>
              </CardContent>
            </Card>
            <Card className="shadow-xl rounded-xl">
              <CardHeader className="bg-accent/10">
                <CardTitle className="font-headline text-xl text-accent flex items-center gap-2"><MessageSquare className="w-5 h-5" />Support & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">Encountered an issue or have a suggestion? Let us know!</p>
                <Button variant="outline" className="w-full" onClick={() => toast({ title: "Support Chat", description: "Feature coming soon." })}>AI Support Chat</Button>
                <Button variant="outline" className="w-full" onClick={() => toast({ title: "Bug Report", description: "Feature coming soon." })}>Submit Bug Report</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
}
