 "use client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, UserCog, Palette, Languages, BellRing, ShieldCheck, HelpCircle, MessageSquare, Save } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme() || { theme: 'light', setTheme: () => {} };

  return (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Johnathan P. Doe" className="bg-input" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-input" />
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Palette className="w-5 h-5 text-accent" />Theme & Appearance</h3>
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
            </div>
            
            <div className="space-y-4 border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Languages className="w-5 h-5 text-accent" />Language</h3>
                 <Select defaultValue="en">
                    <SelectTrigger className="w-full md:w-[200px] bg-input">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="es" disabled>Español (Coming Soon)</SelectItem>
                        <SelectItem value="fr" disabled>Français (Coming Soon)</SelectItem>
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
              <p className="text-sm text-muted-foreground">Manage your connected health devices. (Feature in development)</p>
              <Button variant="outline" disabled>Connect New Wearable</Button>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border p-6">
            <Button className="ml-auto" disabled><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
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
              <Button variant="outline" className="w-full" disabled>AI Support Chat</Button>
              <Button variant="outline" className="w-full" disabled>Submit Bug Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
