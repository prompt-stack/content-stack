# Content Metadata Schema (MVP)

> **Version**: 2.0 (Simplified MVP Schema)  
> **Updated**: 2025-07-21  
> **Backend**: `/backend/` (New TypeScript backend)

This document describes the simplified metadata structure used in Content Stack. Every content item has a corresponding metadata file that serves as the source of truth.

## Overview

- **Location**: `/content/metadata/{content-id}.json`
- **Format**: JSON files with standardized structure
- **Naming**: `content-{timestamp}-{randomId}.json`
- **Philosophy**: Simple, focused, easily extendable

## Core Schema Structure

```typescript
interface ContentMetadata {
  // Identity & Timestamps
  id: string;                    // Unique identifier
  created_at: string;            // ISO timestamp when created
  updated_at: string;            // ISO timestamp when last modified
  
  // Status & Lifecycle
  status: 'inbox' | 'stored';    // Current processing status
  
  // Source Information
  source: {
    method: 'paste' | 'upload' | 'url' | 'drop';
    url: string | null;          // Original URL if applicable
  };
  
  // Content Details
  content: {
    type: ContentType;           // Detected content type
    title: string;               // Extracted or generated title
    full_text: string;           // Complete text content
    word_count: number;          // Word count for text content
    hash: string;                // SHA-256 hash for deduplication
  };
  
  // File System Locations
  location: {
    inbox_path: string;          // Path to file in inbox
    final_path: string | null;   // Path after moving to library
  };
  
  // Tags
  tags: string[];                  // User-assigned tags
  
  // AI Analysis (Future)
  llm_analysis: LLMAnalysis | null;
}
```

## Content Types

Based on comprehensive file type detection from `INGEST_FILES.MD`:

```typescript
type ContentType = 
  | 'text'      // Plain text, markdown
  | 'code'      // Source code files
  | 'document'  // PDFs, Word docs, presentations
  | 'image'     // Photos, screenshots, diagrams
  | 'video'     // Video files, screen recordings
  | 'audio'     // Audio files, podcasts
  | 'data'      // CSV, JSON, databases
  | 'web'       // URL extractions
  | 'email'     // Email content
  | 'design'    // Figma, Sketch, design files
  | 'archive';  // ZIP, compressed files
```

## Status Lifecycle

```
inbox → stored
```

- **inbox**: New content, awaiting processing/organization
- **stored**: Content moved to organized library structure

## Source Methods

- **paste**: Content pasted via web UI
- **upload**: File uploaded via web UI  
- **url**: Content extracted from URL
- **drop**: File drag-and-dropped to UI

## Example: Text Content

```json
{
  "id": "content-1753059856551-9l6noj",
  "created_at": "2025-07-21T01:04:16.551Z", 
  "updated_at": "2025-07-21T01:04:16.551Z",
  "status": "inbox",
  "source": {
    "method": "paste",
    "url": null
  },
  "content": {
    "type": "text",
    "title": "API Development Notes",
    "full_text": "REST APIs should follow CRUD patterns...",
    "word_count": 156,
    "hash": "sha256-5e8aa1a857091d99d607502c85b69e24459c1024c2c04e8a18573cf7c10d87c3"
  },
  "location": {
    "inbox_path": "content/inbox/paste-1753059856552-9l6noj.txt",
    "final_path": null
  },
  "tags": [],
  "llm_analysis": null
}
```

## Example: File Upload

```json
{
  "id": "content-1753059900001-abc123", 
  "created_at": "2025-07-21T01:05:00.001Z",
  "updated_at": "2025-07-21T01:05:00.001Z",
  "status": "inbox",
  "source": {
    "method": "upload", 
    "url": null
  },
  "content": {
    "type": "document",
    "title": "Project Requirements.pdf",
    "full_text": "",
    "word_count": 0,
    "hash": "sha256-a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
  },
  "location": {
    "inbox_path": "content/inbox/upload-1753059900002-abc123.pdf",
    "final_path": null
  },
  "tags": [],
  "llm_analysis": null
}
```

## Example: URL Extraction

```json
{
  "id": "content-1753059950001-xyz789",
  "created_at": "2025-07-21T01:05:50.001Z", 
  "updated_at": "2025-07-21T01:05:50.001Z",
  "status": "inbox",
  "source": {
    "method": "url",
    "url": "https://blog.example.com/api-best-practices"
  },
  "content": {
    "type": "web", 
    "title": "API Best Practices Guide",
    "full_text": "When building REST APIs, consider these principles...",
    "word_count": 2847,
    "hash": "sha256-f9e8d7c6b5a4321098765432109876543210fedcba0987654321fedcba098765"
  },
  "location": {
    "inbox_path": "content/inbox/url-1753059950002-xyz789.txt",
    "final_path": null 
  },
  "tags": [],
  "llm_analysis": null
}
```

## LLM Analysis Structure (Future)

```typescript
interface LLMAnalysis {
  summary: string;              // AI-generated summary
  category: string;             // Suggested category
  tags: string[];               // Extracted tags
  reasoning: string;            // AI reasoning for categorization
  confidence: number;           // Confidence score 0-1
  processed_at: string;         // When analysis was completed
}
```

## Key Principles

### 1. **Simplicity First**
- Only 12 core fields vs 50+ in previous schema
- Clear, predictable structure
- Easy to extend without breaking changes

### 2. **Local-First Design**
- All content stored as files
- Metadata provides complete picture
- Easy database migration path

### 3. **Type Safety**
- Full TypeScript definitions
- Comprehensive content type detection
- Structured error handling

### 4. **Deduplication**
- SHA-256 hashing prevents duplicates
- Content-based, not filename-based
- Efficient storage management

### 5. **Future-Proof**
- `llm_analysis` ready for AI integration
- Extensible content types
- Version-compatible structure

## Usage in Code

### Reading Metadata
```typescript
import { readFile } from 'fs/promises';

const metadata = JSON.parse(
  await readFile(`content/metadata/${contentId}.json`, 'utf-8')
);
```

### Reading Content
```typescript
// Text content is in metadata
const textContent = metadata.content.full_text;

// Binary files need to be read from inbox
const binaryContent = metadata.content.type !== 'text' && metadata.content.type !== 'code'
  ? await readFile(metadata.location.inbox_path)
  : metadata.content.full_text;
```

### Status Checking
```typescript
if (metadata.status === 'inbox') {
  // Ready for processing/organization
}
```

## Migration from V1 Schema

Old files in `/content/metadata/raw/` use the complex v1 schema. New files use this simplified v2 schema. Both are supported but new content should use v2.

## Validation

The backend validates all metadata fields and ensures:
- Required fields are present
- Types match schema definitions  
- Content hash is valid SHA-256
- File paths exist and are accessible
- Status transitions are valid

## Performance Notes

- Metadata files are small (typically < 2KB)
- Fast read/write operations
- Efficient for search and filtering
- Scales well to thousands of items