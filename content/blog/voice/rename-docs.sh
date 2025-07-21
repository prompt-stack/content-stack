#!/bin/bash

# Prompt Stack Voice Docs Renaming Script
# This script renames documents to follow the new naming convention:
# [date]-[category]-[topic]-[type].md

# Navigate to the voice directory
cd "$(dirname "$0")"

echo "Starting document rename process..."
echo "================================"

# Create a backup directory with timestamp
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Function to rename a file
rename_file() {
    local old_name="$1"
    local new_name="$2"
    
    if [ -f "$old_name" ]; then
        # Create backup
        cp "$old_name" "$BACKUP_DIR/$old_name"
        
        # Rename the file
        mv "$old_name" "$new_name"
        echo "✓ Renamed: $old_name → $new_name"
    else
        echo "✗ File not found: $old_name"
    fi
}

# Rename each file according to the new convention
echo -e "\nRenaming files..."
echo "----------------"

rename_file "CS-FOR-NON-TECHNICAL.md" "2025-01-guide-cs-fundamentals-overview.md"
rename_file "chatIDE.md" "2025-01-concept-ide-as-creative-backend-proposal.md"
rename_file "content-engineers.md" "2025-01-vision-content-engineering-paradigm-overview.md"
rename_file "content-inbox-demo.md" "2025-01-demo-inbox-workflow-overview.md"
rename_file "content-intelligence.md" "2025-01-concept-ai-powered-content-ops-deep-dive.md"
rename_file "grammar-ops.md" "2025-01-concept-grammar-as-operations-proposal.md"
rename_file "llm-native-codebases.md" "2025-01-arch-llm-optimized-architecture-deep-dive.md"
rename_file "organic-content.md" "2025-01-concept-organic-content-creation-overview.md"
rename_file "prompt-stack-cloud.md" "2025-01-arch-cloud-deployment-strategy-reference.md"
rename_file "prompt-stack-conversation-summary.md" "2025-07-vision-product-strategy-overview.md"
rename_file "prompt-stack-technical-architecture.md" "2025-01-arch-system-design-reference.md"

echo -e "\n================================"
echo "Rename process complete!"
echo "Backup files saved in: $BACKUP_DIR"
echo ""
echo "New naming convention:"
echo "  [date]-[category]-[topic]-[type].md"
echo ""
echo "Categories: vision, arch, concept, demo, guide, spec"
echo "Types: overview, deep-dive, reference, proposal"
echo ""
echo "To restore original names, run:"
echo "  cp $BACKUP_DIR/* ."