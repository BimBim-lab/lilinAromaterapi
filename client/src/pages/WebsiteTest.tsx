
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WebsiteTest() {
  const { data: testimonials } = useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials");
      return response.json();
    },
  });

  const { data: workshopPackages } = useQuery({
    queryKey: ["/api/workshop-packages"],
    queryFn: async () => {
      const response = await fetch("/api/workshop-packages");
      return response.json();
    },
  });

  const { data: team } = useQuery({
    queryKey: ["/api/team"],
    queryFn: async () => {
      const response = await fetch("/api/team");
      return response.json();
    },
  });

  const { data: exportCategories } = useQuery({
    queryKey: ["/api/export-categories"],
    queryFn: async () => {
      const response = await fetch("/api/export-categories");
      return response.json();
    },
  });

  const { data: promos } = useQuery({
    queryKey: ["/api/active-promos"],
    queryFn: async () => {
      const response = await fetch("/api/active-promos");
      return response.json();
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Website Data Integration Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Testimonials */}
          <Card>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Total: {testimonials?.length || 0} testimonials
              </p>
              {testimonials?.slice(0, 3).map((testimonial: any) => (
                <div key={testimonial.id} className="mb-3 p-2 bg-gray-50 rounded">
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-600">{testimonial.workshop}</p>
                  <Badge variant="secondary" className="mt-1">
                    {testimonial.rating}⭐
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Workshop Packages */}
          <Card>
            <CardHeader>
              <CardTitle>Workshop Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Total: {workshopPackages?.length || 0} packages
              </p>
              {workshopPackages?.slice(0, 3).map((pkg: any) => (
                <div key={pkg.id} className="mb-3 p-2 bg-gray-50 rounded">
                  <p className="font-medium text-sm">{pkg.name}</p>
                  <p className="text-xs text-gray-600">
                    Rp {pkg.price?.toLocaleString('id-ID')} - {pkg.duration}
                  </p>
                  <Badge variant={pkg.isActive ? "default" : "secondary"} className="mt-1">
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Total: {team?.length || 0} members
              </p>
              {team?.slice(0, 3).map((member: any) => (
                <div key={member.id} className="mb-3 p-2 bg-gray-50 rounded">
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.position}</p>
                  <Badge variant={member.isActive ? "default" : "secondary"} className="mt-1">
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Export Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Export Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Total: {exportCategories?.length || 0} categories
              </p>
              {exportCategories?.slice(0, 3).map((category: any) => (
                <div key={category.id} className="mb-3 p-2 bg-gray-50 rounded">
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs text-gray-600">{category.priceRange}</p>
                  <Badge variant={category.isActive ? "default" : "secondary"} className="mt-1">
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Promos */}
          <Card>
            <CardHeader>
              <CardTitle>Active Promos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Total: {promos?.length || 0} active promos
              </p>
              {promos?.slice(0, 3).map((promo: any) => (
                <div key={promo.id} className="mb-3 p-2 bg-gray-50 rounded">
                  <p className="font-medium text-sm">{promo.title}</p>
                  <p className="text-xs text-gray-600">{promo.type}</p>
                  <Badge variant="default" className="mt-1">
                    Active
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Total: {settings?.length || 0} settings
              </p>
              {settings?.slice(0, 5).map((setting: any) => (
                <div key={setting.id} className="mb-2 p-2 bg-gray-50 rounded">
                  <p className="font-medium text-xs">{setting.key}</p>
                  <p className="text-xs text-gray-600 truncate">{setting.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
