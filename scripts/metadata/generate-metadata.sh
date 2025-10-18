#!/bin/bash

# Script to generate metadata JSON for content files
# Usage: ./generate-metadata.sh <file-path> [type]

set -e

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Check if file path is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <file-path> [type]"
    echo "Types: text, code, document, image, video, audio, data, web, email, design, archive"
    exit 1
fi

FILE_PATH="$1"
CONTENT_TYPE="${2:-text}"  # Default to text if not specified

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File not found: $FILE_PATH"
    exit 1
fi

# Generate unique ID
TIMESTAMP=$(date +%s%3N)
RANDOM_ID=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-z0-9' | fold -w 6 | head -n 1)
CONTENT_ID="content-${TIMESTAMP}-${RANDOM_ID}"

# Get file info
FILENAME=$(basename "$FILE_PATH")
FILE_SIZE=$(stat -f%z "$FILE_PATH" 2>/dev/null || stat -c%s "$FILE_PATH" 2>/dev/null || echo 0)
MIME_TYPE=$(file -b --mime-type "$FILE_PATH" 2>/dev/null || echo "text/plain")

# Generate SHA256 hash
FILE_HASH="sha256-$(shasum -a 256 "$FILE_PATH" | cut -d' ' -f1)"

# Auto-detect content type based on file extension if not provided
if [ "$CONTENT_TYPE" == "text" ]; then
    case "${FILE_PATH,,}" in
        *.pdf|*.doc|*.docx|*.odt|*.pages|*.epub) CONTENT_TYPE="document" ;;
        *.csv|*.xls|*.xlsx|*.ods|*.numbers) CONTENT_TYPE="spreadsheet" ;;
        *.ppt|*.pptx|*.odp|*.key) CONTENT_TYPE="presentation" ;;
        *.js|*.ts|*.jsx|*.tsx|*.py|*.java|*.cpp|*.html|*.css|*.json|*.xml|*.yaml|*.sh) CONTENT_TYPE="code" ;;
        *.jpg|*.jpeg|*.png|*.gif|*.webp|*.svg|*.bmp|*.ico|*.tiff|*.heic) CONTENT_TYPE="image" ;;
        *.mp4|*.mov|*.avi|*.mkv|*.webm|*.m4v|*.wmv|*.flv|*.3gp|*.mpg) CONTENT_TYPE="video" ;;
        *.mp3|*.wav|*.m4a|*.aac|*.ogg|*.flac|*.wma|*.opus) CONTENT_TYPE="audio" ;;
        *.zip|*.tar|*.gz|*.rar|*.7z|*.bz2) CONTENT_TYPE="archive" ;;
        *.fig|*.sketch|*.xd|*.ai|*.psd|*.indd) CONTENT_TYPE="design" ;;
        *.eml|*.msg|*.mbox) CONTENT_TYPE="email" ;;
        *.html|*.htm|*.mhtml|*.webarchive) CONTENT_TYPE="web" ;;
        *.json|*.jsonl|*.xml|*.sql) CONTENT_TYPE="data" ;;
        *.txt|*.md|*.markdown|*.rtf|*.tex|*.log) CONTENT_TYPE="text" ;;
        *) CONTENT_TYPE="text" ;;  # Default fallback
    esac
fi

# Extract title from file (for markdown files)
TITLE="$FILENAME"
if [[ "$FILE_PATH" == *.md ]]; then
    # Try to extract first heading as title
    FIRST_HEADING=$(grep -m1 "^#\s" "$FILE_PATH" 2>/dev/null | sed 's/^#\s*//' || echo "")
    if [ -n "$FIRST_HEADING" ]; then
        TITLE="$FIRST_HEADING"
    fi
fi

# Get word count for text files
WORD_COUNT=0
if [[ "$MIME_TYPE" == text/* ]] || [[ "$FILE_PATH" == *.md ]]; then
    WORD_COUNT=$(wc -w < "$FILE_PATH" | tr -d ' ')
fi

# Get preview text (first 500 chars for text files)
PREVIEW_TEXT=""
if [[ "$MIME_TYPE" == text/* ]] || [[ "$FILE_PATH" == *.md ]]; then
    PREVIEW_TEXT=$(head -c 500 "$FILE_PATH" | tr '\n' ' ' | sed 's/"/\\"/g')
else
    PREVIEW_TEXT="📄 Binary file: $FILENAME"
fi

# Get current date in ISO format
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

# Determine storage path relative to project root
RELATIVE_PATH=$(realpath "$FILE_PATH" | sed "s|^$(realpath "$PROJECT_ROOT")/||")

# Create metadata JSON
cat > "$PROJECT_ROOT/metadata/${CONTENT_ID}.json" << EOF
{
  "id": "${CONTENT_ID}",
  "created_at": "${CURRENT_DATE}",
  "updated_at": "${CURRENT_DATE}",
  "status": "stored",
  "source": {
    "method": "manual",
    "url": null
  },
  "content": {
    "type": "${CONTENT_TYPE}",
    "title": "${TITLE}",
    "full_text": "${PREVIEW_TEXT}",
    "word_count": ${WORD_COUNT},
    "hash": "${FILE_HASH}",
    "file_type": "${MIME_TYPE}",
    "size": ${FILE_SIZE}
  },
  "location": {
    "inbox_path": null,
    "final_path": "${RELATIVE_PATH}"
  },
  "llm_analysis": null,
  "tags": [],
  "storage": {
    "path": "${RELATIVE_PATH}",
    "type": "${CONTENT_TYPE}",
    "size": ${FILE_SIZE}
  }
}
EOF

echo "✅ Metadata created: $PROJECT_ROOT/metadata/${CONTENT_ID}.json"
echo "   File: $FILE_PATH"
echo "   Type: $CONTENT_TYPE"
echo "   Size: $FILE_SIZE bytes"
echo "   Hash: $FILE_HASH"