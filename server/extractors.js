/**
 * Content Extractors for Content Stack
 * Integrates the extractors from tools folder
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const toolsDir = join(__dirname, '..', 'tools');

// Import extractors dynamically
async function loadExtractors() {
    const extractors = {};
    
    try {
        const { extractTikTokForContentStack } = await import(join(toolsDir, 'tiktok-extractor', 'tiktok-direct.js'));
        extractors.tiktok = extractTikTokForContentStack;
    } catch (e) {
        console.warn('TikTok extractor not available:', e.message);
    }
    
    try {
        const { extractYouTubeForContentStack } = await import(join(toolsDir, 'youtube-extractor', 'youtube-ytdlp.js'));
        extractors.youtube = extractYouTubeForContentStack;
    } catch (e) {
        console.warn('YouTube extractor not available:', e.message);
    }
    
    try {
        const { extractArticleForContentStack } = await import(join(toolsDir, 'article-scraper', 'article-scraper.js'));
        extractors.article = extractArticleForContentStack;
    } catch (e) {
        console.warn('Article extractor not available:', e.message);
    }
    
    try {
        const { extractRedditForContentStack } = await import(join(toolsDir, 'reddit-extractor', 'reddit-extractor.js'));
        extractors.reddit = extractRedditForContentStack;
    } catch (e) {
        console.warn('Reddit extractor not available:', e.message);
    }
    
    return extractors;
}

/**
 * Detect platform from URL
 */
export function detectPlatform(url) {
    if (url.includes('tiktok.com')) {
        return 'tiktok';
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'youtube';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
        return 'twitter';
    } else if (url.includes('reddit.com')) {
        return 'reddit';
    } else if (url.includes('medium.com')) {
        return 'medium';
    } else if (url.includes('substack.com')) {
        return 'substack';
    }
    
    // Default to article
    return 'article';
}

/**
 * Extract content from URL
 */
export async function extractContent(url) {
    console.log('Extracting content from:', url);
    const platform = detectPlatform(url);
    console.log('Detected platform:', platform);
    
    const extractors = await loadExtractors();
    
    // Try platform-specific extractor
    if (platform === 'tiktok' && extractors.tiktok) {
        return await extractors.tiktok(url);
    } else if (platform === 'youtube' && extractors.youtube) {
        return await extractors.youtube(url);
    } else if (platform === 'reddit' && extractors.reddit) {
        return await extractors.reddit(url);
    } else if (extractors.article) {
        // Use article extractor for everything else
        return await extractors.article(url);
    }
    
    // Fallback response
    return {
        platform: platform,
        title: 'Content',
        url: url,
        content: `Unable to extract content from ${url}. No extractor available for ${platform}.`,
        error: 'No extractor available',
        success: false
    };
}

/**
 * Batch extraction
 */
export async function extractMultiple(urls) {
    const results = await Promise.allSettled(
        urls.map(url => extractContent(url))
    );
    
    return results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            return {
                url: urls[index],
                error: result.reason.message,
                platform: 'unknown',
                content: `Failed to extract: ${result.reason.message}`,
                success: false
            };
        }
    });
}