# Database Directory

This directory contains structured application data that powers the Content Stack system's dynamic features.

## Structure

```
database/
├── users/              # User profiles and preferences
├── workflows/          # Content processing workflows
├── channels/           # Distribution channel configurations
├── analytics/          # Usage and performance metrics
├── collections/        # User-created content collections
└── sessions/           # Active user sessions
```

## Data Types

### Users (`users/`)
- User profiles
- Authentication tokens
- Preferences and settings
- API keys
- Subscription tiers

### Workflows (`workflows/`)
- Content processing pipelines
- Automation rules
- Scheduled tasks
- Batch job history

### Channels (`channels/`)
- Social media connections
- Publishing targets
- Channel-specific settings
- OAuth tokens

### Analytics (`analytics/`)
- Content performance metrics
- User activity logs
- System usage statistics
- Error logs

### Collections (`collections/`)
- Curated content groups
- Shared folders
- Project organizations
- Team workspaces

### Sessions (`sessions/`)
- Active user sessions
- Temporary state
- In-progress work

## File Format

All database files use JSON format with consistent schema:

```json
{
  "id": "unique-identifier",
  "type": "record-type",
  "created_at": "ISO-8601-timestamp",
  "updated_at": "ISO-8601-timestamp",
  "data": {
    // Type-specific data
  }
}
```

## Relationship to Other Directories

- **`/metadata/`** - Describes content in storage
- **`/database/`** - Describes system state and user data
- **`/storage/`** - Contains actual content files

## Security Note

This directory contains sensitive data including:
- User credentials
- API tokens
- Personal preferences

In production, this would be replaced with a proper database system (PostgreSQL, MongoDB, etc.)