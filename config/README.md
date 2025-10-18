# Configuration Directory

This directory contains all configuration for the Content Stack React application, organized following the grammar-ops standard.

## Directory Structure

```
config/
├── schemas/          # Core configuration schemas and type definitions
├── docs/            # Documentation about configurations
├── examples/        # Example configurations and templates
├── scripts/         # Configuration-related scripts
└── tier-system/     # Tier-specific configurations
```

## Schemas

- **metadata-schema.config.ts** - Content metadata structure definition
- **file-types.config.ts** - File type detection and categorization
- **content-types.config.ts** - Content type definitions
- **categories.config.ts** - Content category definitions
- **paths.config.ts** - File path configurations
- **pipeline.config.ts** - Processing pipeline configuration
- **file-types.json** - File extension mappings

## Documentation

- **README.md** - Original configuration overview
- **FIELD_OPTIONS_REFERENCE.md** - All fields with predefined options
- **METADATA_EXAMPLES.md** - Example metadata at different stages
- **TAG_TITLE_FLOW.md** - How tags and titles work
- **URL_HANDLING.md** - URL field management
- **ACCEPTED_FILE_TYPES.md** - Supported file types

## Examples

- **metadata-template.example.json** - Complete metadata template with all fields

## Usage

Import configurations in your code:

```typescript
import { metadataSchema } from '@/config/schemas/metadata-schema.config';
import { categoriesConfig } from '@/config/schemas/categories.config';
import { fileTypesConfig } from '@/config/schemas/file-types.config';
```

## Grammar-Ops Compliance

This directory follows the grammar-ops organizational standard:
- Clear separation of schemas, docs, examples, and scripts
- Consistent naming conventions
- Comprehensive documentation
- Type-safe configurations