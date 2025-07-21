# Prompts Directory

This directory contains specialized AI prompts and guides for development and content processing workflows.

## Files

### 🎨 CSS_AUDIT_GUIDE.md
A comprehensive guide for auditing and standardizing CSS naming conventions across the codebase.

**Key Features:**
- BEM naming convention rules and examples
- File-specific naming requirements (components, pages, features)
- Step-by-step audit process for each CSS file
- Common issues and how to fix them
- Documentation templates and checklists
- Progress tracking methodology

**Use Cases:**
- Standardizing CSS class naming
- Eliminating duplicate and conflicting styles
- Creating maintainable CSS architecture
- Refactoring legacy CSS code

### 📊 DEBUG_GUIDE.md
A comprehensive debugging methodology for tracing data flow and identifying root causes of errors.

**Key Features:**
- Layered Trace Method (LTM) - 8-step debugging process
- Systematic upstream/downstream tracing
- Documentation requirements (output to project root)
- Error documentation template
- XML alternative format

**Use Cases:**
- Debugging complex data flow issues
- Tracing function call chains
- Identifying dependency problems
- Creating debug reports

### 📥 INBOX_PROCESSING.md
Content processing pipeline prompt for converting inbox items into enriched library entries.

**Key Features:**
- Automated content categorization (9 categories)
- Content type detection (10 types)
- Token-efficient processing (references, not copies)
- Technical content handling with code extraction
- Manual vs AI processing detection
- Batch processing optimization

**Categories:**
- tech, business, finance, health, cooking
- education, lifestyle, entertainment, general

**Content Types:**
- youtube, tiktok, article, voice-note, chat-thread
- twitter-thread, linkedin-post, newsletter, podcast, general

## Usage Instructions

### For Debugging
1. Reference DEBUG_GUIDE.md when investigating bugs
2. Follow the Layered Trace Method systematically
3. Output debug reports to the project root as `.md` files
4. Use the provided templates for consistency

### For Content Processing
1. Use INBOX_PROCESSING.md for inbox item enrichment
2. Process items from `/metadata/` to `/library/{category}/`
3. Always include `source_metadata_id` references
4. Run cleanup scripts after batch processing

## Best Practices

### Token Efficiency
- Reference metadata instead of copying content
- Use batch processing for multiple files
- Let scripts handle mechanical file operations

### Documentation
- Always document findings in `.md` files
- Keep debug reports in the project root
- Use descriptive filenames with timestamps

### Error Handling
- Check metadata status before processing
- Respect manually processed items
- Flag low-quality content appropriately

## Integration with Development

These prompts are designed to work with:
- The content-stack processing pipeline
- React TypeScript development workflows
- CSS refactoring and debugging tasks
- General code investigation and optimization

## Notes

- These prompts follow a structured format for consistency
- They emphasize documentation and systematic approaches
- Token efficiency is prioritized in all workflows
- Both prompts support XML alternative formats