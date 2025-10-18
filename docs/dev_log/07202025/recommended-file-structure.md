# Recommended File Structure for Content Stack

## 🎯 Design Principles

1. **Processing Pipeline**: Clear flow from ingestion → processing → storage
2. **Type Organization**: Content organized by type for easy discovery
3. **Status Tracking**: Files organized by processing state
4. **Metadata Separation**: JSON companions for all content
5. **Local-First Ready**: Easy to sync and search locally
6. **Database Transition**: Structure maps cleanly to DB schema

## 📁 Recommended Structure

```
content/
├── pipeline/                    # Processing pipeline
│   ├── queue/                   # Newly added, awaiting processing
│   │   ├── paste-{timestamp}.txt
│   │   ├── upload-{timestamp}.pdf
│   │   └── url-{timestamp}.html
│   ├── processing/              # Currently being processed
│   │   └── {id}.{ext}
│   ├── failed/                  # Processing failures for review
│   │   └── {id}.{ext}
│   └── temp/                    # Temporary files (uploads, etc.)
│       └── {session-id}/
├── storage/                     # Final processed content
│   ├── text/
│   │   ├── articles/            # Long-form content
│   │   ├── notes/               # Short notes and snippets
│   │   ├── scripts/             # Code and scripts
│   │   ├── emails/              # Email content
│   │   └── social/              # Social media posts
│   ├── media/
│   │   ├── images/              # Screenshots, photos
│   │   ├── videos/              # Video files
│   │   ├── audio/               # Audio files, podcasts
│   │   └── documents/           # PDFs, presentations
│   └── data/
│       ├── spreadsheets/        # CSV, Excel files
│       ├── databases/           # JSON, SQL dumps
│       └── configs/             # Configuration files
├── metadata/                    # JSON companions (flat structure)
│   ├── {content-id}.json        # One metadata file per content item
│   └── indexes/                 # Search indexes
│       ├── by-date.json
│       ├── by-type.json
│       ├── by-tag.json
│       └── by-status.json
└── system/                      # System files
    ├── config.json              # App configuration
    ├── schema.json              # Metadata schema
    └── locks/                   # File locks for concurrent ops
        └── {operation-id}.lock
```

## 🔄 Content Flow

### 1. Ingestion Flow
```
User Action → content/pipeline/queue/{type}-{timestamp}.{ext}
           → metadata/{id}.json (status: "queued")
```

### 2. Processing Flow  
```
Queue → content/pipeline/processing/{id}.{ext}
      → metadata/{id}.json (status: "processing")
      → LLM analysis + enrichment
      → Success: Move to storage/
      → Failure: Move to failed/
```

### 3. Storage Flow
```
Processing Success → content/storage/{type}/{category}/{title}-{id}.{ext}
                  → metadata/{id}.json (status: "stored", location: "storage/...")
```

## 📊 Metadata Schema

### Single Metadata File Per Item
```json
{
  "id": "content-2024-01-15-abc123",
  "status": "queued|processing|stored|failed",
  "pipeline": {
    "queued_at": "2024-01-15T10:00:00Z",
    "processing_started": "2024-01-15T10:01:00Z", 
    "completed_at": "2024-01-15T10:05:00Z",
    "retry_count": 0,
    "error_message": null
  },
  "content": {
    "type": "text|media|data",
    "subtype": "article|note|image|video|spreadsheet",
    "source": "paste|upload|url|drop",
    "title": "Auto-generated or user-provided title",
    "format": "text/markdown|image/png|application/pdf",
    "size": 1024,
    "hash": "sha256-hash-for-deduplication"
  },
  "location": {
    "pipeline_path": "content/pipeline/queue/paste-123.txt",
    "storage_path": "content/storage/text/articles/my-article-123.md",
    "relative_path": "text/articles/my-article-123.md"
  },
  "enrichment": {
    "summary": "AI-generated summary",
    "tags": ["ai", "productivity", "content"],
    "category": "articles",
    "key_points": ["point 1", "point 2"],
    "topics": ["machine learning", "automation"],
    "word_count": 1500,
    "reading_time": "5 min"
  },
  "user": {
    "created_by": "user-id",
    "modified_by": "user-id", 
    "custom_tags": ["personal", "work"],
    "notes": "User notes about this content",
    "rating": 4
  },
  "system": {
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:05:00Z",
    "version": 1,
    "checksum": "file-checksum"
  }
}
```

## 🏗️ Migration Strategy

### Phase 1: Minimal Changes (Immediate)
```bash
# Keep current structure, just add processing states
content/
├── inbox/
│   ├── queue/          # Move current inbox files here
│   ├── processing/     # New
│   └── failed/         # New
├── library/            # Keep as storage/
├── archive/            # Keep as archive/
└── metadata/           # Flatten to single level
```

### Phase 2: Type Organization (Next)
```bash
# Reorganize library by content type
content/storage/
├── text/articles/      # Move from library/tech, library/business
├── text/notes/         # Move from library/notes
├── media/images/       # Move image files
└── media/documents/    # Move PDF files
```

### Phase 3: Full Structure (Future)
```bash
# Complete migration to recommended structure
```

## 🎯 Benefits of This Structure

### 1. Clear Processing Pipeline
- **Queue**: Everything starts here, easy to see what's pending
- **Processing**: Clear indication of what's being worked on
- **Failed**: Error handling and retry capability
- **Storage**: Final organized content

### 2. Type-Based Organization
- **Intuitive**: Developers know where to find content
- **Scalable**: Easy to add new content types
- **Searchable**: Clear categorization for search

### 3. Flat Metadata Structure
- **Fast Queries**: Single directory for all metadata
- **Easy Indexing**: Simple to build search indexes
- **Database Ready**: Maps directly to DB records

### 4. Local-First Optimized
- **Offline Capable**: All data stored locally
- **Fast Access**: No complex nested searches
- **Sync Ready**: Easy to detect changes for sync

### 5. Development Friendly
- **Debugging**: Easy to trace content through pipeline
- **Testing**: Clear separation for mocking different stages
- **Monitoring**: Simple to add file watchers

## 🔧 Implementation Benefits

### For Your Current Needs:
1. **Immediate**: Files appear in IDE instantly when queued
2. **Organized**: Content automatically categorized by type
3. **Reliable**: Processing failures are captured and reviewable
4. **Searchable**: Flat metadata structure enables fast search

### For Database Transition:
1. **Direct Mapping**: Each metadata.json → database record
2. **Batch Operations**: Easy to sync entire directories
3. **Referential Integrity**: File paths stored in metadata
4. **Migration Scripts**: Simple to write file → DB converters

## 🚀 Quick Implementation

To implement this gradually:

1. **Start with pipeline/**: Add queue/, processing/, failed/ subdirs
2. **Flatten metadata/**: Move all metadata to single level
3. **Update API paths**: Point to new queue/ directory
4. **Add processing states**: Update status tracking
5. **Reorganize storage/**: Move library/ to type-based structure

This gives you the benefits immediately while allowing gradual migration!