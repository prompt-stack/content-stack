# Content Metadata Schema

> **LLM INSTRUCTIONS**: This is the complete metadata schema for all content items. Every field has a purpose for LLM analysis and content organization.

## 🎯 Core Principle

**Metadata is the source of truth** - contains everything needed for LLM decision-making and content management.

## 📋 Complete Metadata Schema

```json
{
  "id": "content-2024-01-15-abc123",
  "version": 1,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:05:00.000Z",
  
  "status": {
    "current": "inbox",
    "history": [
      {"status": "inbox", "timestamp": "2024-01-15T10:00:00Z"},
      {"status": "analyzed", "timestamp": "2024-01-15T10:01:00Z"},
      {"status": "stored", "timestamp": "2024-01-15T10:05:00Z"}
    ]
  },

  "source": {
    "channel": "web-ui",
    "method": "paste",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "ip_address": "127.0.0.1",
    "session_id": "sess-456789",
    "user_id": "user-123",
    "referrer": "https://example.com/page",
    "url": null
  },

  "content": {
    "type": "text",
    "format": "text/plain",
    "encoding": "utf-8",
    "language": "en",
    "size_bytes": 1024,
    "hash_sha256": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    "title": "Auto-extracted or user-provided title",
    "summary": "Brief summary of content (first 200 chars or LLM-generated)",
    "word_count": 150,
    "character_count": 1024,
    "line_count": 12,
    "reading_time_minutes": 1,
    "full_text": "Complete content for LLM analysis..."
  },

  "extraction": {
    "method": "direct_paste",
    "url_extracted_from": null,
    "youtube_video_id": null,
    "reddit_post_id": null,
    "tiktok_video_id": null,
    "pdf_page_count": null,
    "extraction_confidence": 1.0,
    "extraction_errors": [],
    "raw_html": null,
    "cleaned_text": "Processed version of content..."
  },

  "analysis": {
    "llm_model": "claude-3-sonnet",
    "analyzed_at": "2024-01-15T10:01:00Z",
    "confidence": 0.95,
    "category": "articles",
    "subcategory": "technical",
    "reasoning": "This appears to be a technical article about...",
    "topics": ["machine learning", "automation", "productivity"],
    "tags": ["ai", "tutorial", "beginner-friendly"],
    "sentiment": "neutral",
    "complexity_level": "intermediate",
    "actionable": true,
    "key_points": [
      "Main concept explained",
      "Step-by-step process",
      "Real-world applications"
    ],
    "entities": {
      "people": ["John Doe", "Jane Smith"],
      "organizations": ["OpenAI", "Google"],
      "locations": ["San Francisco", "New York"],
      "technologies": ["Python", "React", "Docker"]
    }
  },

  "storage": {
    "inbox_path": "content/inbox/web-paste-2024-01-15-abc123.txt",
    "final_path": "content/storage/articles/machine-learning-automation-guide-abc123.md",
    "relative_path": "articles/machine-learning-automation-guide-abc123.md",
    "backup_paths": [],
    "file_format": "markdown",
    "suggested_filename": "machine-learning-automation-guide.md"
  },

  "processing": {
    "queue_position": 1,
    "priority": "normal",
    "retry_count": 0,
    "last_error": null,
    "processing_duration_ms": 3500,
    "llm_cost_cents": 0.05,
    "operations_log": [
      {"operation": "sanitize_content", "duration_ms": 100, "success": true},
      {"operation": "extract_metadata", "duration_ms": 200, "success": true},
      {"operation": "llm_analysis", "duration_ms": 3000, "success": true},
      {"operation": "move_to_storage", "duration_ms": 200, "success": true}
    ]
  },

  "user": {
    "user_id": "user-123",
    "workspace_id": "workspace-456",
    "custom_tags": ["work", "important"],
    "user_notes": "This is relevant for the Q2 project",
    "rating": 4,
    "favorite": false,
    "read": false,
    "archived": false,
    "shared_with": [],
    "access_level": "private"
  },

  "relationships": {
    "parent_id": null,
    "child_ids": [],
    "related_content_ids": ["content-def456", "content-ghi789"],
    "duplicate_of": null,
    "similar_content_ids": ["content-jkl012"],
    "references": [
      {"type": "url", "value": "https://example.com/source"},
      {"type": "book", "value": "The Art of Machine Learning"}
    ],
    "mentioned_in": ["content-mno345"]
  },

  "search": {
    "searchable_text": "Combined text for full-text search...",
    "keywords": ["machine learning", "automation", "ai", "tutorial"],
    "indexed_at": "2024-01-15T10:05:00Z",
    "search_boost": 1.0,
    "exclude_from_search": false
  },

  "validation": {
    "is_valid": true,
    "validation_errors": [],
    "content_warnings": [],
    "contains_pii": false,
    "contains_sensitive_data": false,
    "safe_for_ai_training": true,
    "copyright_status": "unknown"
  },

  "system": {
    "schema_version": "1.0.0",
    "created_by_system": "content-stack-v1.2.3",
    "last_modified_by": "user-123",
    "backup_count": 0,
    "sync_status": "synced",
    "local_only": false,
    "checksum": "file-content-checksum-here"
  }
}
```

## 🔍 Field Purposes

### Core Identity
- **id**: Unique identifier across system
- **version**: For schema evolution and conflict resolution
- **timestamps**: Track creation and modification

### Status Tracking
- **current**: Where content is in pipeline (inbox → analyzed → stored)
- **history**: Full audit trail of status changes

### Source Context (Critical for LLM)
- **channel**: Where content came from (web-ui, api, mobile)
- **method**: How it was added (paste, upload, url, drop)
- **user_agent**: Browser/app context
- **session_id**: For grouping related submissions

### Content Analysis (LLM Input)
- **full_text**: Complete content for LLM analysis
- **type/format**: Help LLM understand content structure
- **size/counts**: Content metrics for processing decisions
- **hash**: Deduplication and integrity checking

### Extraction Details
- **method**: How content was obtained
- **confidence**: Reliability of extraction
- **errors**: What went wrong (for debugging)
- **raw_html**: Original source (for re-processing)

### LLM Analysis Results
- **category/subcategory**: Where content should be stored
- **reasoning**: Why LLM made this decision
- **topics/tags**: Content classification
- **entities**: Extracted people, places, technologies
- **key_points**: Structured summary

### Storage Management
- **paths**: Where files are located
- **suggested_filename**: LLM-generated friendly name
- **file_format**: Final storage format

### Processing Metrics
- **operations_log**: Detailed processing steps
- **duration/cost**: Performance tracking
- **retry_count**: Error recovery

### User Interaction
- **custom_tags**: User-added organization
- **notes**: User context
- **rating/favorite**: User preferences

### Content Relationships
- **related_content_ids**: Connected content
- **duplicate_of**: Deduplication
- **references**: External sources

### Search Optimization
- **searchable_text**: Optimized for search
- **keywords**: Search terms
- **boost**: Relevance weighting

### Content Safety
- **validation_errors**: Content issues
- **contains_pii**: Privacy protection
- **safe_for_ai_training**: AI ethics

## 🎯 Essential vs Optional Fields

### Always Required (Core)
```json
{
  "id": "required",
  "created_at": "required", 
  "status.current": "required",
  "source.channel": "required",
  "source.method": "required",
  "content.type": "required",
  "content.full_text": "required",
  "storage.inbox_path": "required"
}
```

### LLM Analysis Required
```json
{
  "analysis.category": "required for storage",
  "analysis.reasoning": "required for debugging",
  "analysis.confidence": "required for validation",
  "storage.final_path": "required after analysis"
}
```

### Optional/Computed
```json
{
  "content.word_count": "computed from full_text",
  "content.reading_time_minutes": "computed from word_count",
  "relationships.*": "computed over time",
  "user.*": "user preferences"
}
```

## 🤖 LLM Usage Patterns

### For Categorization
```typescript
// LLM gets this context:
const llmInput = {
  content: metadata.content.full_text,
  type: metadata.content.type,
  format: metadata.content.format,
  source: `${metadata.source.channel}/${metadata.source.method}`,
  size: metadata.content.word_count,
  title: metadata.content.title
};
```

### For Storage Decision
```typescript
// LLM returns this:
const llmOutput = {
  category: "articles",
  subcategory: "technical", 
  reasoning: "This is a technical tutorial about...",
  confidence: 0.95,
  suggested_filename: "docker-setup-guide.md",
  topics: ["docker", "devops", "tutorial"],
  tags: ["beginner-friendly", "step-by-step"]
};
```

## 📊 Metadata Evolution

### Version 1.0 (Current)
- Basic content management
- Simple LLM categorization
- File system storage

### Future Versions
- **1.1**: Add collaboration fields
- **1.2**: Add workflow automation
- **1.3**: Add advanced AI features
- **2.0**: Add vector embeddings

## 🚀 Implementation Priority

### Phase 1 (MVP)
1. Core identity fields
2. Source tracking 
3. Content storage
4. Basic LLM analysis

### Phase 2 (Enhanced)
1. Processing metrics
2. User preferences
3. Content relationships
4. Search optimization

### Phase 3 (Advanced)
1. Content safety
2. Advanced analytics
3. Workflow automation
4. Collaboration features

**REMEMBER**: Start minimal, expand based on actual usage patterns!