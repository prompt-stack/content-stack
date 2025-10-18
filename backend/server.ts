/**
 * @layer backend-server
 * @description Express server for content inbox API
 * @dependencies express, cors, ../routes/contentInbox
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming conventions:
 * - Server setup with proper error handling
 * - Middleware configuration
 */

import express from 'express';
import cors from 'cors';
import contentInboxRoutes from './routes/contentInbox';
import storageRoutes from './routes/storage';
import healthRoutes from './routes/health';
import metadataRoutes from './routes/metadata';
import emailIntakeRoutes from './routes/emailIntake';

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3457;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support large content
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/content-inbox', contentInboxRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/email-intake', emailIntakeRoutes);

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Content Inbox API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Storage audit: http://localhost:${PORT}/api/health/storage-audit`);
  console.log(`API base: http://localhost:${PORT}/api/content-inbox`);
});

export default app;