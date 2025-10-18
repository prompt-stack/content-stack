#!/bin/bash

# Audit all metadata files in the project
# This script finds and validates all metadata JSON files

echo "🔍 Auditing all metadata files..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
total=0
valid=0
invalid=0

# Find all metadata files
metadata_files=$(find ../../metadata -name "*.json" -type f 2>/dev/null)

if [ -z "$metadata_files" ]; then
    echo "No metadata files found in metadata/ directory"
    exit 0
fi

# Use the CommonJS validator
validator="validate-metadata.cjs"

# Validate each file
for file in $metadata_files; do
    ((total++))
    echo -n "Checking $(basename $file)... "
    
    if node "$validator" "$file" &> /tmp/validation_output.txt; then
        echo -e "${GREEN}✅ VALID${NC}"
        ((valid++))
    else
        echo -e "${RED}❌ INVALID${NC}"
        ((invalid++))
        cat /tmp/validation_output.txt | sed 's/^/    /'
    fi
done

echo "================================"
echo "Summary:"
echo "  Total files: $total"
echo -e "  Valid: ${GREEN}$valid${NC}"
echo -e "  Invalid: ${RED}$invalid${NC}"

# Exit with error if any files are invalid
if [ $invalid -gt 0 ]; then
    exit 1
fi