
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
import type { PromoPopup, InsertPromoPopup } from "@shared/schema";

interface PromoManagerProps {
  token: string | null;
}

export default function PromoManager({ token }: PromoManagerProps) {
  const [selectedPromo, setSelectedPromo] = useState<PromoPopup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: promos, isLoading } = useQuery({
    queryKey: ["/api/admin/promos"],
    queryFn: async () => {
      const response = await fetch("/api/admin/promos");
      if (!response.ok) throw new Error("Failed to fetch promos");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPromoPopup) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/promos", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create promo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promos"] });
      setIsDialogOpen(false);
      setSelectedPromo(null);
      toast({ description: "Promo berhasil dibuat!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertPromoPopup }) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/promos/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update promo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promos"] });
      setIsDialogOpen(false);
      setSelectedPromo(null);
      toast({ description: "Promo berhasil diupdate!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/promos/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete promo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promos"] });
      toast({ description: "Promo berhasil dihapus!" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    const data: InsertPromoPopup = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      buttonText: formData.get("buttonText") as string || null,
      buttonLink: formData.get("buttonLink") as string || null,
      imageUrl: formData.get("imageUrl") as string || null,
      type: formData.get("type") as "popup" | "notification_bar",
      isActive: formData.get("isActive") === "on",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    };

    if (selectedPromo) {
      updateMutation.mutate({ id: selectedPromo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (promo: PromoPopup) => {
    setSelectedPromo(promo);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus promo ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID");
  };

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Popup Promo & Notification Bar Manager</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setSelectedPromo(null)}
              className="bg-rose-gold text-white hover:bg-charcoal"
            >
              Tambah Promo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPromo ? "Edit Promo" : "Tambah Promo"}
              </DialogTitle>
              <DialogDescription>
                {selectedPromo ? "Edit informasi promo" : "Buat promo baru"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input 
                  id="title" 
                  name="title" 
                  required 
                  defaultValue={selectedPromo?.title || ""} 
                />
              </div>
              <div>
                <Label htmlFor="content">Konten</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  required 
                  rows={3}
                  defaultValue={selectedPromo?.content || ""} 
                />
              </div>
              <div>
                <Label htmlFor="type">Tipe</Label>
                <Select name="type" defaultValue={selectedPromo?.type || "popup"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popup">Popup</SelectItem>
                    <SelectItem value="notification_bar">Notification Bar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="buttonText">Teks Tombol (opsional)</Label>
                <Input 
                  id="buttonText" 
                  name="buttonText" 
                  defaultValue={selectedPromo?.buttonText || ""} 
                />
              </div>
              <div>
                <Label htmlFor="buttonLink">Link Tombol (opsional)</Label>
                <Input 
                  id="buttonLink" 
                  name="buttonLink" 
                  type="url"
                  defaultValue={selectedPromo?.buttonLink || ""} 
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Gambar (opsional)</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  type="url"
                  defaultValue={selectedPromo?.imageUrl || ""} 
                />
              </div>
              <div>
                <Label htmlFor="startDate">Tanggal Mulai (opsional)</Label>
                <Input 
                  id="startDate" 
                  name="startDate" 
                  type="datetime-local"
                  defaultValue={formatDateForInput(selectedPromo?.startDate || null)} 
                />
              </div>
              <div>
                <Label htmlFor="endDate">Tanggal Berakhir (opsional)</Label>
                <Input 
                  id="endDate" 
                  name="endDate" 
                  type="datetime-local"
                  defaultValue={formatDateForInput(selectedPromo?.endDate || null)} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  defaultChecked={selectedPromo?.isActive ?? false} 
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-charcoal text-white hover:bg-rose-gold"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedPromo ? "Update" : "Buat"} Promo
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
                  <TableHead>Judul</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mulai</TableHead>
                  <TableHead>Berakhir</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promos?.map((promo: PromoPopup) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.title}</TableCell>
                    <TableCell>
                      <Badge variant={promo.type === "popup" ? "default" : "secondary"}>
                        {promo.type === "popup" ? "Popup" : "Notification Bar"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={promo.isActive ? "default" : "secondary"}>
                        {promo.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(promo.startDate)}</TableCell>
                    <TableCell>{formatDateTime(promo.endDate)}</TableCell>
                    <TableCell>
                      {new Date(promo.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(promo)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(promo.id)}
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
