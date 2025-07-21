# Metadata Directory

This directory contains metadata files that serve as the "source of truth" for all content in the system. Each metadata file contains both tracking information and the original content.

## Architecture Philosophy

Metadata files are the cornerstone of the token-optimized architecture:
- **Single source of truth**: Contains original content + tracking data
- **Token efficiency**: Library entries reference metadata instead of duplicating content
- **Complete context**: Everything needed for LLM processing in one file

## File Naming Convention

```
{content-id}.json
```

Examples:
- `inbox-1752376613445.json` - Legacy format with "inbox-" prefix
- `youtube-1752376613445.json` - New format matching content files
- `article-1752376963783.json` - Article extraction metadata
- `paste-1752438581543.json` - Pasted content metadata

## File Structure

Each metadata file contains:

```json
{
  "id": "youtube-1752376613445",
  "original_filename": "How to Build AI Agents.txt", 
  "saved_filename": "youtube-1752376613445.txt",
  "source": "url-youtube|web-paste|file-upload|manual",
  "saved_at": "2025-01-13T12:00:00Z",
  "size": 15420,
  "content_hash": "abc123def456",
  "status": "raw|processed|archived",
  "is_binary": false,
  "mime_type": "text/plain",
  
  "original_content": "Full text content here...",
  
  "extraction": {
    "platform": "youtube",
    "url": "https://youtube.com/watch?v=...",
    "title": "How to Build AI Agents",
    "author": "Channel Name",
    "extractedAt": "2025-01-13T12:00:00Z",
    "metadata": {
      "duration": "15:30",
      "views": "125K",
      "publishDate": "2025-01-10"
    }
  },
  
  "links": {
    "describes": [],
    "related": [],
    "source": [],
    "derived_from": []
  }
}
```

## Key Fields

### Core Tracking
- **id**: Unique identifier matching content filename
- **status**: Processing state (raw → processed → archived)
- **content_hash**: SHA-256 hash for deduplication
- **original_content**: The actual text content (for non-binary files)

### Source Information
- **source**: How content entered the system
- **extraction**: Platform-specific metadata when extracted from URLs
- **original_filename**: Human-readable name
- **saved_filename**: System-generated filename

### Content Properties
- **size**: File size in bytes
- **mime_type**: Content type
- **is_binary**: Whether content is binary (images, PDFs, etc.)

## Processing Flow

1. **Content Ingestion**: Creates metadata file with `status: "raw"`
2. **LLM Processing**: Library entry created with `source_metadata_id` reference
3. **Status Update**: Metadata updated to `status: "processed"`
4. **Archive**: Content files moved, metadata may be archived too

## Token Optimization

The metadata-centric approach saves tokens by:
- **No duplication**: Original content stored once in metadata
- **Reference system**: Library entries point to metadata, don't copy content
- **Efficient processing**: LLM reads metadata once, outputs enrichment only

## Content Access

- **Library entries** use `source_metadata_id` to reference metadata files
- **Frontend** fetches original content via metadata API endpoint
- **Processing scripts** read metadata directly for LLM input
- **Archive links** maintain connection between processed and original content

## File Lifecycle

```
1. Content ingested → metadata/content-123.json (status: raw)
2. LLM processes → library/category/title-123.json (references metadata)  
3. Status updated → metadata/content-123.json (status: processed)
4. Archive cleanup → content moved, metadata preserved or archived
```

This metadata-first approach ensures content integrity while optimizing for LLM processing efficiency.