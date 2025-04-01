const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import our storage implementation
const { MemStorage } = require('../../server/storage');

const app = express();
const storage = new MemStorage();

// Middleware
app.use(cors());
app.use(express.json());

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'nainaland-jwt-secret';

// Helper function to generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

// Helper function to verify JWT token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.userId };
  } catch (error) {
    return null;
  }
}

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  req.user = payload;
  next();
}

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Property routes
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await storage.getAllProperties();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await storage.getPropertyById(parseInt(req.params.id));
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property' });
  }
});

app.post('/api/properties', authMiddleware, async (req, res) => {
  try {
    const property = await storage.createProperty(req.body);
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property' });
  }
});

app.put('/api/properties/:id', authMiddleware, async (req, res) => {
  try {
    const property = await storage.updateProperty(parseInt(req.params.id), req.body);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property' });
  }
});

app.delete('/api/properties/:id', authMiddleware, async (req, res) => {
  try {
    const result = await storage.deleteProperty(parseInt(req.params.id));
    if (!result) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property' });
  }
});

// Blog routes
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await storage.getAllBlogPosts();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await storage.getBlogPostById(parseInt(req.params.id));
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error fetching blog post' });
  }
});

app.post('/api/blogs', authMiddleware, async (req, res) => {
  try {
    const blog = await storage.createBlogPost(req.body);
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Error creating blog post' });
  }
});

app.put('/api/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await storage.updateBlogPost(parseInt(req.params.id), req.body);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Error updating blog post' });
  }
});

app.delete('/api/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const result = await storage.deleteBlogPost(parseInt(req.params.id));
    if (!result) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Error deleting blog post' });
  }
});

// Message routes
app.get('/api/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await storage.getAllMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = await storage.createMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Error creating message' });
  }
});

app.put('/api/messages/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await storage.updateMessageReadStatus(parseInt(req.params.id), req.body.isRead);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: 'Error updating message' });
  }
});

app.delete('/api/messages/:id', authMiddleware, async (req, res) => {
  try {
    const result = await storage.deleteMessage(parseInt(req.params.id));
    if (!result) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
});

// Testimonial routes
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await storage.getAllTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Error fetching testimonials' });
  }
});

app.post('/api/testimonials', authMiddleware, async (req, res) => {
  try {
    const testimonial = await storage.createTestimonial(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ message: 'Error creating testimonial' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Export the serverless function
module.exports.handler = serverless(app);