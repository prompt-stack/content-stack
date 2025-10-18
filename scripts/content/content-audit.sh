#!/bin/bash

# Comprehensive content audit script
# Checks bidirectional integrity between content, metadata, and storage

set -e

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Define our three primary content arenas
CONTENT_DIR="$PROJECT_ROOT/content"
METADATA_DIR="$PROJECT_ROOT/metadata"
STORAGE_DIR="$PROJECT_ROOT/storage"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo "🔍 Content Management System Audit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Counters
CONTENT_FILES=0
CONTENT_WITH_METADATA=0
CONTENT_WITHOUT_METADATA=0
METADATA_FILES=0
METADATA_WITH_FILE=0
METADATA_ORPHANED=0
STORAGE_FILES=0

# Arrays to track issues
declare -a MISSING_METADATA
declare -a ORPHANED_METADATA
declare -a MISLOCATED_FILES

# Function to find metadata for a file by hash
find_metadata_by_hash() {
    local file_path="$1"
    local file_hash=$(shasum -a 256 "$file_path" 2>/dev/null | cut -d' ' -f1)
    
    if [ -z "$file_hash" ]; then
        return 1
    fi
    
    # Search for metadata containing this hash
    grep -l "sha256-$file_hash" "$METADATA_DIR"/*.json 2>/dev/null | head -1
}

# Function to check if a path exists in any of our directories
file_exists_anywhere() {
    local path="$1"
    
    # Check absolute path
    if [ -f "$path" ]; then
        echo "$path"
        return 0
    fi
    
    # Check relative to project root
    if [ -f "$PROJECT_ROOT/$path" ]; then
        echo "$PROJECT_ROOT/$path"
        return 0
    fi
    
    return 1
}

# Phase 1: Audit content directory
echo -e "${CYAN}📁 Phase 1: Auditing Content Directory${NC}"
echo "  Scanning for files without metadata..."
echo ""

if [ -d "$CONTENT_DIR" ]; then
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            ((CONTENT_FILES++))
            relative_path="${file#$PROJECT_ROOT/}"
            
            # Check if metadata exists
            metadata_file=$(find_metadata_by_hash "$file")
            
            if [ -n "$metadata_file" ]; then
                ((CONTENT_WITH_METADATA++))
                echo -e "  ${GREEN}✓${NC} $relative_path"
                echo -e "    └─ Metadata: $(basename "$metadata_file")"
            else
                ((CONTENT_WITHOUT_METADATA++))
                MISSING_METADATA+=("$relative_path")
                echo -e "  ${RED}✗${NC} $relative_path"
                echo -e "    └─ ${YELLOW}No metadata found${NC}"
            fi
        fi
    done < <(find "$CONTENT_DIR" -type f ! -name "*.json" ! -path "*/.*" ! -name "README.md" -print0 2>/dev/null)
fi

# Phase 2: Audit metadata directory
echo ""
echo -e "${CYAN}📋 Phase 2: Auditing Metadata Directory${NC}"
echo "  Checking if all metadata points to existing files..."
echo ""

if [ -d "$METADATA_DIR" ]; then
    for metadata_file in "$METADATA_DIR"/*.json; do
        if [ -f "$metadata_file" ]; then
            ((METADATA_FILES++))
            metadata_name=$(basename "$metadata_file")
            
            # Extract file paths from metadata
            final_path=$(jq -r '.location.final_path // empty' "$metadata_file" 2>/dev/null)
            inbox_path=$(jq -r '.location.inbox_path // empty' "$metadata_file" 2>/dev/null)
            storage_path=$(jq -r '.storage.path // empty' "$metadata_file" 2>/dev/null)
            
            # Check if any referenced file exists
            file_found=false
            actual_location=""
            
            for path in "$final_path" "$inbox_path" "$storage_path"; do
                if [ -n "$path" ] && [ "$path" != "null" ]; then
                    if actual_location=$(file_exists_anywhere "$path"); then
                        file_found=true
                        break
                    fi
                fi
            done
            
            if [ "$file_found" = true ]; then
                ((METADATA_WITH_FILE++))
                echo -e "  ${GREEN}✓${NC} $metadata_name"
                echo -e "    └─ File: ${actual_location#$PROJECT_ROOT/}"
            else
                ((METADATA_ORPHANED++))
                ORPHANED_METADATA+=("$metadata_name")
                echo -e "  ${RED}✗${NC} $metadata_name"
                echo -e "    └─ ${YELLOW}File not found${NC}"
                if [ -n "$storage_path" ] && [ "$storage_path" != "null" ]; then
                    echo -e "    └─ Expected: $storage_path"
                fi
            fi
        fi
    done
fi

# Phase 3: Audit storage directory
echo ""
echo -e "${CYAN}📦 Phase 3: Auditing Storage Directory${NC}"
echo "  Counting organized files by type..."
echo ""

if [ -d "$STORAGE_DIR" ]; then
    for type_dir in "$STORAGE_DIR"/*; do
        if [ -d "$type_dir" ]; then
            type_name=$(basename "$type_dir")
            count=$(find "$type_dir" -type f ! -name "*.json" 2>/dev/null | wc -l)
            ((STORAGE_FILES += count))
            if [ $count -gt 0 ]; then
                echo -e "  ${BLUE}$type_name/${NC}: $count files"
            fi
        fi
    done
fi

# Summary Report
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "📊 Audit Summary"
echo ""

# Content Summary
echo -e "${CYAN}Content Directory:${NC}"
echo "  Total files: $CONTENT_FILES"
echo -e "  ${GREEN}With metadata: $CONTENT_WITH_METADATA${NC}"
echo -e "  ${RED}Without metadata: $CONTENT_WITHOUT_METADATA${NC}"

# Metadata Summary
echo ""
echo -e "${CYAN}Metadata Directory:${NC}"
echo "  Total metadata files: $METADATA_FILES"
echo -e "  ${GREEN}With existing files: $METADATA_WITH_FILE${NC}"
echo -e "  ${RED}Orphaned (no file): $METADATA_ORPHANED${NC}"

# Storage Summary
echo ""
echo -e "${CYAN}Storage Directory:${NC}"
echo "  Total organized files: $STORAGE_FILES"

# Issues Report
if [ ${#MISSING_METADATA[@]} -gt 0 ] || [ ${#ORPHANED_METADATA[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Issues Found${NC}"
    
    if [ ${#MISSING_METADATA[@]} -gt 0 ]; then
        echo ""
        echo "Files without metadata:"
        for file in "${MISSING_METADATA[@]}"; do
            echo "  - $file"
        done
    fi
    
    if [ ${#ORPHANED_METADATA[@]} -gt 0 ]; then
        echo ""
        echo "Orphaned metadata (file missing):"
        for metadata in "${ORPHANED_METADATA[@]}"; do
            echo "  - $metadata"
        done
    fi
fi

# Recommendations
echo ""
echo -e "${BLUE}💡 Recommendations:${NC}"

if [ $CONTENT_WITHOUT_METADATA -gt 0 ]; then
    echo "  1. Run ./scripts/generate-missing-metadata.sh to create metadata for files"
fi

if [ $METADATA_ORPHANED -gt 0 ]; then
    echo "  2. Run ./scripts/validate-metadata.sh --fix to clean orphaned metadata"
fi

echo "  3. Consider moving processed content from content/ to storage/"
echo ""

# Export report option
if [ "$1" == "--export" ]; then
    REPORT_FILE="$PROJECT_ROOT/content-audit-$(date +%Y%m%d-%H%M%S).json"
    cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "summary": {
    "content": {
      "total": $CONTENT_FILES,
      "with_metadata": $CONTENT_WITH_METADATA,
      "without_metadata": $CONTENT_WITHOUT_METADATA
    },
    "metadata": {
      "total": $METADATA_FILES,
      "with_file": $METADATA_WITH_FILE,
      "orphaned": $METADATA_ORPHANED
    },
    "storage": {
      "total": $STORAGE_FILES
    }
  },
  "issues": {
    "missing_metadata": $(printf '%s\n' "${MISSING_METADATA[@]}" | jq -R . | jq -s .),
    "orphaned_metadata": $(printf '%s\n' "${ORPHANED_METADATA[@]}" | jq -R . | jq -s .)
  }
}
EOF
    echo -e "${GREEN}Report exported to: $REPORT_FILE${NC}"
fi