#!/bin/bash

# Content Organizer Script
# Helps move content from workspace (content/) to archive (storage/)
# Updates metadata to reflect new locations

set -e

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Define directories
CONTENT_DIR="$PROJECT_ROOT/content"
STORAGE_DIR="$PROJECT_ROOT/storage"
METADATA_DIR="$PROJECT_ROOT/metadata"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parse arguments
DRY_RUN=false
AUTO_MOVE=false
PATTERN=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --auto)
            AUTO_MOVE=true
            shift
            ;;
        --pattern)
            PATTERN="$2"
            shift 2
            ;;
        *)
            echo "Usage: $0 [--dry-run] [--auto] [--pattern <pattern>]"
            echo "  --dry-run    Show what would be moved without actually moving"
            echo "  --auto       Move files automatically without prompting"
            echo "  --pattern    Only process files matching pattern (e.g., '*.pdf')"
            exit 1
            ;;
    esac
done

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}🔍 DRY RUN MODE - No files will be moved${NC}"
fi

echo "📦 Content Organizer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to determine storage type based on file extension
get_storage_type() {
    local file="$1"
    local filename=$(basename "$file")
    
    case "${filename,,}" in
        *.txt|*.md|*.markdown|*.rtf|*.tex|*.log) echo "text" ;;
        *.pdf|*.doc|*.docx|*.odt|*.pages|*.epub) echo "documents" ;;
        *.csv|*.xls|*.xlsx|*.ods|*.numbers) echo "spreadsheets" ;;
        *.ppt|*.pptx|*.odp|*.key) echo "presentations" ;;
        *.js|*.ts|*.jsx|*.tsx|*.py|*.java|*.cpp|*.html|*.css|*.json|*.xml|*.yaml|*.sh) echo "code" ;;
        *.jpg|*.jpeg|*.png|*.gif|*.webp|*.svg|*.bmp|*.ico|*.tiff|*.heic) echo "images" ;;
        *.mp4|*.mov|*.avi|*.mkv|*.webm|*.m4v|*.wmv|*.flv|*.3gp|*.mpg) echo "video" ;;
        *.mp3|*.wav|*.m4a|*.aac|*.ogg|*.flac|*.wma|*.opus) echo "audio" ;;
        *.zip|*.tar|*.gz|*.rar|*.7z|*.bz2) echo "archives" ;;
        *.fig|*.sketch|*.xd|*.ai|*.psd|*.indd) echo "design" ;;
        *.eml|*.msg|*.mbox) echo "email" ;;
        *.html|*.htm|*.mhtml|*.webarchive) echo "web" ;;
        *.json|*.jsonl|*.xml|*.sql) echo "data" ;;
        *) echo "misc" ;;
    esac
}

# Function to find metadata for a file
find_metadata_for_file() {
    local file_path="$1"
    local file_hash=$(shasum -a 256 "$file_path" 2>/dev/null | cut -d' ' -f1)
    
    if [ -z "$file_hash" ]; then
        return 1
    fi
    
    # Search for metadata containing this hash
    grep -l "sha256-$file_hash" "$METADATA_DIR"/*.json 2>/dev/null | head -1
}

# Function to update metadata with new location
update_metadata_location() {
    local metadata_file="$1"
    local new_path="$2"
    
    if [ ! -f "$metadata_file" ]; then
        return 1
    fi
    
    # Create temporary file with updated location
    local temp_file=$(mktemp)
    
    jq --arg path "$new_path" '
        .location.final_path = $path |
        .storage.path = $path |
        .updated_at = (now | strftime("%Y-%m-%dT%H:%M:%S.%3NZ"))
    ' "$metadata_file" > "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$metadata_file"
    
    return 0
}

# Counter
TOTAL_PROCESSED=0
MOVED_COUNT=0
SKIPPED_COUNT=0
ERROR_COUNT=0

# Find content files to organize
echo -e "${CYAN}Scanning content directory...${NC}"
echo ""

# Build find command based on pattern
FIND_CMD="find \"$CONTENT_DIR\" -type f ! -name \"*.json\" ! -path \"*/.*\" ! -name \"README.md\""
if [ -n "$PATTERN" ]; then
    FIND_CMD="$FIND_CMD -name \"$PATTERN\""
fi

# Process each file
while IFS= read -r -d '' file; do
    if [ -f "$file" ]; then
        ((TOTAL_PROCESSED++))
        
        filename=$(basename "$file")
        relative_path="${file#$PROJECT_ROOT/}"
        storage_type=$(get_storage_type "$file")
        
        # Skip if it's already a README or similar
        if [[ "$filename" =~ ^(README|LICENSE|CONTRIBUTING) ]]; then
            ((SKIPPED_COUNT++))
            continue
        fi
        
        # Determine destination
        dest_dir="$STORAGE_DIR/$storage_type"
        dest_file="$dest_dir/$filename"
        
        echo -e "${BLUE}File:${NC} $relative_path"
        echo -e "  Type: $storage_type"
        echo -e "  Destination: storage/$storage_type/$filename"
        
        # Check if file already exists at destination
        if [ -f "$dest_file" ]; then
            echo -e "  ${YELLOW}⚠️  File already exists at destination${NC}"
            ((SKIPPED_COUNT++))
            echo ""
            continue
        fi
        
        # Find metadata
        metadata_file=$(find_metadata_for_file "$file")
        if [ -z "$metadata_file" ]; then
            echo -e "  ${YELLOW}⚠️  No metadata found - generate metadata first${NC}"
            ((SKIPPED_COUNT++))
            echo ""
            continue
        fi
        
        # Prompt for action (unless auto mode)
        if [ "$AUTO_MOVE" = false ] && [ "$DRY_RUN" = false ]; then
            echo -n "  Move this file? [y/N/q] "
            read -r response
            case "$response" in
                [Yy])
                    # Continue to move
                    ;;
                [Qq])
                    echo "Quitting..."
                    break
                    ;;
                *)
                    ((SKIPPED_COUNT++))
                    echo ""
                    continue
                    ;;
            esac
        fi
        
        # Execute move (unless dry run)
        if [ "$DRY_RUN" = false ]; then
            # Create destination directory if needed
            mkdir -p "$dest_dir"
            
            # Move file
            if mv "$file" "$dest_file"; then
                echo -e "  ${GREEN}✓ Moved successfully${NC}"
                ((MOVED_COUNT++))
                
                # Update metadata
                new_relative_path="storage/$storage_type/$filename"
                if update_metadata_location "$metadata_file" "$new_relative_path"; then
                    echo -e "  ${GREEN}✓ Updated metadata${NC}"
                else
                    echo -e "  ${RED}✗ Failed to update metadata${NC}"
                    ((ERROR_COUNT++))
                fi
            else
                echo -e "  ${RED}✗ Failed to move file${NC}"
                ((ERROR_COUNT++))
            fi
        else
            echo -e "  ${CYAN}[DRY RUN] Would move file${NC}"
            ((MOVED_COUNT++))
        fi
        
        echo ""
    fi
done < <(eval "$FIND_CMD -print0")

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "📊 Organization Summary"
echo ""
echo "  Total files processed: $TOTAL_PROCESSED"
if [ "$DRY_RUN" = true ]; then
    echo -e "  ${CYAN}Would move: $MOVED_COUNT${NC}"
else
    echo -e "  ${GREEN}Moved: $MOVED_COUNT${NC}"
fi
echo -e "  ${YELLOW}Skipped: $SKIPPED_COUNT${NC}"
if [ $ERROR_COUNT -gt 0 ]; then
    echo -e "  ${RED}Errors: $ERROR_COUNT${NC}"
fi

# Recommendations
if [ $SKIPPED_COUNT -gt 0 ]; then
    echo ""
    echo -e "${BLUE}💡 Tips:${NC}"
    echo "  - Files without metadata were skipped"
    echo "  - Run ./scripts/generate-missing-metadata.sh first"
    echo "  - Use --pattern to filter specific file types"
fi

# Cleanup check
if [ "$DRY_RUN" = false ] && [ $MOVED_COUNT -gt 0 ]; then
    echo ""
    echo -e "${GREEN}✨ Content organized successfully!${NC}"
    echo "  Run ./scripts/content-audit.sh to verify the new structure"
fi