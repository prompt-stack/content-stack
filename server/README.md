# Content Stack Server

The Content Stack server has been refactored for better organization and maintainability.

## Directory Structure

```
server/
├── index.js           # Main server entry point
├── extractors.js      # URL content extraction logic
├── search.js          # Search functionality
├── middleware/
│   └── index.js       # Express middleware setup
├── routes/
│   ├── content.js     # /api/content/* endpoints
│   ├── inbox.js       # /api/inbox/* endpoints
│   └── index.js       # General API endpoints
└── utils/
    └── files.js       # File system utilities
```

## Architecture

### Main Server (index.js)
- Minimal configuration
- Imports and sets up all modules
- Starts the Express server

### Middleware (middleware/index.js)
- JSON parsing
- Static file serving
- CORS configuration

### Routes
Routes are organized by domain:

#### content.js
- `/api/content/library` - Get library content
- `/api/content/categories` - Get categories
- `/api/content/stats` - Get statistics
- `/api/content/search` - Search content
- `/api/content/:id` - Get specific content
- `/api/content/:id/similar` - Find similar content
- `/api/content/duplicates` - Detect duplicates
- `/api/content/:id/transform` - Transform via plugin
- `/api/content/link` - Link content items

#### inbox.js
- `/api/inbox` - Get inbox listing
- `/api/inbox/:id` - Get specific inbox item
- `POST /api/inbox` - Save content to inbox
- `POST /api/inbox/upload` - Upload binary files
- `DELETE /api/inbox/:id` - Delete inbox item
- `POST /api/inbox/link` - Link inbox items
- `POST /api/inbox/prepare` - Prepare for processing

#### index.js (general routes)
- `/api/config/content-types` - Get content type config
- `/api/archive/:timestamp` - Get archived content
- `/api/plugins` - List plugins
- `/api/extract-url` - Extract content from URL

### Utilities (utils/files.js)
- `ensureDirectories()` - Create required directories
- `findContentById()` - Find content in library
- `getContentStats()` - Calculate statistics
- `generateFilename()` - Generate standardized filenames
- `detectContentType()` - Detect content type from data

## Benefits of Refactoring

1. **Separation of Concerns**: Each module has a single responsibility
2. **Maintainability**: Easier to find and modify specific functionality
3. **Testability**: Individual modules can be tested in isolation
4. **Scalability**: New routes and utilities can be added easily
5. **Readability**: Smaller files are easier to understand

## Adding New Features

### Adding a New Route
1. Create a new file in `routes/` or add to existing route file
2. Export a function that returns an Express router
3. Import and use in `index.js`

### Adding Utilities
1. Add functions to `utils/files.js` or create new util files
2. Import where needed

### Adding Middleware
1. Add to `middleware/index.js` or create new middleware files
2. Apply in the main server setup

## Dependencies
- express - Web framework
- multer - File upload handling
- dotenv - Environment variables
- Standard Node.js modules (fs, path, etc.)