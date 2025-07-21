import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import middleware
import { setupMiddleware } from './middleware/index.js';

// Import routes
import contentRoutes from './routes/content.js';
import inboxRoutes from './routes/inbox.js';
import generalRoutes from './routes/index.js';
import archiveRoutes from './routes/archive.js';
import metadataRoutes from './routes/metadata.js';
import exportRoutes from './routes/export.js';

// Import utilities
import { ensureDirectories } from './utils/files.js';
import { searchCache } from './utils/search-cache.js';
import { dirCache } from './utils/dir-cache.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const app = express();

// Setup middleware
setupMiddleware(app, ROOT_DIR);

// Serve playground directory
app.use('/playground', express.static(path.join(ROOT_DIR, 'playground')));

// Setup routes
app.use('/api/content', contentRoutes(ROOT_DIR));
app.use('/api/inbox', inboxRoutes);
app.use('/api/archive', archiveRoutes(ROOT_DIR));
app.use('/api/metadata', metadataRoutes(ROOT_DIR));
app.use('/api/export', exportRoutes(ROOT_DIR));
app.use('/api', generalRoutes(ROOT_DIR));

// Initialize server
async function startServer() {
    try {
        // Ensure all required directories exist
        await ensureDirectories(ROOT_DIR);
        
        const PORT = process.env.PORT || 3456;
        const server = app.listen(PORT, () => {
            console.log(`Content Stack running at http://localhost:${PORT}`);
        });
        
        // Setup graceful shutdown
        setupGracefulShutdown(server);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown handler
function setupGracefulShutdown(server) {
    let isShuttingDown = false;
    
    async function shutdown(signal) {
        if (isShuttingDown) return;
        isShuttingDown = true;
        
        console.log(`\n${signal} received. Starting graceful shutdown...`);
        
        // Stop accepting new connections
        server.close(() => {
            console.log('HTTP server closed');
        });
        
        // Give ongoing requests 10 seconds to complete
        const shutdownTimeout = setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
        
        try {
            // Clean up resources
            console.log('Cleaning up resources...');
            
            // Dispose of caches
            searchCache.dispose();
            dirCache.dispose();
            
            // Clear timeout and exit
            clearTimeout(shutdownTimeout);
            console.log('Graceful shutdown completed');
            process.exit(0);
        } catch (error) {
            console.error('Error during shutdown:', error);
            clearTimeout(shutdownTimeout);
            process.exit(1);
        }
    }
    
    // Listen for termination signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        shutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        shutdown('unhandledRejection');
    });
}

startServer();