import express from 'express';
import path from 'path';

export function setupMiddleware(app, ROOT_DIR) {
    // JSON parsing with increased limit for pasted content
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    
    // Serve static files with correct MIME types
    app.use(express.static(path.join(ROOT_DIR, 'public'), {
        setHeaders: (res, filepath) => {
            if (filepath.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
            } else if (filepath.endsWith('.css')) {
                res.setHeader('Content-Type', 'text/css');
            }
        }
    }));
    
    // Enable CORS for plugin communication
    app.use((_, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    });
}