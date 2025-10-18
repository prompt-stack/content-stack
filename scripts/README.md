# Scripts Directory

This directory contains all maintenance and utility scripts for the Content Stack system, organized by function.

## Directory Structure

```
scripts/
├── audit/           # Component and code quality audit scripts
├── content/         # Content organization and management scripts
├── metadata/        # Metadata generation and validation scripts
├── storage/         # Storage integrity and cleanup scripts
└── validation/      # General validation scripts
```

## Quick Reference

### Storage Scripts (`storage/`)

- **`integrity-check.js`** - Check storage and metadata consistency
  ```bash
  npm run storage:integrity
  ```

- **`cleanup-storage.js`** - Remove orphaned files and fix issues
  ```bash
  npm run storage:cleanup
  ```

- **`fix-metadata-sizes.js`** - Update file sizes in metadata
  ```bash
  npm run storage:fix-sizes
  ```

- **`check-binary-files.js`** - Validate binary files are actual binaries

### Metadata Scripts (`metadata/`)

- **`add-category-field.js`** - Add required category field to metadata
  ```bash
  npm run metadata:add-category
  ```

- **`generate-metadata.sh`** - Generate metadata for new files
- **`generate-missing-metadata.sh`** - Create metadata for files without it
- **`validate-metadata.sh`** - Validate metadata schema compliance

### Audit Scripts (`audit/`)

- **`audit-components.cjs`** - Audit React component standards
- **`validate-component-styles.cjs`** - Validate CSS module usage

### Content Scripts (`content/`)

- **`content-audit.sh`** - Audit content directory structure
- **`content-organizer.sh`** - Organize content by type

## Usage Examples

### Check Storage Health
```bash
npm run storage:integrity
```

### Fix All Storage Issues
```bash
npm run storage:cleanup
npm run storage:fix-sizes
npm run metadata:add-category
```

### Full System Audit
```bash
npm run storage:integrity
npm run audit:component
npm run audit:naming
```

## Development

When adding new scripts:

1. Place in the appropriate subdirectory
2. Add npm script alias to package.json
3. Document usage in this README
4. Follow naming conventions:
   - Node.js scripts: `kebab-case.js`
   - Shell scripts: `kebab-case.sh`
   - Use descriptive action-based names

## Integration

These scripts are used by:
- CI/CD pipelines for validation
- Pre-commit hooks for quality checks
- Development workflow for maintenance
- Production deployment for integrity verification