
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial, InsertTestimonial } from "@shared/schema";

interface TestimonialManagerProps {
  token: string | null;
}

export default function TestimonialManager({ token }: TestimonialManagerProps) {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["/api/admin/testimonials"],
    queryFn: async () => {
      try {
        // Try admin endpoint first
        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch("/api/admin/testimonials", {
          headers,
        });
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.warn("Admin endpoint failed, trying public endpoint");
      }
      
      // Fallback to public endpoint
      const publicResponse = await fetch("/api/testimonials");
      if (!publicResponse.ok) throw new Error("Failed to fetch testimonials");
      return publicResponse.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTestimonial) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create testimonial");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setIsDialogOpen(false);
      setSelectedTestimonial(null);
      toast({ description: "Testimoni berhasil dibuat!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertTestimonial }) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update testimonial");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setIsDialogOpen(false);
      setSelectedTestimonial(null);
      toast({ description: "Testimoni berhasil diupdate!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete testimonial");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ description: "Testimoni berhasil dihapus!" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: InsertTestimonial = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      workshop: formData.get("workshop") as string,
      rating: parseInt(formData.get("rating") as string),
      content: formData.get("content") as string,
      imageUrl: formData.get("imageUrl") as string || null,
      featured: formData.get("featured") === "on",
    };

    if (selectedTestimonial) {
      updateMutation.mutate({ id: selectedTestimonial.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus testimoni ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Testimonial Manager</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setSelectedTestimonial(null)}
              className="bg-rose-gold text-white hover:bg-charcoal"
            >
              Tambah Testimoni
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedTestimonial ? "Edit Testimoni" : "Tambah Testimoni"}
              </DialogTitle>
              <DialogDescription>
                {selectedTestimonial ? "Edit informasi testimoni" : "Buat testimoni baru"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  defaultValue={selectedTestimonial?.name || ""} 
                />
              </div>
              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input 
                  id="location" 
                  name="location" 
                  required 
                  defaultValue={selectedTestimonial?.location || ""} 
                />
              </div>
              <div>
                <Label htmlFor="workshop">Workshop</Label>
                <Select name="workshop" defaultValue={selectedTestimonial?.workshop || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih workshop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workshop Basic">Workshop Basic</SelectItem>
                    <SelectItem value="Workshop Premium">Workshop Premium</SelectItem>
                    <SelectItem value="Workshop Professional">Workshop Professional</SelectItem>
                    <SelectItem value="Private Class">Private Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Select name="rating" defaultValue={selectedTestimonial?.rating.toString() || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 ⭐</SelectItem>
                    <SelectItem value="2">2 ⭐⭐</SelectItem>
                    <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                    <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                    <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">Testimoni</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  required 
                  rows={4}
                  defaultValue={selectedTestimonial?.content || ""} 
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Foto (opsional)</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  type="url" 
                  defaultValue={selectedTestimonial?.imageUrl || ""} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="featured" 
                  name="featured" 
                  defaultChecked={selectedTestimonial?.featured || false} 
                />
                <Label htmlFor="featured">Featured Testimonial</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-charcoal text-white hover:bg-rose-gold"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedTestimonial ? "Update" : "Buat"} Testimoni
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Workshop</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials?.map((testimonial: Testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell>{testimonial.location}</TableCell>
                    <TableCell>{testimonial.workshop}</TableCell>
                    <TableCell>{renderStars(testimonial.rating)}</TableCell>
                    <TableCell>
                      {testimonial.featured && <Badge>Featured</Badge>}
                    </TableCell>
                    <TableCell>
                      {new Date(testimonial.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(testimonial)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
