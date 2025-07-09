
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
import type { TeamMember, InsertTeamMember } from "@shared/schema";

interface TeamManagerProps {
  token: string | null;
}

export default function TeamManager({ token }: TeamManagerProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: team, isLoading } = useQuery({
    queryKey: ["/api/admin/team"],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/team", {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch team");
      return response.json();
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTeamMember) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/team", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create team member");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      setIsDialogOpen(false);
      setSelectedMember(null);
      toast({ description: "Anggota tim berhasil dibuat!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertTeamMember }) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update team member");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      setIsDialogOpen(false);
      setSelectedMember(null);
      toast({ description: "Anggota tim berhasil diupdate!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete team member");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      toast({ description: "Anggota tim berhasil dihapus!" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const socialMedia = formData.get("socialMedia") as string;
    let socialMediaObj = null;
    if (socialMedia.trim()) {
      try {
        socialMediaObj = JSON.parse(socialMedia);
      } catch (error) {
        toast({ 
          description: "Format Social Media tidak valid. Gunakan format JSON.", 
          variant: "destructive" 
        });
        return;
      }
    }

    const data: InsertTeamMember = {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      bio: formData.get("bio") as string,
      imageUrl: formData.get("imageUrl") as string,
      socialMedia: socialMediaObj ? JSON.stringify(socialMediaObj) : null,
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
      isActive: formData.get("isActive") === "on",
    };

    if (selectedMember) {
      updateMutation.mutate({ id: selectedMember.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus anggota tim ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Manager</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setSelectedMember(null)}
              className="bg-rose-gold text-white hover:bg-charcoal"
            >
              Tambah Anggota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedMember ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
              </DialogTitle>
              <DialogDescription>
                {selectedMember ? "Edit informasi anggota tim" : "Tambah anggota tim baru"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  defaultValue={selectedMember?.name || ""} 
                />
              </div>
              <div>
                <Label htmlFor="position">Posisi</Label>
                <Input 
                  id="position" 
                  name="position" 
                  required 
                  defaultValue={selectedMember?.position || ""} 
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  required 
                  rows={4}
                  defaultValue={selectedMember?.bio || ""} 
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Foto</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  type="url" 
                  required 
                  defaultValue={selectedMember?.imageUrl || ""} 
                />
              </div>
              <div>
                <Label htmlFor="socialMedia">Social Media (JSON format)</Label>
                <Textarea 
                  id="socialMedia" 
                  name="socialMedia" 
                  rows={3}
                  placeholder='{"instagram": "@username", "linkedin": "linkedin.com/in/username"}'
                  defaultValue={selectedMember?.socialMedia || ""} 
                />
              </div>
              <div>
                <Label htmlFor="displayOrder">Urutan Tampil</Label>
                <Input 
                  id="displayOrder" 
                  name="displayOrder" 
                  type="number" 
                  defaultValue={selectedMember?.displayOrder || 0} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  defaultChecked={selectedMember?.isActive ?? true} 
                />
                <Label htmlFor="isActive">Aktif</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-charcoal text-white hover:bg-rose-gold"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedMember ? "Update" : "Tambah"} Anggota
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
                  <TableHead>Posisi</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team?.map((member: TeamMember) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell className="max-w-xs truncate">{member.bio}</TableCell>
                    <TableCell>{member.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={member.isActive ? "default" : "secondary"}>
                        {member.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(member)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(member.id)}
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
