
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Edit, Trash2, Plus, Package } from "lucide-react";

interface ExportManagerProps {
  token: string | null;
}

interface ExportCategory {
  id: number;
  name: string;
  description: string;
  products: string;
  moq: string;
  priceRange: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function ExportManager({ token }: ExportManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<ExportCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: exportCategories, isLoading } = useQuery({
    queryKey: ["/api/admin/export-categories"],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/export-categories", {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch export categories");
      return response.json();
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<ExportCategory, 'id'>) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/export-categories", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create export category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/export-categories"] });
      toast({ description: "Kategori export berhasil ditambahkan!" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<ExportCategory> & { id: number }) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/export-categories/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update export category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/export-categories"] });
      toast({ description: "Kategori export berhasil diupdate!" });
      setIsDialogOpen(false);
      setEditingCategory(null);
      resetForm();
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
      if (!response.ok) throw new Error("Failed to delete export category");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/export-categories"] });
      toast({ description: "Kategori export berhasil dihapus!" });
    },
  });

  const resetForm = () => {
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const products = (formData.get("products") as string)
      .split('\n')
      .filter(product => product.trim())
      .map(product => product.trim());

    const categoryData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      products: JSON.stringify(products),
      moq: formData.get("moq") as string,
      priceRange: formData.get("priceRange") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
      isActive: formData.get("isActive") === "on",
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, ...categoryData });
    } else {
      createMutation.mutate(categoryData);
    }
  };

  const handleEdit = (category: ExportCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori export ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const getProducts = (productsString: string) => {
    try {
      const products = JSON.parse(productsString);
      return Array.isArray(products) ? products : [];
    } catch {
      return [];
    }
  };

  const getProductsText = (productsString: string) => {
    const products = getProducts(productsString);
    return products.join('\n');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Kategori Export</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori Export
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Kategori Export" : "Tambah Kategori Export Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? "Edit informasi kategori export" 
                  : "Tambahkan kategori export baru untuk produk international"
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Kategori</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={editingCategory?.name || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={editingCategory?.description || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="products">Daftar Produk (satu per baris)</Label>
                <Textarea 
                  id="products" 
                  name="products" 
                  placeholder="Premium Soy Candles
Lavender Relaxation Candles
Eucalyptus Fresh Candles"
                  defaultValue={editingCategory ? getProductsText(editingCategory.products) : ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="moq">Minimum Order Quantity (MOQ)</Label>
                <Input 
                  id="moq" 
                  name="moq" 
                  placeholder="100 pieces per order"
                  defaultValue={editingCategory?.moq || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="priceRange">Range Harga</Label>
                <Input 
                  id="priceRange" 
                  name="priceRange" 
                  placeholder="$12 - $25 per piece"
                  defaultValue={editingCategory?.priceRange || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Gambar (Opsional)</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  type="url"
                  defaultValue={editingCategory?.imageUrl || ""} 
                />
              </div>
              <div>
                <Label htmlFor="displayOrder">Urutan Tampilan</Label>
                <Input 
                  id="displayOrder" 
                  name="displayOrder" 
                  type="number"
                  defaultValue={editingCategory?.displayOrder || 0} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  defaultChecked={editingCategory?.isActive !== false} 
                />
                <Label htmlFor="isActive">Aktif (tampilkan di website)</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingCategory ? "Update Kategori" : "Tambah Kategori"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori Export ({exportCategories?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jumlah Produk</TableHead>
                  <TableHead>MOQ</TableHead>
                  <TableHead>Range Harga</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportCategories?.map((category: ExportCategory) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{category.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getProducts(category.products).length} produk
                      </Badge>
                    </TableCell>
                    <TableCell>{category.moq}</TableCell>
                    <TableCell>{category.priceRange}</TableCell>
                    <TableCell>{category.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
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
