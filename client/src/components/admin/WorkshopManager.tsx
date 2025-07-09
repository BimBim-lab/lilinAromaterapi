
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
import type { WorkshopPackage, InsertWorkshopPackage } from "@shared/schema";

interface WorkshopManagerProps {
  token: string | null;
}

export default function WorkshopManager({ token }: WorkshopManagerProps) {
  const [selectedPackage, setSelectedPackage] = useState<WorkshopPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: packages, isLoading } = useQuery({
    queryKey: ["/api/admin/workshop-packages"],
    queryFn: async () => {
      const response = await fetch("/api/admin/workshop-packages");
      if (!response.ok) throw new Error("Failed to fetch packages");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertWorkshopPackage) => {
      const response = await fetch("/api/admin/workshop-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create package");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workshop-packages"] });
      setIsDialogOpen(false);
      setSelectedPackage(null);
      toast({ description: "Paket workshop berhasil dibuat!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertWorkshopPackage }) => {
      const response = await fetch(`/api/admin/workshop-packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update package");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workshop-packages"] });
      setIsDialogOpen(false);
      setSelectedPackage(null);
      toast({ description: "Paket workshop berhasil diupdate!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/workshop-packages/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete package");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/workshop-packages"] });
      toast({ description: "Paket workshop berhasil dihapus!" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const features = formData.get("features") as string;
    let featuresArray: string[] = [];
    try {
      featuresArray = features.split('\n').filter(f => f.trim());
    } catch (error) {
      featuresArray = [features];
    }

    const data: InsertWorkshopPackage = {
      name: formData.get("name") as string,
      price: parseInt(formData.get("price") as string),
      duration: formData.get("duration") as string,
      description: formData.get("description") as string,
      features: JSON.stringify(featuresArray),
      maxParticipants: parseInt(formData.get("maxParticipants") as string),
      isActive: formData.get("isActive") === "on",
    };

    if (selectedPackage) {
      updateMutation.mutate({ id: selectedPackage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (pkg: WorkshopPackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus paket workshop ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Workshop Package Manager</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setSelectedPackage(null)}
              className="bg-rose-gold text-white hover:bg-charcoal"
            >
              Tambah Paket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPackage ? "Edit Paket Workshop" : "Tambah Paket Workshop"}
              </DialogTitle>
              <DialogDescription>
                {selectedPackage ? "Edit informasi paket workshop" : "Buat paket workshop baru"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Paket</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  defaultValue={selectedPackage?.name || ""} 
                />
              </div>
              <div>
                <Label htmlFor="price">Harga (IDR)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  required 
                  defaultValue={selectedPackage?.price || ""} 
                />
              </div>
              <div>
                <Label htmlFor="duration">Durasi</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  required 
                  defaultValue={selectedPackage?.duration || ""} 
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  defaultValue={selectedPackage?.description || ""} 
                />
              </div>
              <div>
                <Label htmlFor="features">Fitur (satu per baris)</Label>
                <Textarea 
                  id="features" 
                  name="features" 
                  required 
                  rows={5}
                  defaultValue={
                    selectedPackage?.features 
                      ? JSON.parse(selectedPackage.features).join('\n') 
                      : ""
                  } 
                />
              </div>
              <div>
                <Label htmlFor="maxParticipants">Maksimal Peserta</Label>
                <Input 
                  id="maxParticipants" 
                  name="maxParticipants" 
                  type="number" 
                  required 
                  defaultValue={selectedPackage?.maxParticipants || ""} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  defaultChecked={selectedPackage?.isActive ?? true} 
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-charcoal text-white hover:bg-rose-gold"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedPackage ? "Update" : "Buat"} Paket
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
                  <TableHead>Harga</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Max Peserta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages?.map((pkg: WorkshopPackage) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{formatPrice(pkg.price)}</TableCell>
                    <TableCell>{pkg.duration}</TableCell>
                    <TableCell>{pkg.maxParticipants}</TableCell>
                    <TableCell>
                      <Badge variant={pkg.isActive ? "default" : "secondary"}>
                        {pkg.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(pkg)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(pkg.id)}
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
