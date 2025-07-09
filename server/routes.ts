import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, insertTestimonialSchema, insertWorkshopPackageSchema,
  insertTeamMemberSchema, insertSiteSettingSchema, insertPromoPopupSchema,
  insertExportCategorySchema, insertBlogPostSchema, insertUserSchema 
} from "@shared/schema";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Default admin credentials (you should change these)
      const ADMIN_USERNAME = "admin";
      const ADMIN_PASSWORD = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"; // password
      
      if (username !== ADMIN_USERNAME) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { username: ADMIN_USERNAME },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ token, message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Blog endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Contact endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      res.status(201).json({ 
        message: "Pesan berhasil dikirim! Kami akan menghubungi Anda segera.",
        contact: { id: contact.id }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Data tidak valid",
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Gagal mengirim pesan" });
    }
  });

  // Admin routes (protected)
  app.get("/api/admin/contacts", authenticateToken, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Blog management
  app.post("/api/admin/blog", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Testimonials
  app.get("/api/admin/testimonials", authenticateToken, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.updateTestimonial(id, validatedData);
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTestimonial(id);
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // Workshop Packages
  app.get("/api/admin/workshop-packages", authenticateToken, async (req, res) => {
    try {
      const packages = await storage.getWorkshopPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workshop packages" });
    }
  });

  app.post("/api/admin/workshop-packages", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertWorkshopPackageSchema.parse(req.body);
      const package_ = await storage.createWorkshopPackage(validatedData);
      res.status(201).json(package_);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create workshop package" });
    }
  });

  app.put("/api/admin/workshop-packages/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWorkshopPackageSchema.parse(req.body);
      const package_ = await storage.updateWorkshopPackage(id, validatedData);
      res.json(package_);
    } catch (error) {
      res.status(500).json({ message: "Failed to update workshop package" });
    }
  });

  app.delete("/api/admin/workshop-packages/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteWorkshopPackage(id);
      res.json({ message: "Workshop package deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workshop package" });
    }
  });

  // Team Members
  app.get("/api/admin/team", authenticateToken, async (req, res) => {
    try {
      const team = await storage.getTeamMembers();
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post("/api/admin/team", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  app.put("/api/admin/team/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.updateTeamMember(id, validatedData);
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/admin/team/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamMember(id);
      res.json({ message: "Team member deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // Site Settings
  app.get("/api/admin/settings", authenticateToken, async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertSiteSettingSchema.parse(req.body);
      const setting = await storage.setSiteSetting(validatedData);
      res.json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Promo Popups
  app.get("/api/admin/promos", authenticateToken, async (req, res) => {
    try {
      const promos = await storage.getPromoPopups();
      res.json(promos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promos" });
    }
  });

  app.post("/api/admin/promos", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertPromoPopupSchema.parse(req.body);
      const promo = await storage.createPromoPopup(validatedData);
      res.status(201).json(promo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create promo" });
    }
  });

  app.put("/api/admin/promos/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPromoPopupSchema.parse(req.body);
      const promo = await storage.updatePromoPopup(id, validatedData);
      res.json(promo);
    } catch (error) {
      res.status(500).json({ message: "Failed to update promo" });
    }
  });

  app.delete("/api/admin/promos/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePromoPopup(id);
      res.json({ message: "Promo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete promo" });
    }
  });

  // Export Categories
  app.get("/api/admin/export-categories", authenticateToken, async (req, res) => {
    try {
      const categories = await storage.getExportCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch export categories" });
    }
  });

  app.post("/api/admin/export-categories", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertExportCategorySchema.parse(req.body);
      const category = await storage.createExportCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create export category" });
    }
  });

  app.put("/api/admin/export-categories/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertExportCategorySchema.parse(req.body);
      const category = await storage.updateExportCategory(id, validatedData);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update export category" });
    }
  });

  app.delete("/api/admin/export-categories/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteExportCategory(id);
      res.json({ message: "Export category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete export category" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
