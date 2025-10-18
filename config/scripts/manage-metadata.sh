#!/bin/bash

# Comprehensive metadata management tool
# Provides various metadata operations in one place

echo "📊 Metadata Management Tool"
echo "=========================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Show usage
show_help() {
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  audit           Run full metadata audit"
    echo "  cleanup         Find and remove orphaned metadata"
    echo "  migrate         Migrate metadata to new schema"
    echo "  delete <id>     Delete specific content and metadata"
    echo "  stats           Show metadata statistics"
    echo "  find <query>    Search metadata files"
    echo ""
    echo "Examples:"
    echo "  $0 audit"
    echo "  $0 cleanup --delete"
    echo "  $0 delete content-1753319664670-46u6y7"
    echo "  $0 find category:education"
}

# Check command
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

COMMAND=$1
shift

# Execute command
case $COMMAND in
    audit)
        echo "Running metadata audit..."
        ./audit-all-metadata.sh
        ;;
        
    cleanup)
        echo "Running metadata cleanup..."
        ./cleanup-metadata.sh "$@"
        ;;
        
    migrate)
        echo "Running schema migration..."
        ./migrate-metadata-schema.sh "$@"
        ;;
        
    delete)
        if [ $# -eq 0 ]; then
            echo -e "${RED}Error:${NC} Please specify content ID to delete"
            echo "Usage: $0 delete <content-id>"
            exit 1
        fi
        ./delete-content.sh "$@"
        ;;
        
    stats)
        echo "Metadata Statistics"
        echo "------------------"
        
        # Count files
        total=$(find ../../metadata -name "*.json" -type f 2>/dev/null | wc -l)
        echo "Total metadata files: $total"
        
        if command -v jq &> /dev/null; then
            # Status breakdown
            echo ""
            echo "Status breakdown:"
            raw=$(find ../../metadata -name "*.json" -exec jq -r 'select(.status == "raw") | .id' {} \; 2>/dev/null | wc -l)
            enriched=$(find ../../metadata -name "*.json" -exec jq -r 'select(.status == "enriched") | .id' {} \; 2>/dev/null | wc -l)
            other=$(find ../../metadata -name "*.json" -exec jq -r 'select(.status != "raw" and .status != "enriched") | .id' {} \; 2>/dev/null | wc -l)
            
            echo "  Raw: $raw"
            echo "  Enriched: $enriched"
            if [ $other -gt 0 ]; then
                echo -e "  ${YELLOW}Other (needs migration): $other${NC}"
            fi
            
            # Category breakdown
            echo ""
            echo "Category breakdown:"
            find ../../metadata -name "*.json" -exec jq -r '.llm_analysis.category // "uncategorized"' {} \; 2>/dev/null | \
                sort | uniq -c | sort -rn | while read count cat; do
                    printf "  %-20s %s\n" "$cat" "$count"
                done
                
            # Source breakdown
            echo ""
            echo "Source method breakdown:"
            find ../../metadata -name "*.json" -exec jq -r '.source.method // "unknown"' {} \; 2>/dev/null | \
                sort | uniq -c | sort -rn | while read count method; do
                    printf "  %-20s %s\n" "$method" "$count"
                done
        else
            echo -e "${YELLOW}Install jq for detailed statistics${NC}"
        fi
        ;;
        
    find)
        if [ $# -eq 0 ]; then
            echo -e "${RED}Error:${NC} Please specify search query"
            echo "Usage: $0 find <query>"
            echo "Examples:"
            echo "  $0 find category:education"
            echo "  $0 find status:enriched"
            echo "  $0 find title:data"
            exit 1
        fi
        
        QUERY=$1
        echo "Searching for: $QUERY"
        echo "-------------------"
        
        # Parse query
        if [[ "$QUERY" =~ ^([^:]+):(.+)$ ]]; then
            FIELD="${BASH_REMATCH[1]}"
            VALUE="${BASH_REMATCH[2]}"
            
            case $FIELD in
                category)
                    find ../../metadata -name "*.json" -exec sh -c \
                        'jq -r "select(.llm_analysis.category == \"'$VALUE'\") | .id" "$1" 2>/dev/null && echo "$1"' _ {} \; | \
                        grep -B1 "^/" | grep "^/" | while read f; do
                            echo -e "${GREEN}✓${NC} $(basename "$f")"
                            jq -r '"  Title: " + (.title // "none")' "$f" 2>/dev/null
                        done
                    ;;
                status)
                    find ../../metadata -name "*.json" -exec sh -c \
                        'jq -r "select(.status == \"'$VALUE'\") | .id" "$1" 2>/dev/null && echo "$1"' _ {} \; | \
                        grep -B1 "^/" | grep "^/" | while read f; do
                            echo -e "${GREEN}✓${NC} $(basename "$f")"
                        done
                    ;;
                title|tag)
                    grep -l "$VALUE" ../../metadata/*.json 2>/dev/null | while read f; do
                        echo -e "${GREEN}✓${NC} $(basename "$f")"
                        jq -r '"  Title: " + (.title // "none")' "$f" 2>/dev/null
                    done
                    ;;
                *)
                    echo -e "${RED}Unknown field:${NC} $FIELD"
                    echo "Supported fields: category, status, title, tag"
                    ;;
            esac
        else
            # Simple text search
            grep -l "$QUERY" ../../metadata/*.json 2>/dev/null | while read f; do
                echo -e "${GREEN}✓${NC} $(basename "$f")"
            done
        fi
        ;;
        
    help|--help|-h)
        show_help
        ;;
        
    *)
        echo -e "${RED}Unknown command:${NC} $COMMAND"
        echo ""
        show_help
        exit 1
        ;;
esac