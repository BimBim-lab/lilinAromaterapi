import { users, blogPosts, contacts, type User, type InsertUser, type BlogPost, type InsertBlogPost, type Contact, type InsertContact } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private contacts: Map<number, Contact>;
  private workshopPackages: Map<number, any>;
  private testimonials: Map<number, any>;
  private teamMembers: Map<number, any>;
  private exportCategories: Map<number, any>;
  private promoPopups: Map<number, any>;
  private siteSettings: Map<string, any>;
  private currentUserId: number;
  private currentBlogPostId: number;
  private currentContactId: number;
  private currentWorkshopPackageId: number;
  private currentTestimonialId: number;
  private currentTeamMemberId: number;
  private currentExportCategoryId: number;
  private currentPromoPopupId: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.contacts = new Map();
    this.workshopPackages = new Map();
    this.testimonials = new Map();
    this.teamMembers = new Map();
    this.exportCategories = new Map();
    this.promoPopups = new Map();
    this.siteSettings = new Map();
    this.currentUserId = 1;
    this.currentBlogPostId = 1;
    this.currentContactId = 1;
    this.currentWorkshopPackageId = 1;
    this.currentTestimonialId = 1;
    this.currentTeamMemberId = 1;
    this.currentExportCategoryId = 1;
    this.currentPromoPopupId = 1;

    // Initialize with sample data
    this.initializeBlogPosts();
    this.initializeWorkshopPackages();
    this.initializeTestimonials();
    this.initializeTeamMembers();
    this.initializeExportCategories();
    this.initializeSiteSettings();
  }

  private initializeBlogPosts() {
    const samplePosts: InsertBlogPost[] = [
      {
        title: "5 Essential Oil Terbaik untuk Relaksasi",
        slug: "5-essential-oil-terbaik-untuk-relaksasi",
        excerpt: "Pelajari jenis-jenis essential oil yang paling efektif untuk menciptakan suasana relaksasi dan menenangkan pikiran.",
        content: `
          <p>Aromaterapi telah lama dikenal sebagai salah satu cara alami untuk menciptakan suasana relaksasi. Berikut adalah 5 essential oil terbaik yang dapat membantu Anda mencapai ketenangan pikiran:</p>

          <h2>1. Lavender</h2>
          <p>Lavender adalah raja dari essential oil untuk relaksasi. Aroma yang lembut dan menenangkan membuatnya sempurna untuk mengurangi stres dan membantu tidur yang lebih nyenyak.</p>

          <h2>2. Chamomile</h2>
          <p>Chamomile memiliki sifat anti-inflammatory dan calming yang luar biasa. Essential oil ini sangat efektif untuk mengurangi kecemasan dan ketegangan.</p>

          <h2>3. Bergamot</h2>
          <p>Bergamot memiliki aroma citrus yang segar namun menenangkan. Oil ini membantu meningkatkan mood dan mengurangi perasaan depresi ringan.</p>

          <h2>4. Ylang Ylang</h2>
          <p>Ylang ylang dikenal dapat menurunkan tekanan darah dan detak jantung, menciptakan efek relaksasi yang mendalam pada tubuh dan pikiran.</p>

          <h2>5. Sandalwood</h2>
          <p>Sandalwood memiliki aroma woody yang hangat dan menenangkan. Oil ini sangat baik untuk meditasi dan menciptakan suasana spiritual yang damai.</p>

          <p>Dalam workshop WeisCandle, Anda akan belajar cara memadukan essential oil ini untuk menciptakan lilin aromaterapi yang sempurna sesuai kebutuhan Anda.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        featured: true,
      },
      {
        title: "Tips Memilih Wax Berkualitas untuk Lilin",
        slug: "tips-memilih-wax-berkualitas-untuk-lilin",
        excerpt: "Panduan lengkap memilih jenis wax yang tepat untuk menciptakan lilin aromaterapi dengan hasil optimal dan tahan lama.",
        content: `
          <p>Kualitas wax adalah faktor utama yang menentukan hasil akhir lilin aromaterapi Anda. Berikut panduan memilih wax yang tepat:</p>

          <h2>Jenis-jenis Wax</h2>

          <h3>Soy Wax</h3>
          <p>Wax yang terbuat dari kedelai ini adalah pilihan terbaik untuk pemula. Soy wax mudah digunakan, ramah lingkungan, dan memberikan hasil pembakaran yang bersih.</p>

          <h3>Beeswax</h3>
          <p>Lilin lebah alami yang memberikan aroma natural dan waktu bakar yang lama. Cocok untuk mereka yang menginginkan produk 100% natural.</p>

          <h3>Coconut Wax</h3>
          <p>Wax premium yang memberikan throw scent yang excellent dan pembakaran yang sangat bersih. Harganya lebih mahal tapi kualitasnya superior.</p>

          <h2>Kriteria Wax Berkualitas</h2>
          <ul>
            <li>Tidak menghasilkan asap berlebihan saat dibakar</li>
            <li>Memiliki titik leleh yang konsisten</li>
            <li>Mudah dibersihkan dan tidak meninggalkan residu</li>
            <li>Compatible dengan berbagai jenis essential oil</li>
          </ul>

          <p>Di workshop WeisCandle, kami hanya menggunakan wax berkualitas premium untuk memastikan hasil yang optimal.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1574361034536-9e0a5b05b6b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        featured: false,
      },
      {
        title: "Cara Memulai Bisnis Lilin Aromaterapi",
        slug: "cara-memulai-bisnis-lilin-aromaterapi",
        excerpt: "Strategi dan tips praktis untuk memulai bisnis lilin aromaterapi dari nol hingga sukses mendapatkan pelanggan.",
        content: `
          <p>Bisnis lilin aromaterapi memiliki potensi yang sangat besar di Indonesia. Berikut langkah-langkah untuk memulai bisnis yang menguntungkan:</p>

          <h2>1. Riset Pasar</h2>
          <p>Pelajari target market Anda. Lilin aromaterapi diminati oleh berbagai kalangan, mulai dari ibu rumah tangga hingga profesional muda yang mencari relaksasi.</p>

          <h2>2. Tentukan Niche</h2>
          <p>Spesialisasi pada kategori tertentu seperti:</p>
          <ul>
            <li>Lilin untuk meditation dan yoga</li>
            <li>Lilin aromaterapi untuk bayi dan anak</li>
            <li>Lilin luxury dengan packaging premium</li>
            <li>Lilin custom untuk gift dan souvenir</li>
          </ul>

          <h2>3. Investasi Awal</h2>
          <p>Modal awal yang dibutuhkan berkisar Rp 5-15 juta untuk:</p>
          <ul>
            <li>Peralatan dasar (double boiler, termometer, cetakan)</li>
            <li>Bahan baku (wax, essential oil, wick, container)</li>
            <li>Packaging dan labeling</li>
            <li>Marketing awal</li>
          </ul>

          <h2>4. Strategi Marketing</h2>
          <ul>
            <li>Manfaatkan social media Instagram dan TikTok</li>
            <li>Jual melalui marketplace online</li>
            <li>Kerjasama dengan spa dan wellness center</li>
            <li>Ikut bazaar dan craft fair</li>
          </ul>

          <h2>5. Pricing Strategy</h2>
          <p>Hitungan dasar: Cost of goods (40%) + Profit margin (60%) = Selling price</p>

          <p>Workshop Professional WeisCandle memberikan panduan lengkap business planning untuk memastikan kesuksesan bisnis Anda.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        featured: true,
      }
    ];

    samplePosts.forEach(post => this.createBlogPost(post));
  }

  private initializeWorkshopPackages() {
    const samplePackages = [
      {
        name: "Basic Workshop",
        price: 350000,
        duration: "3 jam",
        description: "Workshop dasar pembuatan lilin aromaterapi untuk pemula",
        features: JSON.stringify([
          "2 lilin aromaterapi hasil karya sendiri",
          "Panduan dasar pembuatan lilin",
          "Essential oil blend sederhana",
          "Sertifikat keikutsertaan"
        ]),
        maxParticipants: 15,
        isActive: true,
      },
      {
        name: "Premium Workshop",
        price: 650000,
        duration: "5 jam",
        description: "Workshop lanjutan dengan teknik advanced blending",
        features: JSON.stringify([
          "4 lilin aromaterapi hasil karya sendiri",
          "Panduan lengkap teknik pembuatan lilin",
          "Advanced essential oil blending",
          "Starter kit dasar",
          "Konsultasi lanjutan 1 bulan",
          "Sertifikat keikutsertaan"
        ]),
        maxParticipants: 12,
        isActive: true,
      },
      {
        name: "Professional Workshop",
        price: 1200000,
        duration: "8 jam (2 hari)",
        description: "Workshop profesional dengan business planning lengkap",
        features: JSON.stringify([
          "6 lilin aromaterapi hasil karya sendiri",
          "Panduan lengkap teknik pembuatan lilin",
          "Advanced essential oil blending",
          "Complete starter kit",
          "Template business plan",
          "Marketing strategy guide",
          "Konsultasi bisnis 3 bulan",
          "Akses komunitas online eksklusif",
          "Sertifikat keikutsertaan resmi"
        ]),
        maxParticipants: 8,
        isActive: true,
      }
    ];

    samplePackages.forEach(pkg => this.createWorkshopPackage(pkg));
  }

  private initializeTestimonials() {
    const sampleTestimonials = [
      {
        name: "Sari Dewi",
        location: "Jakarta",
        workshop: "Workshop Basic",
        rating: 5,
        content: "Workshop yang sangat bermanfaat! Saya jadi bisa membuat lilin aromaterapi sendiri di rumah. Instrukturnya sabar dan materinya lengkap.",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        featured: true,
      },
      {
        name: "Budi Santoso",
        location: "Bandung",
        workshop: "Workshop Premium",
        rating: 5,
        content: "Setelah ikut workshop ini, saya jadi bisa memulai bisnis lilin aromaterapi. Sekarang sudah punya 20 pelanggan tetap!",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        featured: false,
      },
      {
        name: "Maya Putri",
        location: "Surabaya",
        workshop: "Workshop Professional",
        rating: 5,
        content: "Sangat puas dengan workshop ini. Selain belajar teknik, juga dapat banyak tips bisnis. Recommended banget!",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        featured: true,
      }
    ];

    sampleTestimonials.forEach(testimonial => this.createTestimonial(testimonial));
  }

  private initializeTeamMembers() {
    const sampleTeam = [
      {
        name: "Sarah Wijaya",
        position: "Founder & CEO",
        bio: "Memiliki pengalaman 8 tahun di industri aromaterapi dan passionate dalam mengembangkan produk natural yang berkualitas.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        socialMedia: JSON.stringify({
          instagram: "@sarahwijaya_weiscandle",
          linkedin: "linkedin.com/in/sarahwijaya"
        }),
        displayOrder: 1,
        isActive: true,
      },
      {
        name: "Michael Chen",
        position: "Head of Production",
        bio: "Expert dalam teknik pembuatan lilin dengan 6 tahun pengalaman. Bertanggung jawab memastikan kualitas produk tetap konsisten.",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        socialMedia: JSON.stringify({
          instagram: "@michaelchen_wc",
          email: "michael@weiscandle.com"
        }),
        displayOrder: 2,
        isActive: true,
      },
      {
        name: "Amanda Putri",
        position: "Workshop Instructor",
        bio: "Instruktur berpengalaman yang telah melatih lebih dari 500 peserta. Dikenal dengan pendekatan mengajar yang sabar dan detail.",
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        socialMedia: JSON.stringify({
          instagram: "@amandaputri_teacher",
          tiktok: "@amandawc"
        }),
        displayOrder: 3,
        isActive: true,
      }
    ];

    sampleTeam.forEach(member => this.createTeamMember(member));
  }

  private initializeExportCategories() {
    const sampleCategories = [
      {
        name: "Premium Soy Candles",
        description: "High-quality soy wax candles with essential oil blends, perfect for international markets.",
        products: JSON.stringify([
          "Lavender Relaxation Candles",
          "Eucalyptus Fresh Candles",
          "Vanilla Comfort Candles",
          "Citrus Energizing Candles"
        ]),
        moq: "100 pieces per order",
        priceRange: "$12 - $25 per piece",
        imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        displayOrder: 1,
        isActive: true,
      },
      {
        name: "Aromatherapy Gift Sets",
        description: "Beautifully packaged candle gift sets with multiple scents and accessories.",
        products: JSON.stringify([
          "Relaxation Gift Set (3 candles + holder)",
          "Spa Collection Set (4 candles + essential oil)",
          "Travel Size Set (6 mini candles)",
          "Wedding Favor Sets (customizable)"
        ]),
        moq: "50 sets per order",
        priceRange: "$35 - $80 per set",
        imageUrl: "https://images.unsplash.com/photo-1574361034536-9e0a5b05b6b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        displayOrder: 2,
        isActive: true,
      },
      {
        name: "Custom Corporate Candles",
        description: "Personalized candles for corporate gifts and branding with custom packaging.",
        products: JSON.stringify([
          "Branded Logo Candles",
          "Custom Scent Development",
          "Corporate Gift Boxes",
          "Event Commemorative Candles"
        ]),
        moq: "200 pieces per order",
        priceRange: "$15 - $40 per piece",
        imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        displayOrder: 3,
        isActive: true,
      }
    ];

    sampleCategories.forEach(category => this.createExportCategory(category));
  }

  private initializeSiteSettings() {
    const sampleSettings = [
      { key: "site_title", value: "WeisCandle - Aromatherapy Workshop", type: "text" },
      { key: "contact_email", value: "info@weiscandle.com", type: "text" },
      { key: "contact_phone", value: "+62 812-3456-7890", type: "text" },
      { key: "workshop_location", value: "Jakarta, Indonesia", type: "text" },
      { key: "max_participants", value: "15", type: "number" },
      { key: "booking_enabled", value: "true", type: "boolean" }
    ];

    sampleSettings.forEach(setting => this.setSiteSetting(setting));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const post: BlogPost = {
      ...insertPost,
      id,
      publishedAt: new Date(),
      featured: insertPost.featured ?? false,
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, insertPost: InsertBlogPost): Promise<BlogPost> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) {
      throw new Error('Blog post not found');
    }

    const updatedPost: BlogPost = {
      ...existingPost,
      ...insertPost,
      id,
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    if (!this.blogPosts.has(id)) {
      throw new Error('Blog post not found');
    }
    this.blogPosts.delete(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
      phone: insertContact.phone ?? null,
    };
    this.contacts.set(id, contact);
    console.log('New contact received:', contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async initializeDatabase(): Promise<void> {
    // Initialize default admin user
    const adminExists = await this.getUserByUsername('admin');
    if (!adminExists) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('password', 10);
      await this.createUser({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Default admin user created: admin/password');
    }
  }

  // Methods for other entities that the admin dashboard needs
  async getTestimonials(): Promise<any[]> {
    return Array.from(this.testimonials.values());
  }

  async getWorkshopPackages(): Promise<any[]> {
    return Array.from(this.workshopPackages.values());
  }

  async getTeamMembers(): Promise<any[]> {
    return Array.from(this.teamMembers.values());
  }

  async getExportCategories(): Promise<any[]> {
    return Array.from(this.exportCategories.values());
  }

  async getSiteSettings(): Promise<any[]> {
    return Array.from(this.siteSettings.values());
  }

  async getPromoPopups(): Promise<any[]> {
    return Array.from(this.promoPopups.values());
  }

  async getActivePromos(): Promise<any[]> {
    const now = new Date();
    return Array.from(this.promoPopups.values()).filter((promo: any) => {
      if (!promo.isActive) return false;
      if (promo.startDate && new Date(promo.startDate) > now) return false;
      if (promo.endDate && new Date(promo.endDate) < now) return false;
      return true;
    });
  }

  async createTestimonial(data: any): Promise<any> {
    const id = this.currentTestimonialId++;
    const testimonial = { ...data, id, createdAt: new Date() };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, data: any): Promise<any> {
    const existing = this.testimonials.get(id);
    if (!existing) throw new Error('Testimonial not found');
    const updated = { ...existing, ...data, id };
    this.testimonials.set(id, updated);
    return updated;
  }

  async deleteTestimonial(id: number): Promise<void> {
    if (!this.testimonials.has(id)) {
      throw new Error('Testimonial not found');
    }
    this.testimonials.delete(id);
  }

  async createWorkshopPackage(data: any): Promise<any> {
    const id = this.currentWorkshopPackageId++;
    const package_ = { ...data, id };
    this.workshopPackages.set(id, package_);
    return package_;
  }

  async updateWorkshopPackage(id: number, data: any): Promise<any> {
    const existing = this.workshopPackages.get(id);
    if (!existing) throw new Error('Workshop package not found');
    const updated = { ...existing, ...data, id };
    this.workshopPackages.set(id, updated);
    return updated;
  }

  async deleteWorkshopPackage(id: number): Promise<void> {
    if (!this.workshopPackages.has(id)) {
      throw new Error('Workshop package not found');
    }
    this.workshopPackages.delete(id);
  }

  async createTeamMember(data: any): Promise<any> {
    const id = this.currentTeamMemberId++;
    const member = { ...data, id };
    this.teamMembers.set(id, member);
    return member;
  }

  async updateTeamMember(id: number, data: any): Promise<any> {
    const existing = this.teamMembers.get(id);
    if (!existing) throw new Error('Team member not found');
    const updated = { ...existing, ...data, id };
    this.teamMembers.set(id, updated);
    return updated;
  }

  async deleteTeamMember(id: number): Promise<void> {
    if (!this.teamMembers.has(id)) {
      throw new Error('Team member not found');
    }
    this.teamMembers.delete(id);
  }

  async setSiteSetting(data: any): Promise<any> {
    const setting = { ...data, updatedAt: new Date() };
    this.siteSettings.set(data.key, setting);
    return setting;
  }

  async createPromoPopup(data: any): Promise<any> {
    const id = this.currentPromoPopupId++;
    const promo = { ...data, id, createdAt: new Date() };
    this.promoPopups.set(id, promo);
    return promo;
  }

  async updatePromoPopup(id: number, data: any): Promise<any> {
    const existing = this.promoPopups.get(id);
    if (!existing) throw new Error('Promo popup not found');
    const updated = { ...existing, ...data, id };
    this.promoPopups.set(id, updated);
    return updated;
  }

  async deletePromoPopup(id: number): Promise<void> {
    if (!this.promoPopups.has(id)) {
      throw new Error('Promo popup not found');
    }
    this.promoPopups.delete(id);
  }

  async createExportCategory(data: any): Promise<any> {
    const id = this.currentExportCategoryId++;
    const category = { ...data, id };
    this.exportCategories.set(id, category);
    return category;
  }

  async updateExportCategory(id: number, data: any): Promise<any> {
    const existing = this.exportCategories.get(id);
    if (!existing) throw new Error('Export category not found');
    const updated = { ...existing, ...data, id };
    this.exportCategories.set(id, updated);
    return updated;
  }

  async deleteExportCategory(id: number): Promise<void> {
    if (!this.exportCategories.has(id)) {
      throw new Error('Export category not found');
    }
    this.exportCategories.delete(id);
  }
}

export const storage = new MemStorage();