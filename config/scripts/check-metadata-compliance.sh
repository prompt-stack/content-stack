#!/bin/bash

# Check metadata compliance across the project
# Ensures all content has corresponding metadata files

echo "📋 Checking metadata compliance..."
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Directories to check
CONTENT_DIRS=(
    "../../content/inbox"
    "../../storage"
)

# Counters
content_files=0
missing_metadata=0
orphaned_metadata=0

echo "1. Checking for content without metadata..."
echo "-------------------------------------------"

# Check each content directory
for dir in "${CONTENT_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        continue
    fi
    
    # Find all content files (excluding .json metadata)
    while IFS= read -r -d '' file; do
        ((content_files++))
        
        # Extract content ID from filename
        filename=$(basename "$file")
        if [[ $filename =~ content-[0-9]+-[a-z0-9]+ ]]; then
            content_id="${BASH_REMATCH[0]}"
            metadata_file="../../metadata/${content_id}.json"
            
            if [ ! -f "$metadata_file" ]; then
                echo -e "${RED}❌ Missing metadata:${NC} $file"
                echo "   Expected: $metadata_file"
                ((missing_metadata++))
            fi
        fi
    done < <(find "$dir" -type f ! -name "*.json" -print0 2>/dev/null)
done

echo ""
echo "2. Checking for orphaned metadata..."
echo "------------------------------------"

# Check for metadata files without corresponding content
while IFS= read -r -d '' metadata_file; do
    filename=$(basename "$metadata_file" .json)
    found=false
    
    # Check if content exists in any location
    for dir in "${CONTENT_DIRS[@]}"; do
        if find "$dir" -name "${filename}*" ! -name "*.json" 2>/dev/null | grep -q .; then
            found=true
            break
        fi
    done
    
    if [ "$found" = false ]; then
        echo -e "${YELLOW}⚠️  Orphaned metadata:${NC} $metadata_file"
        ((orphaned_metadata++))
    fi
done < <(find ../../metadata -name "content-*.json" -print0 2>/dev/null)

echo ""
echo "3. Checking metadata field compliance..."
echo "----------------------------------------"

# Run validation on all metadata files
if [ -f "validate-metadata.ts" ]; then
    invalid_count=0
    while IFS= read -r -d '' metadata_file; do
        if ! ts-node validate-metadata.ts "$metadata_file" &> /dev/null; then
            ((invalid_count++))
        fi
    done < <(find ../../metadata -name "*.json" -print0 2>/dev/null)
    
    if [ $invalid_count -gt 0 ]; then
        echo -e "${RED}❌ $invalid_count metadata files have validation errors${NC}"
        echo "   Run ./audit-all-metadata.sh for details"
    else
        echo -e "${GREEN}✅ All metadata files are valid${NC}"
    fi
fi

echo ""
echo "=================================="
echo "Summary:"
echo "  Content files checked: $content_files"
echo -e "  Missing metadata: ${RED}$missing_metadata${NC}"
echo -e "  Orphaned metadata: ${YELLOW}$orphaned_metadata${NC}"

# Exit with error if issues found
if [ $missing_metadata -gt 0 ] || [ $orphaned_metadata -gt 0 ]; then
    exit 1
fi