# Metadata Field Options Reference

This document lists all metadata fields that pull from predefined options/enums.

## Fields with Predefined Options

### 1. source.method
**Location**: `metadata-schema.config.ts`
```typescript
sourceMethodValues: ['paste', 'upload', 'url', 'drop', 'manual', 'api'] as const
```
- `paste` - Content pasted directly
- `upload` - File uploaded
- `url` - Content fetched from URL
- `drop` - Drag and drop
- `manual` - Manually created
- `api` - Created via API

### 2. status
**Location**: `metadata-schema.config.ts`
```typescript
statusValues: ['raw', 'enriched'] as const
```
- `raw` - Newly created, not enriched by AI
- `enriched` - AI has analyzed and enriched

### 3. content.type
**Location**: `metadata-schema.config.ts` + `file-types.config.ts`
```typescript
contentTypes: [
  'text', 'document', 'spreadsheet', 'presentation',
  'code', 'image', 'video', 'audio', 'archive',
  'design', 'email', 'web', 'data'
] as const
```
Pulled from `file-types.config.ts` which has detailed mappings for each type.

### 4. llm_analysis.category
**Location**: `categories.config.ts`
```typescript
categoriesConfig: {
  tech: { name: 'Technology', ... },
  business: { name: 'Business', ... },
  education: { name: 'Education', ... },
  creative: { name: 'Creative', ... },
  personal: { name: 'Personal', ... },
  reference: { name: 'Reference', ... },
  general: { name: 'General', ... }
}
```
Categories available:
- `tech` - Technology, programming, AI, software
- `business` - Entrepreneurship, marketing, strategy
- `education` - Learning materials, tutorials, courses
- `creative` - Writing, art, design, media
- `personal` - Personal notes, journal, life
- `reference` - Documentation, guides, resources
- `general` - Uncategorized content

### 5. metadata.source_platform (Suggested Values)
**Location**: Not enforced, but common values in code
```
Common platforms:
- YouTube
- Twitter
- Reddit
- GitHub
- Medium
- Substack
- TikTok
- LinkedIn
```

### 6. metadata.language
**Location**: Not enforced, but should use ISO 639-1
```
Common codes:
- en - English
- es - Spanish
- fr - French
- de - German
- pt - Portuguese
- zh - Chinese
- ja - Japanese
- ko - Korean
```

### 7. Library Categories (for final_path)
**Location**: `paths.config.ts`
```typescript
LIBRARY_CATEGORIES = {
  articles: 'articles',
  tutorials: 'tutorials',
  references: 'references',
  projects: 'projects',
  snippets: 'snippets',
  resources: 'resources'
}
```

### 8. Processing Status (Pipeline)
**Location**: `pipeline.config.ts`
```typescript
ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'
```

## Type Definitions

### Fields that Accept ANY String
- `id` - Generated content ID
- `title` - Display title
- `filename` - File name
- `user_tags[]` - User-defined tags
- `source_url` - Source URL
- `reference_urls[]` - Related URLs
- `metadata.*` - Custom metadata fields
- `llm_analysis.title` - AI suggested title
- `llm_analysis.tags[]` - AI suggested tags
- `llm_analysis.summary` - Content summary
- `llm_analysis.reasoning` - AI reasoning
- `llm_analysis.suggested_filename` - Suggested filename
- `llm_analysis.extracted_entities[]` - Extracted entities

### Fields that Accept Numbers
- `content.size` - File size in bytes
- `storage.size` - Storage size
- `llm_analysis.confidence` - 0-1 confidence score
- `llm_analysis.word_count` - Word count
- `content.dimensions.width` - Image/video width
- `content.dimensions.height` - Image/video height

### Fields that Accept Dates/Timestamps
- `created_at` - ISO timestamp
- `updated_at` - ISO timestamp
- `source.timestamp` - ISO timestamp
- `storage.last_accessed` - ISO timestamp
- `metadata.original_date` - Date string
- `llm_analysis.analyzed_at` - ISO timestamp

### Fields that Accept Special Formats
- `content.hash` - SHA256 hash format
- `content.duration` - Duration string (e.g., "10:34")
- `content.file_type` - File extension (e.g., "js", "md", "pdf")

## Usage in Code

When validating or creating metadata:

```typescript
import { metadataSchema } from './metadata-schema.config.ts';
import { categoriesConfig } from './categories.config.ts';

// Check valid source method
if (!metadataSchema.sourceMethodValues.includes(method)) {
  throw new Error(`Invalid source method: ${method}`);
}

// Check valid category
if (!Object.keys(categoriesConfig).includes(category)) {
  throw new Error(`Invalid category: ${category}`);
}

// Check valid content type
if (!metadataSchema.contentTypes.includes(contentType)) {
  throw new Error(`Invalid content type: ${contentType}`);
}
```