import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import expertRoutes from './routes/expertRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: '*', // Allow Vite frontend
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP. Please try again after 15 minutes.' },
});
app.use('/api/', limiter);

// Body Parsing
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static directory for uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    system: 'AsraVerse AI Agriculture Platform Backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`[AsraVerse Backend] Server running on http://localhost:${PORT}`);
  console.log(`[AsraVerse Backend] REST API Endpoints ready for Frontend`);
  console.log(`=======================================================`);
});

export default app;
