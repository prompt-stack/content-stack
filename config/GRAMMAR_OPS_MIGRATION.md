# Grammar-Ops Config Migration Summary

## What Changed

The `/config` directory has been reorganized to follow the grammar-ops standard:

### Before
```
config/
├── *.config.ts        # All config files mixed together
├── *.md              # All docs mixed together
├── *.example.json    # Example files
└── tier-system/
```

### After
```
config/
├── schemas/          # Core configuration schemas (.config.ts files)
├── docs/            # Documentation (.md files)
├── examples/        # Example files (.example.json)
├── scripts/         # Config-related scripts
├── tier-system/     # Tier-specific configs (unchanged)
├── index.ts         # Central export point
└── README.md        # Directory overview
```

## Import Path Updates

All imports have been updated from:
```typescript
import { something } from '../../config/file.config';
```

To:
```typescript
import { something } from '../../config/schemas/file.config';
```

## Benefits

1. **Clear Organization**: Each subdirectory has a specific purpose
2. **Grammar-Ops Compliance**: Follows the established pattern
3. **Better Discoverability**: Easy to find schemas vs docs vs examples
4. **Central Export**: New `index.ts` for importing all configs
5. **Automated Updates**: Script to update import paths

## Using the New Structure

### Option 1: Direct imports (specific)
```typescript
import { metadataSchema } from '@/config/schemas/metadata-schema.config';
```

### Option 2: Central import (convenient)
```typescript
import { metadataSchema, categoriesConfig } from '@/config';
```

## Files Affected

The following files had their import paths updated:
- backend/services/MetadataService.ts
- backend/services/ContentInboxService.ts
- backend/routes/storage.ts
- backend/utils/detectFileType.ts
- backend/utils/createMetadata.ts
- src/features/content-inbox/config.ts

## Script for Future Updates

Use `/config/scripts/update-import-paths.sh` to update any new files that import from config.