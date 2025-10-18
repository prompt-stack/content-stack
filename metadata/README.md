# Metadata Schema Documentation

This directory contains metadata files for all content stored in the Content Stack system. Each file follows a consistent JSON schema to ensure data integrity and predictability.

## Field Type Hierarchy

### 1. **Immutable Fields** (Cannot be edited after creation)
- `id` - Unique identifier
- `created_at` - Creation timestamp
- `content.hash` - Content fingerprint
- `source` - How content was added

### 2. **System Fields** (Auto-managed, read-only)
- `updated_at` - Last modified timestamp
- `storage.size` - File size in bytes
- `content.word_count` - Word count

### 3. **Constrained Fields** (Editable with specific values)
- `status` - Limited to: `inbox`, `processed`, `manually_processed`, `stored`
- `content.type` - Limited to: `text`, `code`, `data`, `web`, `image`, `document`, `video`, `audio`
- `category` - Limited to: `tech`, `business`, `finance`, `health`, `cooking`, `education`, `lifestyle`, `entertainment`, `general`

### 4. **Free-form Fields** (Editable without constraints)
- `content.title` - Any string
- `content.text` - Full extracted text content for LLM processing
- `tags` - Array of any strings
- `llm_analysis` - AI-generated insights

## File Naming Convention

All metadata files follow this pattern:
```
content-{timestamp}-{random}.json
```

- `timestamp`: Unix timestamp in milliseconds (13 digits)
- `random`: 6-character alphanumeric string for uniqueness

Example: `content-1753136825747-rms75d.json`

## Schema Structure

Every metadata file MUST contain the following fields:

```json
{
  "id": "string",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp",
  "status": "string",
  "source": {},
  "content": {},
  "location": {},
  "llm_analysis": null | {},
  "tags": [],
  "storage": {}
}
```

### Field Definitions

#### 1. **id** (string, required)
- Unique identifier matching the filename (without .json extension)
- Format: `content-{timestamp}-{random}`
- Example: `"content-1753136825747-rms75d"`

#### 2. **created_at** (string, required)
- ISO 8601 timestamp of when the content was first created
- Format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `"2025-07-21T22:27:05.748Z"`

#### 3. **updated_at** (string, required)
- ISO 8601 timestamp of last modification
- Initially same as created_at
- Format: `YYYY-MM-DDTHH:mm:ss.sssZ`

#### 4. **status** (string, required)
- Current processing status
- Allowed values:
  - `"inbox"` - Raw content, not yet processed
  - `"processed"` - AI-enriched and categorized
  - `"manually_processed"` - User-processed without AI
  - `"stored"` - Filed in final location

#### 5. **source** (object, required)
```json
{
  "method": "paste" | "upload" | "drop" | "url",
  "url": "string" | null
}
```
- `method`: How the content was added
- `url`: Original URL if applicable (null otherwise)

#### 6. **content** (object, required)
```json
{
  "type": "text" | "code" | "data" | "web" | "image" | "document" | "video" | "audio",
  "title": "string",
  "full_text": "string",
  "text": "string" | null,
  "word_count": number,
  "hash": "string"
}
```
- `type`: Content type category
- `title`: Display title (auto-generated or user-provided)
- `full_text`: The original content as submitted (DEPRECATED - use content.text)
- `text`: Extracted text content for LLM processing (null for binary files without extraction)
- `word_count`: Number of words in content
- `hash`: SHA256 hash for deduplication

#### 7. **location** (object, required)
```json
{
  "inbox_path": "string",
  "final_path": "string" | null
}
```
- `inbox_path`: Current storage location
- `final_path`: Final destination after processing (null if not processed)

#### 8. **llm_analysis** (object | null, required)
When null: Content hasn't been AI-analyzed
When object:
```json
{
  "category": "tech" | "business" | "finance" | "health" | "cooking" | "education" | "lifestyle" | "entertainment" | "general",
  "confidence": "high" | "medium" | "low",
  "score": 1-10,
  "summary": "string",
  "key_points": ["string"],
  "topics": ["string"],
  "suggested_tags": ["string"]
}
```

#### 9. **tags** (array, required)
- User-assigned tags
- Empty array if no tags
- Example: `["important", "tutorial", "react"]`

#### 10. **storage** (object, required)
```json
{
  "path": "string",
  "type": "string",
  "size": number
}
```
- `path`: Relative path to actual file
- `type`: Storage directory type (text, code, data, etc.)
- `size`: File size in bytes

## Example: Minimal Valid Metadata

```json
{
  "id": "content-1753136825747-rms75d",
  "created_at": "2025-07-21T22:27:05.748Z",
  "updated_at": "2025-07-21T22:27:05.748Z",
  "status": "inbox",
  "source": {
    "method": "paste",
    "url": null
  },
  "content": {
    "type": "text",
    "title": "Untitled",
    "full_text": "",
    "text": "",
    "word_count": 0,
    "hash": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  "location": {
    "inbox_path": "storage/text/content-1753136825747-rms75d.txt",
    "final_path": null
  },
  "llm_analysis": null,
  "tags": [],
  "storage": {
    "path": "storage/text/content-1753136825747-rms75d.txt",
    "type": "text",
    "size": 0
  }
}
```

## Validation Rules

1. **Required Fields**: All root-level fields must be present
2. **ID Consistency**: The `id` field must match the filename
3. **Path Consistency**: `storage.path` should equal `location.inbox_path`
4. **Timestamp Format**: Must be valid ISO 8601 with milliseconds
5. **Status Values**: Must be one of the allowed values
6. **Size Accuracy**: `storage.size` should match actual file size
7. **Hash Format**: Must be SHA256 with "sha256-" prefix

## Best Practices

1. **Never modify** the `id`, `created_at`, or `hash` fields
2. **Always update** `updated_at` when making changes
3. **Keep `full_text`** under 10,000 characters (truncate if needed)
4. **Validate JSON** before saving to prevent corruption
5. **Use atomic writes** to prevent partial updates
6. **Back up** before bulk operations

## Maintenance Scripts

- `scripts/integrity-check.js` - Validate all metadata files
- `scripts/fix-metadata-sizes.js` - Update file sizes
- `scripts/cleanup-storage.js` - Remove orphaned files

## Status Workflow

```
paste/upload/drop/url → inbox → processed/manually_processed → stored
                           ↓
                      (optional AI enrichment)
```

## Notes

- The `llm_analysis` field is populated by the enrichment process
- The `tags` array is for user-defined tags only
- Binary files may have limited `full_text` content
- The system maintains a 1:1 relationship between storage files and metadata