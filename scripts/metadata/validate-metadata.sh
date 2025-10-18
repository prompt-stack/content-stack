#!/bin/bash

# Script to validate metadata files and check consistency
# Usage: ./validate-metadata.sh [--fix]

set -e

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
METADATA_DIR="$PROJECT_ROOT/metadata"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
FIX_MODE=false
if [ "$1" == "--fix" ]; then
    FIX_MODE=true
    echo "🔧 Running in FIX mode - will attempt to repair issues"
fi

echo "🔍 Validating metadata files..."

# Counters
TOTAL=0
VALID=0
INVALID=0
ORPHANED=0
FIXED=0

# Required fields
REQUIRED_FIELDS=("id" "created_at" "updated_at" "status" "source" "content" "location" "tags" "storage")

# Function to validate JSON structure
validate_json() {
    local file="$1"
    if jq empty "$file" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to check required fields
check_required_fields() {
    local file="$1"
    local missing_fields=()
    
    for field in "${REQUIRED_FIELDS[@]}"; do
        if ! jq -e ".$field" "$file" >/dev/null 2>&1; then
            missing_fields+=("$field")
        fi
    done
    
    if [ ${#missing_fields[@]} -eq 0 ]; then
        return 0
    else
        echo "  Missing fields: ${missing_fields[*]}"
        return 1
    fi
}

# Function to check if referenced file exists
check_file_exists() {
    local metadata_file="$1"
    local storage_path=$(jq -r '.storage.path // .location.final_path // .location.inbox_path' "$metadata_file" 2>/dev/null)
    
    if [ -n "$storage_path" ] && [ "$storage_path" != "null" ]; then
        local full_path="$PROJECT_ROOT/$storage_path"
        if [ -f "$full_path" ]; then
            return 0
        else
            echo "  Referenced file not found: $storage_path"
            return 1
        fi
    else
        echo "  No valid storage path found"
        return 1
    fi
}

# Function to validate metadata values
validate_metadata_values() {
    local file="$1"
    local errors=()
    
    # Check status is valid
    local status=$(jq -r '.status' "$file" 2>/dev/null)
    if [[ ! "$status" =~ ^(inbox|stored|processed|archived)$ ]]; then
        errors+=("Invalid status: $status")
    fi
    
    # Check source method is valid
    local method=$(jq -r '.source.method' "$file" 2>/dev/null)
    if [[ ! "$method" =~ ^(paste|upload|url|drop|manual|api)$ ]]; then
        errors+=("Invalid source method: $method")
    fi
    
    # Check content type is valid
    local content_type=$(jq -r '.content.type' "$file" 2>/dev/null)
    if [[ ! "$content_type" =~ ^(text|document|spreadsheet|presentation|code|image|video|audio|archive|design|email|web|data)$ ]]; then
        errors+=("Invalid content type: $content_type")
    fi
    
    if [ ${#errors[@]} -eq 0 ]; then
        return 0
    else
        for error in "${errors[@]}"; do
            echo "  $error"
        done
        return 1
    fi
}

# Process each metadata file
for metadata_file in "$METADATA_DIR"/*.json; do
    if [ -f "$metadata_file" ]; then
        ((TOTAL++))
        filename=$(basename "$metadata_file")
        
        echo -e "\n${BLUE}Checking:${NC} $filename"
        
        # Track if this file has issues
        has_issues=false
        
        # Validate JSON structure
        if ! validate_json "$metadata_file"; then
            echo -e "  ${RED}✗ Invalid JSON structure${NC}"
            ((INVALID++))
            has_issues=true
            continue
        fi
        
        # Check required fields
        if ! check_required_fields "$metadata_file"; then
            echo -e "  ${RED}✗ Missing required fields${NC}"
            ((INVALID++))
            has_issues=true
            
            if [ "$FIX_MODE" = true ]; then
                echo "  🔧 Cannot auto-fix missing fields - manual intervention required"
            fi
            continue
        fi
        
        # Validate metadata values
        if ! validate_metadata_values "$metadata_file"; then
            echo -e "  ${YELLOW}⚠ Invalid metadata values${NC}"
            has_issues=true
        fi
        
        # Check if referenced file exists
        if ! check_file_exists "$metadata_file"; then
            echo -e "  ${YELLOW}⚠ Orphaned metadata (file doesn't exist)${NC}"
            ((ORPHANED++))
            has_issues=true
            
            if [ "$FIX_MODE" = true ]; then
                echo -n "  🔧 Remove orphaned metadata? [y/N] "
                read -r response
                if [[ "$response" =~ ^[Yy]$ ]]; then
                    rm "$metadata_file"
                    echo -e "  ${GREEN}✓ Removed${NC}"
                    ((FIXED++))
                fi
            fi
        fi
        
        # If no issues, mark as valid
        if [ "$has_issues" = false ]; then
            echo -e "  ${GREEN}✓ Valid${NC}"
            ((VALID++))
        fi
    fi
done

# Summary
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "📊 Validation Summary:"
echo "  Total metadata files: $TOTAL"
echo -e "  ${GREEN}Valid: $VALID${NC}"
echo -e "  ${RED}Invalid: $INVALID${NC}"
echo -e "  ${YELLOW}Orphaned: $ORPHANED${NC}"

if [ "$FIX_MODE" = true ] && [ $FIXED -gt 0 ]; then
    echo -e "  ${BLUE}Fixed: $FIXED${NC}"
fi

# Additional checks
echo -e "\n📁 Content Coverage:"

# Check content directories
for dir in "$PROJECT_ROOT/content" "$PROJECT_ROOT/storage"; do
    if [ -d "$dir" ]; then
        dir_name=$(basename "$dir")
        total_files=$(find "$dir" -type f ! -name "*.json" ! -path "*/.*" 2>/dev/null | wc -l)
        echo "  $dir_name/: $total_files files"
    fi
done

# Exit with appropriate code
if [ $INVALID -gt 0 ]; then
    exit 1
else
    exit 0
fi