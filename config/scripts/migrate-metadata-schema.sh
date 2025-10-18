#!/bin/bash

# Migrate existing metadata to new schema format
# Fixes: status values, adds missing fields

echo "🔄 Metadata Schema Migration"
echo "==========================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Parse arguments
DRY_RUN=true
BACKUP=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --apply)
            DRY_RUN=false
            shift
            ;;
        --no-backup)
            BACKUP=false
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --apply      Apply migrations (default is dry run)"
            echo "  --no-backup  Don't create backup files"
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
    echo -e "${YELLOW}Running in DRY RUN mode. Use --apply to make changes.${NC}"
else
    echo -e "${RED}⚠️  APPLY MODE: Files will be modified!${NC}"
    if [ "$BACKUP" = true ]; then
        echo "Backups will be created with .backup suffix"
    fi
fi

echo ""

# Check for jq
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required for JSON processing${NC}"
    echo "Install with: brew install jq"
    exit 1
fi

# Counters
total=0
migrated=0
errors=0

# Status mapping function (for macOS compatibility)
get_new_status() {
    case "$1" in
        "inbox") echo "raw" ;;
        "stored") echo "raw" ;;
        "processed") echo "enriched" ;;
        "archived") echo "enriched" ;;
        *) echo "" ;;
    esac
}

echo "Migrating metadata files..."
echo "--------------------------"

# Process each metadata file
while IFS= read -r -d '' metadata_file; do
    ((total++))
    
    filename=$(basename "$metadata_file")
    echo -n "Processing $filename... "
    
    # Read current metadata
    if ! metadata=$(jq '.' "$metadata_file" 2>/dev/null); then
        echo -e "${RED}ERROR: Invalid JSON${NC}"
        ((errors++))
        continue
    fi
    
    # Track if changes needed
    needs_migration=false
    
    # Check and fix status
    current_status=$(echo "$metadata" | jq -r '.status // "missing"')
    new_status=$(get_new_status "$current_status")
    
    if [ -n "$new_status" ]; then
        metadata=$(echo "$metadata" | jq --arg status "$new_status" '.status = $status')
        needs_migration=true
        echo -n "status:$current_status→$new_status "
    elif [ "$current_status" = "missing" ]; then
        metadata=$(echo "$metadata" | jq '.status = "raw"')
        needs_migration=true
        echo -n "status:+raw "
    fi
    
    # Add missing title field
    if ! echo "$metadata" | jq -e '.title' &>/dev/null; then
        # Try to get title from various sources
        title=$(echo "$metadata" | jq -r '.content.title // .llm_analysis.title // .id // "untitled"')
        metadata=$(echo "$metadata" | jq --arg title "$title" '.title = $title')
        needs_migration=true
        echo -n "title:+ "
    fi
    
    # Add missing filename field
    if ! echo "$metadata" | jq -e '.filename' &>/dev/null; then
        # Extract from id or storage path
        id=$(echo "$metadata" | jq -r '.id // ""')
        storage_path=$(echo "$metadata" | jq -r '.storage.path // ""')
        
        if [ -n "$storage_path" ]; then
            filename_value=$(basename "$storage_path")
        else
            filename_value="${id}.json"
        fi
        
        metadata=$(echo "$metadata" | jq --arg filename "$filename_value" '.filename = $filename')
        needs_migration=true
        echo -n "filename:+ "
    fi
    
    # Add missing user_tags field
    if ! echo "$metadata" | jq -e '.user_tags' &>/dev/null; then
        # Check if old 'tags' field exists
        if echo "$metadata" | jq -e '.tags' &>/dev/null; then
            metadata=$(echo "$metadata" | jq '.user_tags = .tags | del(.tags)')
            echo -n "tags→user_tags "
        else
            metadata=$(echo "$metadata" | jq '.user_tags = []')
            echo -n "user_tags:+ "
        fi
        needs_migration=true
    fi
    
    # Apply changes if needed
    if [ "$needs_migration" = true ]; then
        if [ "$DRY_RUN" = false ]; then
            # Backup if requested
            if [ "$BACKUP" = true ]; then
                cp "$metadata_file" "${metadata_file}.backup"
            fi
            
            # Write updated metadata
            echo "$metadata" | jq '.' > "$metadata_file"
            echo -e "${GREEN}✓ MIGRATED${NC}"
        else
            echo -e "${YELLOW}[needs migration]${NC}"
        fi
        ((migrated++))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
done < <(find ../../metadata -name "content-*.json" -type f -print0 2>/dev/null)

echo ""
echo "Summary"
echo "-------"
echo "Total files: $total"
echo "Need migration: $migrated"
echo "Errors: $errors"

if [ "$DRY_RUN" = true ] && [ $migrated -gt 0 ]; then
    echo ""
    echo -e "${BLUE}To apply migrations, run with --apply flag${NC}"
fi