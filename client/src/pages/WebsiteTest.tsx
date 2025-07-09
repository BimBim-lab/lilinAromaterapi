import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function WebsiteTest() {
  const { data: workshops, refetch: refetchWorkshops } = useQuery({
    queryKey: ["/api/workshop-packages"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/workshop-packages`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: testimonials, refetch: refetchTestimonials } = useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials");
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: team, refetch: refetchTeam } = useQuery({
    queryKey: ["/api/team"],
    queryFn: async () => {
      const response = await fetch("/api/team");
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: exportCategories, refetch: refetchExport } = useQuery({
    queryKey: ["/api/export-categories"],
    queryFn: async () => {
      const response = await fetch("/api/export-categories");
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: promos, refetch: refetchPromos } = useQuery({
    queryKey: ["/api/active-promos"],
    queryFn: async () => {
      const response = await fetch("/api/active-promos");
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: settings, refetch: refetchSettings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const { data: blog, refetch: refetchBlog } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog");
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const refreshAll = () => {
    refetchTestimonials();
    refetchWorkshops();
    refetchTeam();
    refetchExport();
    refetchPromos();
    refetchSettings();
    refetchBlog();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-charcoal mb-2">Website Data Integration Test</h1>
            <p className="text-gray-600">Test koneksi antara Admin Dashboard dan Website Public API</p>
          </div>
          <Button onClick={refreshAll} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh All Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Testimonials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Testimonials 
                <Badge variant="secondary">{testimonials?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testimonials?.slice(0, 3).map((testimonial: any) => (
                <div key={testimonial.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-600">{testimonial.workshop}</p>
                  <p className="text-xs text-gray-800 mt-1">{testimonial.content.slice(0, 80)}...</p>
                  <Badge variant="secondary" className="mt-2">
                    {testimonial.rating}⭐
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Workshop Packages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Workshop Packages
                <Badge variant="secondary">{workshopPackages?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workshopPackages?.slice(0, 3).map((pkg: any) => (
                <div key={pkg.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{pkg.name}</p>
                  <p className="text-xs text-gray-600">Rp {pkg.price?.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-gray-600">{pkg.duration}</p>
                  <Badge variant={pkg.isActive ? "default" : "secondary"} className="mt-2">
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Team Members
                <Badge variant="secondary">{team?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team?.slice(0, 3).map((member: any) => (
                <div key={member.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.position}</p>
                  <Badge variant={member.isActive ? "default" : "secondary"} className="mt-2">
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Export Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Export Categories
                <Badge variant="secondary">{exportCategories?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exportCategories?.slice(0, 3).map((category: any) => (
                <div key={category.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs text-gray-600">MOQ: {category.moq}</p>
                  <p className="text-xs text-gray-600">{category.priceRange}</p>
                  <Badge variant={category.isActive ? "default" : "secondary"} className="mt-2">
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Blog Posts
                <Badge variant="secondary">{blog?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {blog?.slice(0, 3).map((post: any) => (
                <div key={post.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{post.title}</p>
                  <p className="text-xs text-gray-600">{post.excerpt?.slice(0, 50)}...</p>
                  <Badge variant={post.featured ? "default" : "secondary"} className="mt-2">
                    {post.featured ? "Featured" : "Regular"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Site Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Site Settings
                <Badge variant="secondary">{settings?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {settings?.slice(0, 5).map((setting: any) => (
                <div key={setting.id} className="mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-medium text-xs">{setting.key}</p>
                  <p className="text-xs text-gray-600 truncate">{setting.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">Petunjuk Testing:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Buka halaman Admin Dashboard di tab baru</li>
            <li>2. Login dengan username: admin, password: password</li>
            <li>3. Tambah/edit data di salah satu tab (Blog, Workshop, Testimoni, dll)</li>
            <li>4. Kembali ke halaman ini dan klik "Refresh All Data"</li>
            <li>5. Perubahan yang dibuat di admin dashboard akan terlihat di sini</li>
          </ol>
        </div>
      </div>
    </div>
  );
}