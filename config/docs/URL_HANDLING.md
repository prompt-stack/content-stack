# URL Handling in Metadata

## URL Fields

### 1. Source Method (Immutable)
```json
"source": {
  "method": "url"  // HOW it was captured - never changes
}
```
- Records the original ingestion method
- If content came via URL fetch, this stays "url" forever
- If pasted, stays "paste" even if URL is added later

### 2. Source URL (User-Editable)
```json
"source_url": "https://example.com/article"
```
- The actual URL where content can be found
- Can be updated if URL changes
- Can be added later (e.g., paste content, then find source)
- Can be corrected if wrong

### 3. Reference URLs (User-Editable)
```json
"reference_urls": [
  "https://archive.org/version",
  "https://mirror-site.com/article",
  "https://related-resource.com"
]
```
- Alternative locations
- Related resources
- Archive links
- Mirror sites

## Common Scenarios

### Scenario 1: Content Pasted, URL Found Later
```json
// Initial state
{
  "source": { "method": "paste" },
  "source_url": null
}

// After finding source
{
  "source": { "method": "paste" },  // Still paste!
  "source_url": "https://found-it.com/article"
}
```

### Scenario 2: URL Changes (Redirect/Move)
```json
// Original
{
  "source": { "method": "url" },
  "source_url": "https://old-domain.com/article"
}

// After update
{
  "source": { "method": "url" },
  "source_url": "https://new-domain.com/article",
  "reference_urls": ["https://old-domain.com/article"]  // Keep old for reference
}
```

### Scenario 3: Multiple Valid Sources
```json
{
  "source": { "method": "url" },
  "source_url": "https://youtube.com/watch?v=123",  // Primary/canonical
  "reference_urls": [
    "https://author-blog.com/transcript",
    "https://archive.org/details/video-123"
  ]
}
```

## Benefits

1. **Historical Accuracy**: `source.method` preserves how content entered system
2. **Flexibility**: URLs can be updated without losing history
3. **Discoverability**: Can add URLs to any content later
4. **Redundancy**: Multiple URLs prevent link rot
5. **Context**: Preserves both origin method AND current location