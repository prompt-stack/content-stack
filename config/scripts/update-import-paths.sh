#!/bin/bash

# Update import paths after config reorganization
# This script updates imports from config/ to config/schemas/

echo "Updating import paths for config reorganization..."

# Files that need updating
files=(
  "backend/services/MetadataService.ts"
  "backend/services/ContentInboxService.ts"
  "backend/routes/storage.ts"
  "backend/utils/detectFileType.ts"
  "backend/utils/createMetadata.ts"
  "src/features/content-inbox/config.ts"
)

# Update paths
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Update imports to add schemas/ prefix
    sed -i '' 's|config/paths\.config|config/schemas/paths.config|g' "$file"
    sed -i '' 's|config/content-types\.config|config/schemas/content-types.config|g' "$file"
    sed -i '' 's|config/categories\.config|config/schemas/categories.config|g' "$file"
    sed -i '' 's|config/metadata-schema\.config|config/schemas/metadata-schema.config|g' "$file"
    sed -i '' 's|config/file-types\.config|config/schemas/file-types.config|g' "$file"
    sed -i '' 's|config/pipeline\.config|config/schemas/pipeline.config|g' "$file"
  fi
done

echo "Import paths updated successfully!"