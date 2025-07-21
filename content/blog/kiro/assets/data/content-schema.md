# Content Schema Documentation

This document defines the structure and schema for the course configuration and content files.

## Course Configuration Schema

### Root Structure
```json
{
  "course": { ... },      // Course metadata
  "modules": [ ... ],     // Array of course modules
  "ui": { ... },         // UI configuration
  "features": { ... }    // Feature flags
}
```

### Course Object
```json
{
  "title": "string",           // Course title
  "subtitle": "string",        // Course subtitle
  "description": "string",     // Detailed description
  "version": "string",         // Version number (semver)
  "lastUpdated": "string",     // ISO date string
  "estimatedDuration": "string", // Human-readable duration
  "difficulty": "string",      // beginner|intermediate|advanced
  "prerequisites": "string",   // Prerequisites description
  "learningObjectives": ["string"] // Array of learning objectives
}
```

### Module Object
```json
{
  "id": "string",             // Unique identifier (kebab-case)
  "title": "string",          // Module title
  "description": "string",    // Module description
  "icon": "string",           // Icon identifier
  "estimatedTime": "string",  // Human-readable time estimate
  "difficulty": "string",     // beginner|intermediate|advanced
  "order": "number",          // Display order
  "sections": [...]           // Array of section objects
}
```

### Section Object
```json
{
  "id": "string",            // Unique identifier (kebab-case)
  "title": "string",         // Section title
  "type": "string",          // concept|interactive|practical
  "estimatedTime": "string", // Human-readable time estimate
  "content": { ... }         // Content object (varies by type)
}
```

## Content Types

### Concept Content
For theoretical explanations and introductions:
```json
{
  "introduction": "string",    // Main explanation
  "keyPoints": ["string"],     // Array of key points
  "examples": [               // Array of example objects
    {
      "title": "string",
      "description": "string",
      "visual": "string"       // Optional: image filename
    }
  ]
}
```

### Interactive Content
For hands-on learning with interactive elements:
```json
{
  "introduction": "string",
  "interactive": {
    "type": "string",          // json-editor|validator|diagram
    "initialValue": "string",  // Starting content
    "instructions": "string"   // User instructions
  },
  "examples": [...]           // Same as concept examples
}
```

### Practical Content
For real-world applications and exercises:
```json
{
  "introduction": "string",
  "examples": [
    {
      "scenario": "string",     // Use case description
      "prompt": "string",       // Example prompt/code
      "explanation": "string"   // Why this works
    }
  ]
}
```

## UI Configuration

### Theme Object
```json
{
  "primary": "string",      // Primary color (hex)
  "secondary": "string",    // Secondary color (hex)
  "accent": "string",       // Accent color (hex)
  "text": "string",         // Text color (hex)
  "background": "string",   // Background color (hex)
  "surface": "string"      // Surface color (hex)
}
```

### Navigation Object
```json
{
  "showProgress": "boolean",     // Show progress indicators
  "stickyHeader": "boolean",     // Sticky navigation
  "mobileBreakpoint": "string"   // CSS breakpoint value
}
```

### Content Object
```json
{
  "maxWidth": "string",              // Max content width (CSS value)
  "enableSyntaxHighlighting": "boolean", // Enable code highlighting
  "showEstimatedTime": "boolean"     // Show time estimates
}
```

## Feature Flags

```json
{
  "progressTracking": "boolean",  // Enable progress tracking
  "offlineSupport": "boolean",    // Enable offline functionality
  "darkMode": "boolean",          // Enable dark mode toggle
  "printFriendly": "boolean",     // Enable print styles
  "socialSharing": "boolean"      // Enable social sharing
}
```

## Content Guidelines

### Writing Style
- Use plain English, avoid technical jargon
- Include real-world analogies and metaphors
- Break complex concepts into digestible chunks
- Provide practical examples and use cases

### Structure Guidelines
- Each module should have 3-5 sections maximum
- Sections should be 5-20 minutes each
- Include interactive elements where appropriate
- Provide clear learning objectives

### Accessibility Requirements
- All content must have proper semantic structure
- Images require alt text descriptions
- Interactive elements need ARIA labels
- Color cannot be the only way to convey information

## Validation Rules

### Required Fields
- All objects must have required fields as specified
- IDs must be unique within their scope
- Order numbers must be sequential

### Data Types
- Strings must be non-empty for required fields
- Numbers must be positive integers for order/time
- Booleans must be true/false (not truthy/falsy)
- Arrays must contain at least one item where specified

### Content Validation
- JSON syntax must be valid
- All referenced images/assets must exist
- Interactive types must be supported
- Color values must be valid hex codes

## Extension Points

The schema is designed to be extensible:

### Custom Content Types
Add new section types by extending the content object structure.

### Additional Metadata
Add custom fields to any object for specific needs.

### Plugin Support
The schema supports future plugin architecture through the features object.

## Migration Strategy

When updating the schema:
1. Maintain backward compatibility where possible
2. Provide migration scripts for breaking changes
3. Version the schema and validate against it
4. Document all changes in this file