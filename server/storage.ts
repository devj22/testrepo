import { 
  users, properties, blogPosts, messages, testimonials,
  type User, type InsertUser, 
  type Property, type InsertProperty,
  type BlogPost, type InsertBlogPost,
  type Message, type InsertMessage,
  type Testimonial, type InsertTestimonial
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property methods
  getAllProperties(): Promise<Property[]>;
  getPropertyById(id: number): Promise<Property | undefined>;
  getPropertiesByType(type: string): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Message methods
  getAllMessages(): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageReadStatus(id: number, isRead: boolean): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  
  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private blogPosts: Map<number, BlogPost>;
  private messages: Map<number, Message>;
  private testimonials: Map<number, Testimonial>;
  
  private userCurrentId: number;
  private propertyCurrentId: number;
  private blogPostCurrentId: number;
  private messageCurrentId: number;
  private testimonialCurrentId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.blogPosts = new Map();
    this.messages = new Map();
    this.testimonials = new Map();
    
    this.userCurrentId = 1;
    this.propertyCurrentId = 1;
    this.blogPostCurrentId = 1;
    this.messageCurrentId = 1;
    this.testimonialCurrentId = 1;
    
    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "admin123" // In a real app, this would be hashed
    });
    
    // Add sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertiesByType(type: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.propertyType === type
    );
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.isFeatured
    );
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyCurrentId++;
    const timestamp = new Date();
    const property: Property = { ...insertProperty, id, createdAt: timestamp };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...updateData };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCurrentId++;
    const timestamp = new Date();
    const blogPost: BlogPost = { ...insertBlogPost, id, createdAt: timestamp };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const blogPost = this.blogPosts.get(id);
    if (!blogPost) return undefined;
    
    const updatedBlogPost = { ...blogPost, ...updateData };
    this.blogPosts.set(id, updatedBlogPost);
    return updatedBlogPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Message methods
  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const timestamp = new Date();
    const message: Message = { ...insertMessage, id, isRead: false, createdAt: timestamp };
    this.messages.set(id, message);
    return message;
  }

  async updateMessageReadStatus(id: number, isRead: boolean): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, updateData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial = { ...testimonial, ...updateData };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Sample properties
    const properties: InsertProperty[] = [
      {
        title: "Premium Residential Plot",
        description: "A beautiful residential plot in a prime location with excellent connectivity.",
        price: 12000000,
        location: "Electronic City, Bangalore",
        size: 20,
        sizeUnit: "Guntha",
        features: ["60 ft Road", "BMRDA Approved", "Corner Plot"],
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
        isFeatured: true,
        propertyType: "Residential"
      },
      {
        title: "Fertile Agricultural Land",
        description: "Fertile land suitable for various crops with good water source.",
        price: 9000000,
        location: "Srirangapatna, Mysore",
        size: 2,
        sizeUnit: "Acres",
        features: ["Borewell", "Fertile Soil", "Road Access"],
        images: ["https://images.unsplash.com/photo-1628744404730-5e143358539b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
        isFeatured: false,
        propertyType: "Agricultural"
      },
      {
        title: "Commercial Land",
        description: "Prime commercial land suitable for business development.",
        price: 35000000,
        location: "Gachibowli, Hyderabad",
        size: 40,
        sizeUnit: "Guntha",
        features: ["Highway Access", "Commercial Zone", "Prime Location"],
        images: ["https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
        isFeatured: false,
        propertyType: "Commercial"
      },
      {
        title: "Prime Corner Plot",
        description: "East-facing corner plot in a developing residential area.",
        price: 8500000,
        location: "Sholinganallur, Chennai",
        size: 12,
        sizeUnit: "Guntha",
        features: ["Corner Plot", "East Facing", "Residential Area"],
        images: ["https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
        isFeatured: false,
        propertyType: "Residential"
      },
      {
        title: "Gated Community Plot",
        description: "Premium plot in a gated community with all amenities.",
        price: 15000000,
        location: "Whitefield, Bangalore",
        size: 15,
        sizeUnit: "Guntha",
        features: ["Gated", "Park View", "24/7 Security"],
        images: ["https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
        isFeatured: true,
        propertyType: "Residential"
      },
      {
        title: "Premium Farmland",
        description: "Beautiful farmland with hill view and natural water source.",
        price: 7500000,
        location: "Devanahalli, Bangalore",
        size: 1,
        sizeUnit: "Acres",
        features: ["Water Source", "Hill View", "Farmhouse Permitted"],
        images: ["https://images.unsplash.com/photo-1543746379-c5d6bc868f57?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
        isFeatured: false,
        propertyType: "Agricultural"
      }
    ];

    // Sample blog posts
    const blogPosts: InsertBlogPost[] = [
      {
        title: "5 Things to Consider Before Investing in Land",
        content: "Detailed article about land investment considerations including location, legal verification, future development plans, return on investment analysis, and infrastructure development.",
        excerpt: "Learn the essential factors you should evaluate before making a land investment to ensure maximum returns.",
        author: "Ananya Sharma",
        image: "https://images.unsplash.com/photo-1542879379-a2761ec6d9b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
      },
      {
        title: "Legal Checklist for Land Purchase in India",
        content: "Comprehensive guide covering all legal documents required for land purchase in India, including title deed verification, encumbrance certificate, land use conversion, and tax compliance.",
        excerpt: "Understand the essential legal documents and verifications required when purchasing land property in India.",
        author: "Raj Malhotra",
        image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
      },
      {
        title: "Land Value Trends to Watch in 2023",
        content: "Analysis of current land value trends across major Indian cities, future growth prospects, and recommendations for potential investors.",
        excerpt: "Explore the emerging trends in land values and discover which regions are experiencing the highest growth rates.",
        author: "Vikram Singh",
        image: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
      }
    ];

    // Sample testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Priya Desai",
        location: "Bangalore",
        message: "I was looking for a residential plot in Bangalore for over 6 months. Nainaland Deals helped me find the perfect plot in just 2 weeks. Their team's knowledge and support throughout the process was exceptional.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Arun Kumar",
        location: "Chennai",
        message: "The team at Nainaland Deals provided excellent guidance for my agricultural land investment. Their expertise in legal documentation saved me from potential complications. Highly recommend their services!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
      },
      {
        name: "Meera Reddy",
        location: "Hyderabad",
        message: "As a first-time land investor, I appreciated the transparent approach of Nainaland Deals. They helped me understand the market and found a property that has already appreciated by 15% in just a year!",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
      }
    ];

    // Add properties
    properties.forEach(property => this.createProperty(property));
    
    // Add blog posts
    blogPosts.forEach(post => this.createBlogPost(post));
    
    // Add testimonials
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
  }
}

export const storage = new MemStorage();
