
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Plus, User } from "lucide-react";

interface TeamManagerProps {
  token: string | null;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  socialMedia?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function TeamManager({ token }: TeamManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["/api/admin/team"],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/team", {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch team members");
      return response.json();
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<TeamMember, 'id'>) => {
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
      toast({ description: "Anggota tim berhasil ditambahkan!" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<TeamMember> & { id: number }) => {
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
      toast({ description: "Anggota tim berhasil diupdate!" });
      setIsDialogOpen(false);
      setEditingMember(null);
      resetForm();
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      toast({ description: "Anggota tim berhasil dihapus!" });
    },
  });

  const resetForm = () => {
    setEditingMember(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const socialMedia = {
      instagram: formData.get("instagram") as string,
      linkedin: formData.get("linkedin") as string,
      email: formData.get("email") as string,
    };

    const memberData = {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      bio: formData.get("bio") as string,
      imageUrl: formData.get("imageUrl") as string,
      socialMedia: JSON.stringify(socialMedia),
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
      isActive: formData.get("isActive") === "on",
    };

    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, ...memberData });
    } else {
      createMutation.mutate(memberData);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota tim ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const getSocialMedia = (socialMediaString?: string) => {
    try {
      return socialMediaString ? JSON.parse(socialMediaString) : {};
    } catch {
      return {};
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Tim</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMember(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Anggota Tim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Anggota Tim" : "Tambah Anggota Tim Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingMember 
                  ? "Edit informasi anggota tim" 
                  : "Tambahkan anggota tim baru"
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={editingMember?.name || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="position">Posisi/Jabatan</Label>
                <Input 
                  id="position" 
                  name="position" 
                  defaultValue={editingMember?.position || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="bio">Biografi</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  defaultValue={editingMember?.bio || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Foto</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  type="url"
                  defaultValue={editingMember?.imageUrl || ""} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="displayOrder">Urutan Tampilan</Label>
                <Input 
                  id="displayOrder" 
                  name="displayOrder" 
                  type="number"
                  defaultValue={editingMember?.displayOrder || 0} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Media Sosial (Opsional)</Label>
                <div className="space-y-2">
                  <Input 
                    name="instagram" 
                    placeholder="Username Instagram (tanpa @)"
                    defaultValue={getSocialMedia(editingMember?.socialMedia)?.instagram || ""} 
                  />
                  <Input 
                    name="linkedin" 
                    placeholder="URL LinkedIn"
                    defaultValue={getSocialMedia(editingMember?.socialMedia)?.linkedin || ""} 
                  />
                  <Input 
                    name="email" 
                    type="email"
                    placeholder="Email"
                    defaultValue={getSocialMedia(editingMember?.socialMedia)?.email || ""} 
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  name="isActive" 
                  defaultChecked={editingMember?.isActive !== false} 
                />
                <Label htmlFor="isActive">Aktif (tampilkan di website)</Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingMember ? "Update Anggota Tim" : "Tambah Anggota Tim"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Anggota Tim ({teamMembers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers?.map((member: TeamMember) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">{member.bio}</div>
                    </TableCell>
                    <TableCell>{member.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={member.isActive ? "default" : "secondary"}>
                        {member.isActive ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
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
