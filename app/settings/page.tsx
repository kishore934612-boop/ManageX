"use client"

import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { ThemeToggle } from "@/components/settings/theme-toggle"
import { DataManagement } from "@/components/settings/data-management"
import { VoiceSettings } from "@/components/settings/voice-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useSettingsStore } from "@/lib/settings-store"

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore()

  const handleInstallPWA = () => {
    // This would be handled by the PWA install prompt
    if ("serviceWorker" in navigator) {
      alert("This app can be installed! Look for the install button in your browser.")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your Managex experience</p>
        </header>

        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Icons.palette className="h-4 w-4" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ThemeToggle />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Font Size</div>
                  <div className="text-sm text-muted-foreground">Adjust text size for better readability</div>
                </div>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value: "small" | "medium" | "large") => updateSettings({ fontSize: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Icons.bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">Get notified about due tasks</div>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* General */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Icons.settings className="h-4 w-4" />
                General
              </CardTitle>
              <CardDescription>General app preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Auto-save</div>
                  <div className="text-sm text-muted-foreground">Automatically save changes</div>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Export Format</div>
                  <div className="text-sm text-muted-foreground">Default format for exports</div>
                </div>
                <Select
                  value={settings.exportFormat}
                  onValueChange={(value: "text" | "pdf") => updateSettings({ exportFormat: value })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">TXT</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Voice Settings */}
          <VoiceSettings />

          {/* PWA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Icons.download className="h-4 w-4" />
                Install App
              </CardTitle>
              <CardDescription>Install Managex as a native app</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleInstallPWA} className="w-full bg-transparent">
                <Icons.download className="h-4 w-4 mr-2" />
                Install Managex
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <DataManagement />

          {/* Reset */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Icons.settings className="h-4 w-4" />
                Reset Settings
              </CardTitle>
              <CardDescription>Restore default settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={resetSettings} className="w-full bg-transparent">
                <Icons.settings className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
