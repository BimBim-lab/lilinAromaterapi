
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { SiteSetting, InsertSiteSetting } from "@shared/schema";

export default function SettingsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async (data: InsertSiteSetting) => {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ description: "Setting berhasil diupdate!" });
    },
  });

  const getSetting = (key: string) => {
    return settings?.find((s: SiteSetting) => s.key === key)?.value || "";
  };

  const handleSubmit = (category: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updates: InsertSiteSetting[] = [];
    for (const [key, value] of formData.entries()) {
      updates.push({
        key: key as string,
        value: value as string,
        type: "text"
      });
    }

    Promise.all(updates.map(update => updateSettingMutation.mutateAsync(update)))
      .then(() => {
        toast({ description: `${category} settings berhasil diupdate!` });
      })
      .catch(() => {
        toast({ 
          description: `Gagal update ${category} settings`, 
          variant: "destructive" 
        });
      });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="contact">Kontak</TabsTrigger>
          <TabsTrigger value="social">Sosial Media</TabsTrigger>
          <TabsTrigger value="maps">Maps</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit("general", e)} className="space-y-4">
                <div>
                  <Label htmlFor="site_title">Judul Website</Label>
                  <Input 
                    id="site_title" 
                    name="site_title" 
                    defaultValue={getSetting("site_title")} 
                  />
                </div>
                <div>
                  <Label htmlFor="site_description">Deskripsi Website</Label>
                  <Textarea 
                    id="site_description" 
                    name="site_description" 
                    defaultValue={getSetting("site_description")} 
                  />
                </div>
                <div>
                  <Label htmlFor="site_keywords">Keywords (SEO)</Label>
                  <Input 
                    id="site_keywords" 
                    name="site_keywords" 
                    defaultValue={getSetting("site_keywords")} 
                    placeholder="workshop, aromaterapi, lilin, jakarta"
                  />
                </div>
                <div>
                  <Label htmlFor="business_hours">Jam Operasional</Label>
                  <Input 
                    id="business_hours" 
                    name="business_hours" 
                    defaultValue={getSetting("business_hours")} 
                    placeholder="Senin - Jumat: 09:00 - 17:00"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-charcoal text-white hover:bg-rose-gold"
                  disabled={updateSettingMutation.isPending}
                >
                  Simpan Pengaturan Umum
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit("contact", e)} className="space-y-4">
                <div>
                  <Label htmlFor="phone_main">Telepon Utama</Label>
                  <Input 
                    id="phone_main" 
                    name="phone_main" 
                    defaultValue={getSetting("phone_main")} 
                  />
                </div>
                <div>
                  <Label htmlFor="phone_whatsapp">WhatsApp</Label>
                  <Input 
                    id="phone_whatsapp" 
                    name="phone_whatsapp" 
                    defaultValue={getSetting("phone_whatsapp")} 
                  />
                </div>
                <div>
                  <Label htmlFor="email_main">Email Utama</Label>
                  <Input 
                    id="email_main" 
                    name="email_main" 
                    type="email"
                    defaultValue={getSetting("email_main")} 
                  />
                </div>
                <div>
                  <Label htmlFor="email_export">Email Export</Label>
                  <Input 
                    id="email_export" 
                    name="email_export" 
                    type="email"
                    defaultValue={getSetting("email_export")} 
                  />
                </div>
                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea 
                    id="address" 
                    name="address" 
                    defaultValue={getSetting("address")} 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-charcoal text-white hover:bg-rose-gold"
                  disabled={updateSettingMutation.isPending}
                >
                  Simpan Info Kontak
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Media Sosial</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit("social", e)} className="space-y-4">
                <div>
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input 
                    id="instagram_url" 
                    name="instagram_url" 
                    defaultValue={getSetting("instagram_url")} 
                    placeholder="https://instagram.com/weiscandle"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input 
                    id="facebook_url" 
                    name="facebook_url" 
                    defaultValue={getSetting("facebook_url")} 
                  />
                </div>
                <div>
                  <Label htmlFor="tiktok_url">TikTok URL</Label>
                  <Input 
                    id="tiktok_url" 
                    name="tiktok_url" 
                    defaultValue={getSetting("tiktok_url")} 
                  />
                </div>
                <div>
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input 
                    id="youtube_url" 
                    name="youtube_url" 
                    defaultValue={getSetting("youtube_url")} 
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input 
                    id="linkedin_url" 
                    name="linkedin_url" 
                    defaultValue={getSetting("linkedin_url")} 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-charcoal text-white hover:bg-rose-gold"
                  disabled={updateSettingMutation.isPending}
                >
                  Simpan Media Sosial
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maps Settings */}
        <TabsContent value="maps">
          <Card>
            <CardHeader>
              <CardTitle>Integrasi Google Maps</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit("maps", e)} className="space-y-4">
                <div>
                  <Label htmlFor="google_maps_api_key">Google Maps API Key</Label>
                  <Input 
                    id="google_maps_api_key" 
                    name="google_maps_api_key" 
                    type="password"
                    defaultValue={getSetting("google_maps_api_key")} 
                  />
                </div>
                <div>
                  <Label htmlFor="maps_embed_url">Google Maps Embed URL</Label>
                  <Textarea 
                    id="maps_embed_url" 
                    name="maps_embed_url" 
                    defaultValue={getSetting("maps_embed_url")} 
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                </div>
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input 
                    id="latitude" 
                    name="latitude" 
                    defaultValue={getSetting("latitude")} 
                    placeholder="-6.200000"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input 
                    id="longitude" 
                    name="longitude" 
                    defaultValue={getSetting("longitude")} 
                    placeholder="106.816666"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-charcoal text-white hover:bg-rose-gold"
                  disabled={updateSettingMutation.isPending}
                >
                  Simpan Pengaturan Maps
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Visual</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit("branding", e)} className="space-y-4">
                <div>
                  <Label htmlFor="logo_url">URL Logo</Label>
                  <Input 
                    id="logo_url" 
                    name="logo_url" 
                    type="url"
                    defaultValue={getSetting("logo_url")} 
                  />
                </div>
                <div>
                  <Label htmlFor="favicon_url">URL Favicon</Label>
                  <Input 
                    id="favicon_url" 
                    name="favicon_url" 
                    type="url"
                    defaultValue={getSetting("favicon_url")} 
                  />
                </div>
                <div>
                  <Label htmlFor="primary_color">Warna Primer (Hex)</Label>
                  <Input 
                    id="primary_color" 
                    name="primary_color" 
                    defaultValue={getSetting("primary_color")} 
                    placeholder="#D4A574"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary_color">Warna Sekunder (Hex)</Label>
                  <Input 
                    id="secondary_color" 
                    name="secondary_color" 
                    defaultValue={getSetting("secondary_color")} 
                    placeholder="#F5E6D3"
                  />
                </div>
                <div>
                  <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                  <Input 
                    id="google_analytics_id" 
                    name="google_analytics_id" 
                    defaultValue={getSetting("google_analytics_id")} 
                    placeholder="GA-XXXXXXXXX-X"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-charcoal text-white hover:bg-rose-gold"
                  disabled={updateSettingMutation.isPending}
                >
                  Simpan Branding
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
