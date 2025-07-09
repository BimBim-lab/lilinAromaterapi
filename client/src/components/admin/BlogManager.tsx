
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
import type { BlogPost, InsertBlogPost } from "@shared/schema";

interface BlogManagerProps {
  token: string | null;
}

export default function BlogManager({ token }: BlogManagerProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog");
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsDialogOpen(false);
      setSelectedPost(null);
      toast({ description: "Blog post berhasil dibuat!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertBlogPost }) => {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsDialogOpen(false);
      setSelectedPost(null);
      toast({ description: "Blog post berhasil diupdate!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ description: "Blog post berhasil dihapus!" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: InsertBlogPost = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      imageUrl: formData.get("imageUrl") as string,
      featured: formData.get("featured") === "on",
    };

    if (selectedPost) {
      updateMutation.mutate({ id: selectedPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus blog post ini?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blog Manager</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setSelectedPost(null)}
              className="bg-rose-gold text-white hover:bg-charcoal"
            >
              Tambah Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPost ? "Edit Blog Post" : "Tambah Blog Post"}
              </DialogTitle>
              <DialogDescription>
                {selectedPost ? "Edit informasi blog post" : "Buat blog post baru"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input 
                  id="title" 
                  name="title" 
                  required 
                  defaultValue={selectedPost?.title || ""} 
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input 
                  id="slug" 
                  name="slug" 
                  required 
                  defaultValue={selectedPost?.slug || ""} 
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea 
                  id="excerpt" 
                  name="excerpt" 
                  required 
                  defaultValue={selectedPost?.excerpt || ""} 
                />
              </div>
              <div>
                <Label htmlFor="content">Konten</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  required 
                  rows={10}
                  defaultValue={selectedPost?.content || ""} 
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Gambar</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  type="url" 
                  required 
                  defaultValue={selectedPost?.imageUrl || ""} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="featured" 
                  name="featured" 
                  defaultChecked={selectedPost?.featured || false} 
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-charcoal text-white hover:bg-rose-gold"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {selectedPost ? "Update" : "Buat"} Post
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
                  <TableHead>Slug</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts?.map((post: BlogPost) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.slug}</TableCell>
                    <TableCell>
                      {post.featured && <Badge>Featured</Badge>}
                    </TableCell>
                    <TableCell>
                      {new Date(post.publishedAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(post)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(post.id)}
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
