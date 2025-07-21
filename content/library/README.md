# Library Directory

The library contains enriched, processed content organized by category. This is the main content database of the system.

## Architecture

```
library/
├── tech/           # Programming, AI, software, digital tools
├── business/       # Entrepreneurship, marketing, strategy
├── finance/        # Investing, crypto, money, economics
├── health/         # Fitness, wellness, nutrition, mental health
├── cooking/        # Recipes, food prep, culinary techniques
├── education/      # Learning, tutorials, how-to guides
├── lifestyle/      # Personal development, habits, productivity
├── entertainment/  # Pop culture, media, gaming, arts
└── general/        # Cross-category or uncategorized
```

## File Format

Each entry is a JSON file containing enriched metadata:

```json
{
  "id": "processed-{timestamp}",
  "source_metadata_id": "{metadata_id}",
  "category": "tech",
  "content_type": "youtube|article|reddit|etc",
  "title": "Human-readable title",
  "summary": "Brief summary under 300 chars",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "hooks": ["Attention-grabbing statements"],
  "quotable_moments": ["Notable quotes from content"],
  "topics": ["tag1", "tag2", "tag3"],
  "metrics": {
    "word_count": 1500,
    "reading_time": "6 minutes",
    "language": "english"
  },
  "channel_fitness": {
    "tweet_single": 0.8,
    "tweet_thread": 0.9,
    "linkedin_post": 0.7,
    "newsletter_section": 0.85,
    "blog_article": 0.6,
    "short_video_script": 0.4,
    "knowledge_base_card": 0.95
  },
  "processed_at": "2025-01-13T12:00:00Z"
}
```

## Key Features

### Token-Optimized Architecture
- **No content duplication**: Original content stays in metadata files
- **Reference-based**: Uses `source_metadata_id` to link to original content
- **Enrichment focus**: Contains analysis, insights, and transformation data

### Content Discovery
- **Searchable**: All entries indexed by title, summary, topics
- **Filterable**: By category, content type, confidence score
- **Sortable**: By processing date, score, channel fitness

### Multi-Channel Ready
- **Channel fitness scores**: Rate content suitability for different platforms
- **Style suggestions**: Recommended approaches for content transformation
- **Hook extraction**: Pre-identified viral angles and attention grabbers

## File Naming

```
{slugified-title}-{timestamp}.json
```

Examples:
- `model-context-protocol-explained-1752367068093.json`
- `personal-knowledge-management-system-1752400000000.json`
- `ide-as-next-excel-vertical-environments-1752438581543.json`

## Usage

1. **Content Processing**: LLM creates entries here after analyzing inbox content
2. **Content Selection**: Users browse/search library for content to transform
3. **Multi-Channel Distribution**: Use entries to generate platform-specific content
4. **Knowledge Management**: Searchable repository of all processed content

## Integration

- **Frontend**: Browse and search via web interface
- **API**: Programmatic access to library contents
- **Plugins**: Transform library entries for specific platforms
- **Export**: Generate reports, feeds, or data exports