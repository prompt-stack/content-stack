# Archive Directory

This directory contains processed content files that have been moved from the inbox after successful LLM processing.

## Purpose

The archive serves as:
- **Original content preservation**: Raw files are preserved exactly as ingested
- **Audit trail**: Complete history of what content was processed when
- **Backup reference**: Original source material if library entries need verification
- **Storage optimization**: Keeps inbox clean while preserving all content

## File Naming Convention

Files are prefixed with date when archived:

```
{YYYY-MM-DD}-{original-filename}
```

Examples:
- `2025-01-13-youtube-1752376613445.txt`
- `2025-01-13-article-1752376963783.txt`
- `2025-01-13-paste-1752438581543.txt`
- `2025-01-13-inbox-1752376613445.json` (metadata files)

## Content Flow

```
inbox/ → library/ → archive/
```

1. **Raw content** enters `inbox/`
2. **LLM processing** creates enriched entry in `library/`
3. **Cleanup script** moves original files to `archive/`
4. **Metadata** may also be archived with corresponding content

## Archive Structure

All files are stored flat in this directory with timestamp prefixes for chronological organization. No subdirectories are used to keep the archive simple and searchable.

## Accessing Archived Content

- **Library entries** contain `source_metadata_id` references
- **Metadata files** link back to archived content locations
- **Frontend** can display original content by following reference chain
- **Manual access** via direct file reading when needed

## Cleanup Policy

- **Retention**: All archived content is kept indefinitely
- **Organization**: Chronological by archive date
- **Integrity**: Files are never modified after archiving
- **Reference**: Library entries maintain links to archived sources

This archive ensures that the original source material is always available while keeping the active workspace (inbox) clean and organized.