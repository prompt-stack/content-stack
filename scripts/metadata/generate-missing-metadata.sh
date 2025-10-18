#!/bin/bash

# Script to generate metadata for all content files that don't have it yet
# Usage: ./generate-missing-metadata.sh

set -e

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
METADATA_DIR="$PROJECT_ROOT/metadata"
GENERATE_SCRIPT="$SCRIPT_DIR/generate-metadata.sh"

# Ensure metadata directory exists
mkdir -p "$METADATA_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🔍 Scanning for content files without metadata..."

# Define all directories that receive content
CONTENT_DIRS=(
    "$PROJECT_ROOT/content"  # Creative workspace/canvas
    "$PROJECT_ROOT/storage"  # Organized archive by type
    # Note: We don't scan metadata/ as it contains the receipts, not content
)

# Counter for statistics
TOTAL_FILES=0
MISSING_METADATA=0
GENERATED=0
FAILED=0

# Function to check if metadata exists for a file
has_metadata() {
    local file_path="$1"
    local file_hash=$(shasum -a 256 "$file_path" | cut -d' ' -f1)
    
    # Check if any metadata file contains this hash
    if grep -l "sha256-$file_hash" "$METADATA_DIR"/*.json 2>/dev/null >/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to process a single file
process_file() {
    local file_path="$1"
    local relative_path="${file_path#$PROJECT_ROOT/}"
    
    ((TOTAL_FILES++))
    
    if ! has_metadata "$file_path"; then
        ((MISSING_METADATA++))
        echo -e "${YELLOW}Missing metadata:${NC} $relative_path"
        
        # Generate metadata
        if "$GENERATE_SCRIPT" "$file_path" 2>/dev/null; then
            ((GENERATED++))
            echo -e "  ${GREEN}✓ Generated metadata${NC}"
        else
            ((FAILED++))
            echo -e "  ${RED}✗ Failed to generate metadata${NC}"
        fi
    fi
}

# Scan all content directories
for dir in "${CONTENT_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "📁 Scanning: $dir"
        
        # Find all files (excluding hidden files and directories)
        while IFS= read -r -d '' file; do
            # Skip directories and hidden files
            if [ -f "$file" ] && [[ ! $(basename "$file") =~ ^\. ]]; then
                # Skip metadata files themselves
                if [[ ! "$file" =~ \.json$ ]] || [[ ! "$file" =~ "$METADATA_DIR" ]]; then
                    process_file "$file"
                fi
            fi
        done < <(find "$dir" -type f -print0 2>/dev/null)
    fi
done

# Summary
echo ""
echo "📊 Summary:"
echo "  Total files scanned: $TOTAL_FILES"
echo "  Files without metadata: $MISSING_METADATA"
echo -e "  ${GREEN}Successfully generated: $GENERATED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "  ${RED}Failed to generate: $FAILED${NC}"
fi

# Verify metadata directory
METADATA_COUNT=$(find "$METADATA_DIR" -name "*.json" -type f | wc -l)
echo ""
echo "📚 Metadata directory now contains: $METADATA_COUNT files"

# Optional: List all metadata files
if [ "$1" == "--list" ]; then
    echo ""
    echo "📋 Metadata files:"
    ls -la "$METADATA_DIR"/*.json 2>/dev/null || echo "No metadata files found"
fi