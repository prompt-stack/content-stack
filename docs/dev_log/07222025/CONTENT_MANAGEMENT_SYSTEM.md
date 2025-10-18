# Content Management System

## Overview

Our content management system uses three primary directories that work together like a library system:

1. **`/content/`** - The creative canvas (workspace)
2. **`/metadata/`** - The catalog/receipts (Dewey Decimal system)
3. **`/storage/`** - The organized archive (files sorted by type)

## Directory Purposes

### `/content/` - The Canvas
- Where content is actively created and edited
- Voice notes, drafts, work-in-progress
- Substack articles, social media posts
- Temporary workspace before organization

### `/metadata/` - The Catalog
- JSON files that track every piece of content
- Contains file hash, location, type, timestamps
- Acts as the "receipt" for each file
- Enables deduplication and tracking

### `/storage/` - The Archive
- Organized by file type (images/, documents/, video/, etc.)
- Final resting place for processed content
- Clean, organized structure
- Ready for deployment/publishing

## Workflow

```
1. Create content in /content/
     ↓
2. Generate metadata in /metadata/
     ↓
3. Organize into /storage/
     ↓
4. Clean up workspace
```

## Available Scripts

### 1. `generate-metadata.sh`
Generate metadata for individual files:
```bash
./scripts/generate-metadata.sh "content/voice/my-note.md"
```

### 2. `generate-missing-metadata.sh`
Find and create metadata for all files without it:
```bash
./scripts/generate-missing-metadata.sh
```

### 3. `content-audit.sh`
Comprehensive audit of the entire system:
```bash
# Basic audit
./scripts/content-audit.sh

# Export detailed report
./scripts/content-audit.sh --export
```

### 4. `validate-metadata.sh`
Check metadata integrity and clean up orphans:
```bash
# Check only
./scripts/validate-metadata.sh

# Fix issues
./scripts/validate-metadata.sh --fix
```

### 5. `content-organizer.sh`
Move content from workspace to storage:
```bash
# Interactive mode
./scripts/content-organizer.sh

# Dry run (preview)
./scripts/content-organizer.sh --dry-run

# Auto move all
./scripts/content-organizer.sh --auto

# Move specific types
./scripts/content-organizer.sh --pattern "*.pdf"
```

## Best Practices

### Creating Content
1. Work freely in `/content/` subdirectories
2. Organize by project or type (voice/, substack/, etc.)
3. Don't worry about perfect organization while creating

### After Creating
1. Run `generate-missing-metadata.sh` to catalog new content
2. Use `content-organizer.sh` to move finished work to storage
3. Run `content-audit.sh` to verify everything is tracked

### Project Cleanup
1. Run audit to see what was created
2. Generate metadata for all new files
3. Organize finished content to storage
4. Remove temporary/draft files
5. Validate metadata integrity

## File Type Mapping

Files are automatically organized in storage by type:

- **text/** - .txt, .md, .rtf
- **documents/** - .pdf, .doc, .docx
- **images/** - .jpg, .png, .gif, .svg
- **video/** - .mp4, .mov, .webm
- **audio/** - .mp3, .wav, .m4a
- **code/** - .js, .py, .html, .css
- **data/** - .json, .xml, .csv
- **archives/** - .zip, .tar, .rar

## Metadata Schema

Each file gets a metadata JSON with:
```json
{
  "id": "content-[timestamp]-[random]",
  "created_at": "ISO timestamp",
  "content": {
    "type": "detected type",
    "hash": "sha256 hash",
    "title": "extracted title"
  },
  "location": {
    "final_path": "storage/type/file.ext"
  }
}
```

## Audit Checks

The system performs bidirectional validation:

1. **Content → Metadata**: Every file should have a receipt
2. **Metadata → File**: Every receipt should have a file
3. **Location Accuracy**: Files should be where metadata says

## Example Workflow

```bash
# 1. Create content
echo "My new article" > content/voice/new-article.md

# 2. Generate metadata
./scripts/generate-missing-metadata.sh

# 3. Review what we have
./scripts/content-audit.sh

# 4. Organize to storage
./scripts/content-organizer.sh --pattern "*.md"

# 5. Validate everything
./scripts/validate-metadata.sh
```

## Troubleshooting

### Missing Metadata
- Run `generate-missing-metadata.sh`
- Check file permissions
- Verify file isn't in excluded patterns

### Orphaned Metadata
- Run `validate-metadata.sh --fix`
- Manually check if file was moved/deleted
- Update metadata location if needed

### Duplicate Files
- Check file hashes in metadata
- Use content-audit to find duplicates
- Remove duplicates, keep metadata

---

Remember: The goal is to have every piece of content tracked with metadata, organized by type, and ready for use in your projects!