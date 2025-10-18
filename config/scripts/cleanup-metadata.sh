#!/bin/bash

# Cleanup metadata - find and optionally remove orphaned metadata files
# Orphaned = metadata exists but no corresponding content file

echo "🧹 Metadata Cleanup Tool"
echo "======================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse arguments
DRY_RUN=true
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --delete)
            DRY_RUN=false
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --delete     Actually delete orphaned metadata (default is dry run)"
            echo "  --verbose    Show detailed information"
            echo "  --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}Running in DRY RUN mode. Use --delete to actually remove files.${NC}"
else
    echo -e "${RED}⚠️  DELETE MODE: Files will be permanently removed!${NC}"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

echo ""

# Directories to check for content
CONTENT_DIRS=(
    "../../content/inbox"
    "../../storage"
    "../../content/voice"
    "../../content/how-to"
    "../../content/gtm"
)

# Counters
total_metadata=0
orphaned=0
deleted=0

echo "Scanning for orphaned metadata..."
echo "---------------------------------"

# Function to check if content exists
content_exists() {
    local content_id=$1
    
    for dir in "${CONTENT_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            # Look for any file starting with the content ID (excluding .json)
            if find "$dir" -name "${content_id}*" ! -name "*.json" -type f 2>/dev/null | grep -q .; then
                return 0
            fi
        fi
    done
    
    return 1
}

# Find all metadata files
while IFS= read -r -d '' metadata_file; do
    ((total_metadata++))
    
    filename=$(basename "$metadata_file")
    content_id="${filename%.json}"
    
    if [ "$VERBOSE" = true ]; then
        echo -n "Checking $content_id... "
    fi
    
    if ! content_exists "$content_id"; then
        ((orphaned++))
        
        if [ "$VERBOSE" = true ]; then
            echo -e "${RED}ORPHANED${NC}"
        else
            echo -e "${RED}Orphaned:${NC} $metadata_file"
        fi
        
        # Show metadata details if verbose
        if [ "$VERBOSE" = true ]; then
            # Extract key info from metadata
            created=$(jq -r '.created_at // "unknown"' "$metadata_file" 2>/dev/null)
            status=$(jq -r '.status // "unknown"' "$metadata_file" 2>/dev/null)
            title=$(jq -r '.title // .content.title // "no title"' "$metadata_file" 2>/dev/null)
            
            echo "  Created: $created"
            echo "  Status: $status"
            echo "  Title: $title"
        fi
        
        # Delete if not dry run
        if [ "$DRY_RUN" = false ]; then
            rm "$metadata_file"
            ((deleted++))
            echo -e "  ${GREEN}✓ Deleted${NC}"
        fi
    else
        if [ "$VERBOSE" = true ]; then
            echo -e "${GREEN}OK${NC}"
        fi
    fi
done < <(find ../../metadata -name "content-*.json" -type f -print0 2>/dev/null)

echo ""
echo "Summary"
echo "-------"
echo "Total metadata files: $total_metadata"
echo -e "Orphaned metadata: ${YELLOW}$orphaned${NC}"

if [ "$DRY_RUN" = false ]; then
    echo -e "Deleted: ${GREEN}$deleted${NC}"
else
    echo -e "${BLUE}To delete these files, run with --delete flag${NC}"
fi