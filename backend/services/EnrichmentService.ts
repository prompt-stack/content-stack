/**
 * @layer backend-service
 * @description Service for LLM-based content enrichment with token optimization
 * @dependencies ../types/ContentTypes
 * @status experimental
 * @since 2024-01-22
 */

import type { ContentMetadata } from '../types/ContentTypes';

export class EnrichmentService {
  /**
   * Prepare optimized prompt for LLM enrichment
   * Excludes redundant fields and focuses on content.text
   */
  prepareEnrichmentPrompt(metadata: ContentMetadata): string {
    // Extract only necessary fields for analysis
    const optimizedData = {
      content_type: metadata.content.type,
      title: metadata.content.title,
      text: metadata.content.text, // Use ONLY the text field
      word_count: metadata.content.word_count,
      source_url: metadata.source.url,
      existing_tags: metadata.tags
    };

    // Create focused prompt
    return `Analyze this content and provide enrichment:

Content Type: ${optimizedData.content_type}
Title: ${optimizedData.title}
Word Count: ${optimizedData.word_count}
${optimizedData.source_url ? `Source URL: ${optimizedData.source_url}` : ''}
${optimizedData.existing_tags.length > 0 ? `Current Tags: ${optimizedData.existing_tags.join(', ')}` : ''}

Content:
${optimizedData.text || '[Binary content - no text available]'}

Please provide:
1. Category (one of: tech, business, finance, health, cooking, education, lifestyle, entertainment, general)
2. Confidence level (high, medium, low)
3. Quality score (1-10)
4. Brief summary (2-3 sentences)
5. Key points (3-5 bullet points)
6. Topics/themes identified
7. Suggested tags (5-10 relevant tags)

Respond in JSON format.`;
  }

  /**
   * Create enrichment prompt for binary files without text
   */
  prepareBinaryEnrichmentPrompt(metadata: ContentMetadata): string {
    return `Analyze this file metadata:

File Type: ${metadata.content.type}
Title/Filename: ${metadata.content.title}
File Size: ${metadata.storage?.size || 0} bytes
Source: ${metadata.source.method}
${metadata.source.url ? `URL: ${metadata.source.url}` : ''}

Based on the filename and metadata alone, suggest:
1. Likely category
2. Potential tags
3. Usage context

Respond in JSON format.`;
  }

  /**
   * Token-efficient batch enrichment
   */
  prepareBatchEnrichmentPrompt(items: ContentMetadata[]): string {
    const summaries = items.map((item) => ({
      id: item.id,
      type: item.content.type,
      title: item.content.title,
      preview: item.content.text?.substring(0, 200) + '...' // First 200 chars only
    }));

    return `Categorize these ${items.length} content items efficiently:

${summaries.map((s, i) => `${i + 1}. [${s.id}] ${s.type}: "${s.title}" - ${s.preview}`).join('\n')}

For each item, provide only:
- category
- 3 tags

Respond as JSON array matching the order above.`;
  }
}