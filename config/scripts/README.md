# Metadata Enforcement Scripts

This directory contains scripts to validate, audit, and enforce the metadata schema.

## Scripts Overview

### validate-metadata.ts
Validates a single metadata JSON file against the schema.

```bash
ts-node validate-metadata.ts /path/to/metadata.json
```

**Checks:**
- Required fields presence
- Field type validation
- Enum value validation
- Field relationships
- LLM analysis requirements

### audit-all-metadata.sh
Audits all metadata files in the project.

```bash
./audit-all-metadata.sh
```

**Output:**
- Lists all valid/invalid files
- Shows specific validation errors
- Provides summary statistics

### check-metadata-compliance.sh
Ensures all content has metadata and no orphaned metadata exists.

```bash
./check-metadata-compliance.sh
```

**Checks:**
- Content files without metadata
- Orphaned metadata files
- Overall schema compliance

### metadata-enforcer.ts
TypeScript module for runtime enforcement.

```typescript
import { MetadataEnforcer } from './metadata-enforcer';

// Check immutability
const result = MetadataEnforcer.enforceImmutability(original, updated);

// Check field ownership
const ownership = MetadataEnforcer.enforceFieldOwnership(updates, 'user');

// Create safe updates
const { safeUpdates, rejected } = MetadataEnforcer.createSafeUpdate(
  original, 
  updates, 
  'llm'
);
```

### update-import-paths.sh
Updates import paths after config reorganization.

```bash
./update-import-paths.sh
```

## Integration Examples

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check metadata compliance
./config/scripts/check-metadata-compliance.sh || exit 1
```

### CI/CD Pipeline
```yaml
# .github/workflows/metadata-check.yml
- name: Validate Metadata
  run: |
    cd config/scripts
    ./audit-all-metadata.sh
```

### API Middleware
```typescript
import { metadataUpdateMiddleware } from '@/config/scripts/metadata-enforcer';

app.put('/api/metadata/:id', 
  metadataUpdateMiddleware,
  updateMetadataHandler
);
```

## Schema Rules Summary

### Immutable Fields (Never Change)
- `id`, `created_at`
- `source.method`
- `content.type`, `content.full_text`, `content.hash`

### System Fields (System Updates)
- `updated_at`, `status`
- `title`, `filename`
- `location.*`, `storage.*`

### User-Editable Fields
- `user_tags[]`
- `source_url`, `reference_urls[]`
- `metadata.*`

### LLM-Only Fields
- `llm_analysis.*`

## Error Codes

- **Missing Required**: Required field not present
- **Invalid Type**: Field has wrong data type
- **Invalid Enum**: Value not in allowed list
- **Immutability Violation**: Attempted to change immutable field
- **Ownership Violation**: Wrong actor updating field
- **Relationship Error**: Fields don't match expected relationships