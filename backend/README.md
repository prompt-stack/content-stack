# Content Stack Backend

Clean backend implementation following design-system naming conventions.

## 🚀 Quick Start

### Option 1: Using root package.json
```bash
# From project root
npm run backend:dev    # Start backend in watch mode
npm run dev:new       # Start both frontend + new backend
```

### Option 2: Using backend package.json
```bash
# Install backend dependencies
cd backend
npm install

# Run backend
npm run dev           # Start in watch mode
npm run test          # Run tests
npm start             # Start production
```

## 📡 API Endpoints

Base URL: `http://localhost:3456`

### Content Inbox
- `GET /api/content-inbox/items` - Get all inbox items
- `POST /api/content-inbox/add` - Add new content
- `GET /api/content-inbox/item/:id` - Get specific item
- `PUT /api/content-inbox/item/:id` - Update item
- `DELETE /api/content-inbox/item/:id` - Delete item
- `GET /api/content-inbox/search?q=query` - Search content
- `GET /api/content-inbox/stats` - Get statistics

### Health Check
- `GET /health` - Server health status

## 📋 Request Examples

### Add Paste Content
```bash
curl -X POST http://localhost:3456/api/content-inbox/add \
  -H "Content-Type: application/json" \
  -d '{
    "method": "paste",
    "content": "This is my test content"
  }'
```

### Add File Content
```bash
curl -X POST http://localhost:3456/api/content-inbox/add \
  -H "Content-Type: application/json" \
  -d '{
    "method": "upload",
    "content": "function hello() { console.log(\"Hello!\"); }",
    "filename": "hello.js"
  }'
```

### Add URL Content
```bash
curl -X POST http://localhost:3456/api/content-inbox/add \
  -H "Content-Type: application/json" \
  -d '{
    "method": "url",
    "content": "https://example.com/article",
    "url": "https://example.com/article"
  }'
```

## 🏗️ Architecture

### Services
- `ContentInboxService` - Handle inbox operations
- `MetadataService` - Handle metadata queries

### Utils
- `generateContentId` - Create unique IDs
- `detectContentType` - Detect content types
- `detectFileType` - Detect file types from extensions
- `createMetadata` - Generate metadata
- `extractTitle` - Extract titles from content

### File Structure
```
backend/
├── services/           # Business logic
├── routes/            # API endpoints  
├── utils/             # Utility functions
├── types/             # TypeScript types
├── server.ts          # Express server
└── test.ts            # Simple tests
```

## 📁 Content Storage

Files are stored in:
```
content/
├── inbox/             # Raw content files
├── metadata/          # JSON metadata files
└── storage/           # Processed content (future)
```

## 🎯 Content Types Supported

Based on `INGEST_FILES.MD`:
- **Text**: `.txt`, `.md`, `.html`
- **Code**: `.js`, `.ts`, `.py`, `.java`, etc.
- **Documents**: `.pdf`, `.docx`, `.pptx`
- **Images**: `.png`, `.jpg`, `.webp`
- **Videos**: `.mp4`, `.mov`, `.webm`
- **Audio**: `.mp3`, `.wav`, `.m4a`
- **Data**: `.csv`, `.xlsx`, `.json`
- **Design**: `.fig`, `.sketch`, `.svg`
- **Archives**: `.zip`, `.rar`, `.7z`
- **Email**: `.eml`, `.mbox`
- **Web**: URLs and HTML content

## 🧪 Testing

```bash
# Run simple backend tests
npm run test

# Test specific endpoint
curl http://localhost:3456/health
```

## 🔧 Configuration

- **Port**: 3456 (matches existing API base URL)
- **CORS**: Enabled for frontend development
- **Body Limit**: 10MB for large content
- **Content Directory**: `../content` (relative to backend)