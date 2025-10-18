#!/bin/bash

# Delete content and its associated metadata
# Usage: ./delete-content.sh <content-id>

echo "🗑️  Content Deletion Tool"
echo "======================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 <content-id> [--force]"
    echo "Example: $0 content-1753319664670-46u6y7"
    exit 1
fi

CONTENT_ID=$1
FORCE=false

if [ "$2" = "--force" ]; then
    FORCE=true
fi

# Directories to search
CONTENT_DIRS=(
    "../../content/inbox"
    "../../storage"
    "../../content/voice"
    "../../content/how-to"
    "../../content/gtm"
)

echo "Searching for content: $CONTENT_ID"
echo "-----------------------------------"

# Find metadata file
METADATA_FILE="../../metadata/${CONTENT_ID}.json"
metadata_found=false

if [ -f "$METADATA_FILE" ]; then
    metadata_found=true
    echo -e "${GREEN}✓${NC} Found metadata: $METADATA_FILE"
    
    # Show metadata details
    if command -v jq &> /dev/null; then
        title=$(jq -r '.title // .content.title // "no title"' "$METADATA_FILE" 2>/dev/null)
        status=$(jq -r '.status // "unknown"' "$METADATA_FILE" 2>/dev/null)
        created=$(jq -r '.created_at // "unknown"' "$METADATA_FILE" 2>/dev/null)
        
        echo "  Title: $title"
        echo "  Status: $status"
        echo "  Created: $created"
    fi
else
    echo -e "${YELLOW}⚠${NC}  No metadata found"
fi

# Find content files
echo ""
echo "Content files found:"
content_found=false

for dir in "${CONTENT_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        while IFS= read -r file; do
            content_found=true
            echo -e "${GREEN}✓${NC} $file"
            
            # Show file info
            if [ -f "$file" ]; then
                size=$(du -h "$file" | cut -f1)
                echo "  Size: $size"
            fi
        done < <(find "$dir" -name "${CONTENT_ID}*" -type f 2>/dev/null)
    fi
done

if [ "$content_found" = false ]; then
    echo -e "${YELLOW}⚠${NC}  No content files found"
fi

# Nothing to delete?
if [ "$metadata_found" = false ] && [ "$content_found" = false ]; then
    echo ""
    echo -e "${RED}Error:${NC} No files found for content ID: $CONTENT_ID"
    exit 1
fi

# Confirm deletion
echo ""
echo -e "${YELLOW}⚠️  WARNING: This will permanently delete all files for $CONTENT_ID${NC}"

if [ "$FORCE" = false ]; then
    read -p "Are you sure you want to delete these files? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Delete files
echo ""
echo "Deleting files..."

# Delete metadata
if [ "$metadata_found" = true ]; then
    rm "$METADATA_FILE"
    echo -e "${GREEN}✓${NC} Deleted metadata"
fi

# Delete content files
for dir in "${CONTENT_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        find "$dir" -name "${CONTENT_ID}*" -type f -exec rm {} \; 2>/dev/null
    fi
done

echo -e "${GREEN}✓${NC} Deleted content files"
echo ""
echo "Deletion complete!"