# Configuration Directory

This directory contains all configuration files for the Content Stack system. All configs follow the grammar-ops conventions with TypeScript as the primary language.

## Directory Structure

```
config/
├── README.md                     # This file
├── ACCEPTED_FILE_TYPES.md       # Human-readable list of accepted files
├── categories.config.ts         # Content categories (tech, business, etc.)
├── content-types.config.ts      # Content type detection and AI mapping
├── file-types.config.ts         # File type definitions and rules
├── file-types.json              # JSON version for easy parsing
├── metadata-schema.config.ts    # Metadata structure and validation
├── paths.config.ts              # System paths and directories
├── pipeline.config.ts           # Content processing pipeline
└── tier-system/                 # User tier configurations
    └── features.js

```

## Configuration Files

### Core Configurations

#### `file-types.config.ts` / `file-types.json`
- **Purpose**: Defines all accepted file types
- **Contains**: Extensions, MIME types, size limits, AI models
- **Used by**: Upload handlers, content detection, inbox processing

#### `categories.config.ts`
- **Purpose**: Content categorization system
- **Contains**: Category definitions, icons, colors, keywords
- **Used by**: LLM analysis, content organization, UI display

#### `content-types.config.ts`
- **Purpose**: Maps file types to storage locations and AI processors
- **Contains**: Storage mappings, AI requirements, content detection
- **Used by**: ContentInboxService, file type detection

#### `metadata-schema.config.ts`
- **Purpose**: Defines metadata structure for all content
- **Contains**: Schema definition, validation, helper functions
- **Used by**: Metadata generation, content tracking

### System Configurations

#### `paths.config.ts`
- **Purpose**: Central directory structure configuration
- **Contains**: All system paths, helper functions
- **Critical**: Do not modify without updating dependent services

#### `pipeline.config.ts`
- **Purpose**: Content processing pipeline stages
- **Contains**: Pipeline flow, processing rules, async operations
- **Used by**: Backend services, processing queue

## Usage Examples

### Checking File Types
```typescript
import { getFileTypeCategory, canExtractText } from './file-types.config';

const category = getFileTypeCategory('document.pdf'); // 'document'
const extractable = canExtractText('image.jpg'); // false
```

### Working with Categories
```typescript
import { isValidCategory, getCategoryConfig } from './categories.config';

if (isValidCategory('tech')) {
  const config = getCategoryConfig('tech');
  console.log(config.icon); // '💻'
}
```

### Creating Metadata
```typescript
import { createDefaultMetadata, validateMetadata } from './metadata-schema.config';

const metadata = createDefaultMetadata('file.txt', 'text', 'upload');
const isValid = validateMetadata(metadata); // true
```

## Configuration Conventions

1. **File Naming**: Use `.config.ts` suffix for TypeScript configs
2. **Headers**: All config files must have grammar-ops metadata headers
3. **Types**: Export TypeScript types for all configurations
4. **Validation**: Include validation functions where applicable
5. **Documentation**: Document all fields and their purposes

## Adding New Configurations

1. Create a new `.config.ts` file
2. Add grammar-ops metadata header
3. Export configuration object and types
4. Add helper functions as needed
5. Update this README
6. Add to appropriate imports in dependent files

## Environment-Specific Settings

Some configurations vary by environment:
- **localhost**: Higher file size limits, debug features
- **production**: Stricter limits, optimized settings

Check individual config files for environment-specific values.

## Dependencies

- Node.js path module for path operations
- TypeScript for type safety
- No external dependencies for core functionality

## Maintenance

When updating configurations:
1. Check all dependent files listed in `@used-by` headers
2. Run type checking: `npm run typecheck`
3. Update tests if applicable
4. Document changes in this README