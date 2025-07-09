
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus, Star } from "lucide-react";

interface TestimonialManagerProps {
  token: string | null;
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  workshop: string;
  rating: number;
  content: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
}

export default function TestimonialManager({ token }: TestimonialManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["/api/admin/testimonials"],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/testimonials", {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch testimonials");
      return response.json();
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Testimonial, 'id' | 'createdAt'>) => {
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
      toast({ description: "Testimoni berhasil ditambahkan!" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Testimonial> & { id: number }) => {
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
      toast({ description: "Testimoni berhasil diupdate!" });
      setIsDialogOpen(false);
      setEditingTestimonial(null);
      resetForm();
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ description: "Testimoni berhasil dihapus!" });
    },
  });

  const resetForm = () => {
    setEditingTestimonial(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const testimonialData = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      workshop: formData.get("workshop") as string,
      rating: parseInt(formData.get("rating") as string),
      content: formData.get("content") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      featured: formData.get("featured") === "on",
    };

    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, ...testimonialData });
    } else {
      createMutation.mutate(testimonialData);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Testimoni</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTestimonial(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Testimoni
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial 
                  ? "Edit informasi testimoni" 
                  : "Tambahkan testimoni baru dari peserta workshop"
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Peserta</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={editingTestimonial?.name || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input 
                  id="location" 
                  name="location" 
                  defaultValue={editingTestimonial?.location || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="workshop">Workshop yang Diikuti</Label>
                <Select name="workshop" defaultValue={editingTestimonial?.workshop || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih workshop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workshop Basic">Workshop Basic</SelectItem>
                    <SelectItem value="Workshop Premium">Workshop Premium</SelectItem>
                    <SelectItem value="Workshop Professional">Workshop Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Select name="rating" defaultValue={editingTestimonial?.rating?.toString() || "5"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bintang</SelectItem>
                    <SelectItem value="2">2 Bintang</SelectItem>
                    <SelectItem value="3">3 Bintang</SelectItem>
                    <SelectItem value="4">4 Bintang</SelectItem>
                    <SelectItem value="5">5 Bintang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">Isi Testimoni</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  defaultValue={editingTestimonial?.content || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Foto (Opsional)</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  type="url"
                  defaultValue={editingTestimonial?.imageUrl || ""} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="featured" 
                  name="featured" 
                  defaultChecked={editingTestimonial?.featured || false} 
                />
                <Label htmlFor="featured">Tampilkan di halaman utama</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingTestimonial ? "Update Testimoni" : "Tambah Testimoni"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Testimoni ({testimonials?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Workshop</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Testimoni</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{testimonial.content}</div>
                    </TableCell>
                    <TableCell>
                      {testimonial.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(testimonial.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
