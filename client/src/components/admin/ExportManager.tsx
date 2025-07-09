
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import type { ExportCategory, InsertExportCategory } from "@shared/schema";

interface ExportManagerProps {
  token: string | null;
}

export default function ExportManager({ token }: ExportManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExportCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["/api/admin/export-categories"],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/export-categories", {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertExportCategory) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/export-categories", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/export-categories"] });
      setIsDialogOpen(false);
      setSelectedCategory(null);
      toast({ description: "Kategori export berhasil dibuat!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertExportCategory }) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/export-categories/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/export-categories"] });
      setIsDialogOpen(false);
      setSelectedCategory(null);
      toast({ description: "Kategori export berhasil diupdate!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/export-categories/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/export-categories"] });
      toast({ description: "Kategori export berhasil dihapus!" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const products = formData.get("products") as string;
    let productsArray: string[] = [];
    try {
      productsArray = products.split('\n').filter(p => p.trim());
    } catch (error) {
      productsArray = [products];
    }

    const data: InsertExportCategory = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      products: JSON.stringify(productsArray),
      moq: formData.get("moq") as string,
      priceRange: formData.get("priceRange") as string,
      imageUrl: formData.get("imageUrl") as string || null,
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
      isActive: formData.get("isActive") === "on",
    };

    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (category: ExportCategory) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus kategori export ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Export Categories Manager</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setSelectedCategory(null)}
              className="bg-rose-gold text-white hover:bg-charcoal"
            >
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? "Edit Kategori Export" : "Tambah Kategori Export"}
              </DialogTitle>
              <DialogDescription>
                {selectedCategory ? "Edit informasi kategori export" : "Buat kategori export baru"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Kategori</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  defaultValue={selectedCategory?.name || ""} 
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  defaultValue={selectedCategory?.description || ""} 
                />
              </div>
              <div>
                <Label htmlFor="products">Produk (satu per baris)</Label>
                <Textarea 
                  id="products" 
                  name="products" 
                  required 
                  rows={5}
                  defaultValue={
                    selectedCategory?.products 
                      ? JSON.parse(selectedCategory.products).join('\n') 
                      : ""
                  } 
                />
              </div>
              <div>
                <Label htmlFor="moq">MOQ (Minimum Order Quantity)</Label>
                <Input 
                  id="moq" 
                  name="moq" 
                  required 
                  defaultValue={selectedCategory?.moq || ""} 
                />
              </div>
              <div>
                <Label htmlFor="priceRange">Range Harga</Label>
                <Input 
                  id="priceRange" 
                  name="priceRange" 
                  required 
                  defaultValue={selectedCategory?.priceRange || ""} 
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Gambar (opsional)</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  type="url"
                  defaultValue={selectedCategory?.imageUrl || ""} 
                />
              </div>
              <div>
                <Label htmlFor="displayOrder">Urutan Tampil</Label>
                <Input 
                  id="displayOrder" 
                  name="displayOrder" 
                  type="number" 
                  defaultValue={selectedCategory?.displayOrder || 0} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  defaultChecked={selectedCategory?.isActive ?? true} 
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-charcoal text-white hover:bg-rose-gold"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedCategory ? "Update" : "Buat"} Kategori
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
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>MOQ</TableHead>
                  <TableHead>Range Harga</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.map((category: ExportCategory) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell>{category.moq}</TableCell>
                    <TableCell>{category.priceRange}</TableCell>
                    <TableCell>{category.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(category.id)}
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
