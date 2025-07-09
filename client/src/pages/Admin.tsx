import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";
import BlogManager from "@/components/admin/BlogManager";
import WorkshopManager from "@/components/admin/WorkshopManager";
import TestimonialManager from "@/components/admin/TestimonialManager";
import TeamManager from "@/components/admin/TeamManager";
import ExportManager from "@/components/admin/ExportManager";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard - WeisCandle";

    // Check if user is already logged in
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setIsAuthenticated(false);
    queryClient.clear();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari dashboard admin",
    });
  };

  // Fetch contacts with authentication - always call hooks, but conditionally enable
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const response = await fetch("/api/admin/contacts", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
        }
        throw new Error("Failed to fetch contacts");
      }
      return response.json();
    },
    enabled: isAuthenticated && !!token, // Only run query when authenticated
  });

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-charcoal mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Kelola semua aspek website WeisCandle</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-6 w-full">
            <TabsTrigger value="contacts">Kontak</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="workshop">Workshop</TabsTrigger>
            <TabsTrigger value="testimonials">Testimoni</TabsTrigger>
            <TabsTrigger value="team">Tim</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Pesan Kontak</CardTitle>
              </CardHeader>
              <CardContent>
                {contactsLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Pesan</TableHead>
                          <TableHead>Tanggal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts?.map((contact: any) => (
                          <TableRow key={contact.id}>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{contact.phone || "-"}</TableCell>
                            <TableCell>{contact.subject}</TableCell>
                            <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                            <TableCell>{formatDate(contact.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs remain the same */}
          <TabsContent value="blog">
            <BlogManager token={token} />
          </TabsContent>

          <TabsContent value="workshop">
            <WorkshopManager token={token} />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialManager token={token} />
          </TabsContent>

          <TabsContent value="team">
            <TeamManager token={token} />
          </TabsContent>

          <TabsContent value="export">
            <ExportManager token={token} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}