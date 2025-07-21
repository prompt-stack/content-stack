/**
 * Search functionality for Content Stack
 */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Build search index from library content
 */
export async function buildSearchIndex(libraryDir) {
    const index = {
        documents: {},
        terms: {},
        categories: {},
        topics: {}
    };
    
    async function indexDirectory(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                await indexDirectory(fullPath);
            } else if (entry.name.endsWith('.json')) {
                try {
                    const content = await fs.readFile(fullPath, 'utf8');
                    const doc = JSON.parse(content);
                    
                    // Store document
                    index.documents[doc.id] = {
                        ...doc,
                        _path: fullPath
                    };
                    
                    // Index searchable fields
                    const searchableText = [
                        doc.title,
                        doc.summary,
                        ...(doc.key_points || []),
                        ...(doc.hooks || []),
                        ...(doc.quotable_moments || []),
                        ...(doc.topics || [])
                    ].join(' ').toLowerCase();
                    
                    // Create term index
                    const words = searchableText.split(/\s+/).filter(w => w.length > 2);
                    words.forEach(word => {
                        if (!index.terms[word]) {
                            index.terms[word] = [];
                        }
                        index.terms[word].push(doc.id);
                    });
                    
                    // Index by category
                    if (!index.categories[doc.category]) {
                        index.categories[doc.category] = [];
                    }
                    index.categories[doc.category].push(doc.id);
                    
                    // Index by topics
                    (doc.topics || []).forEach(topic => {
                        const normalizedTopic = topic.toLowerCase();
                        if (!index.topics[normalizedTopic]) {
                            index.topics[normalizedTopic] = [];
                        }
                        index.topics[normalizedTopic].push(doc.id);
                    });
                    
                } catch (error) {
                    console.error(`Error indexing ${fullPath}:`, error);
                }
            }
        }
    }
    
    await indexDirectory(libraryDir);
    return index;
}

/**
 * Search content with various filters
 */
export function searchContent(index, options = {}) {
    const {
        query = '',
        category = null,
        topics = [],
        contentType = null,
        minScore = 0,
        dateFrom = null,
        dateTo = null,
        limit = 50,
        offset = 0
    } = options;
    
    let results = [];
    
    // Start with all documents or filtered by category
    let candidateIds = category 
        ? (index.categories[category] || [])
        : Object.keys(index.documents);
    
    // Filter by search query
    if (query) {
        const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const matchingIds = new Set();
        
        queryTerms.forEach(term => {
            // Find documents containing this term
            const termMatches = index.terms[term] || [];
            termMatches.forEach(id => matchingIds.add(id));
            
            // Also check partial matches
            Object.keys(index.terms).forEach(indexTerm => {
                if (indexTerm.includes(term)) {
                    index.terms[indexTerm].forEach(id => matchingIds.add(id));
                }
            });
        });
        
        candidateIds = candidateIds.filter(id => matchingIds.has(id));
    }
    
    // Filter by topics
    if (topics.length > 0) {
        const topicIds = new Set();
        topics.forEach(topic => {
            const normalizedTopic = topic.toLowerCase();
            (index.topics[normalizedTopic] || []).forEach(id => topicIds.add(id));
        });
        candidateIds = candidateIds.filter(id => topicIds.has(id));
    }
    
    // Apply remaining filters and build results
    candidateIds.forEach(id => {
        const doc = index.documents[id];
        
        // Filter by content type
        if (contentType && doc.content_type !== contentType) return;
        
        // Filter by score
        if (doc.score < minScore) return;
        
        // Filter by date
        if (dateFrom || dateTo) {
            const docDate = new Date(doc.processed_at);
            if (dateFrom && docDate < new Date(dateFrom)) return;
            if (dateTo && docDate > new Date(dateTo)) return;
        }
        
        // Calculate relevance score
        let relevanceScore = 0;
        if (query) {
            const queryTerms = query.toLowerCase().split(/\s+/);
            queryTerms.forEach(term => {
                if (doc.title.toLowerCase().includes(term)) relevanceScore += 10;
                if (doc.summary.toLowerCase().includes(term)) relevanceScore += 5;
                if (doc.topics.some(t => t.toLowerCase().includes(term))) relevanceScore += 3;
                if (doc.key_points.some(kp => kp.toLowerCase().includes(term))) relevanceScore += 2;
            });
        }
        
        results.push({
            ...doc,
            _relevance: relevanceScore
        });
    });
    
    // Sort by relevance (if searching) or by date
    results.sort((a, b) => {
        if (query) {
            return b._relevance - a._relevance;
        }
        return new Date(b.processed_at) - new Date(a.processed_at);
    });
    
    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);
    
    return {
        results: paginatedResults,
        total: results.length,
        offset,
        limit
    };
}

/**
 * Find similar content based on topics and key points
 */
export function findSimilarContent(index, contentId, limit = 5) {
    const sourceDoc = index.documents[contentId];
    if (!sourceDoc) return [];
    
    const similarityScores = {};
    
    // Score based on shared topics
    (sourceDoc.topics || []).forEach(topic => {
        const relatedIds = index.topics[topic.toLowerCase()] || [];
        relatedIds.forEach(id => {
            if (id !== contentId) {
                similarityScores[id] = (similarityScores[id] || 0) + 2;
            }
        });
    });
    
    // Score based on same category
    const categoryIds = index.categories[sourceDoc.category] || [];
    categoryIds.forEach(id => {
        if (id !== contentId) {
            similarityScores[id] = (similarityScores[id] || 0) + 1;
        }
    });
    
    // Score based on content type
    Object.values(index.documents).forEach(doc => {
        if (doc.id !== contentId && doc.content_type === sourceDoc.content_type) {
            similarityScores[doc.id] = (similarityScores[doc.id] || 0) + 1;
        }
    });
    
    // Convert to array and sort
    const similar = Object.entries(similarityScores)
        .map(([id, score]) => ({
            ...index.documents[id],
            _similarity: score
        }))
        .sort((a, b) => b._similarity - a._similarity)
        .slice(0, limit);
    
    return similar;
}

/**
 * Detect potential duplicate content
 */
export function detectDuplicates(index, threshold = 0.8) {
    const duplicates = [];
    const processed = new Set();
    
    Object.values(index.documents).forEach(doc1 => {
        if (processed.has(doc1.id)) return;
        
        const potentialDuplicates = [];
        
        Object.values(index.documents).forEach(doc2 => {
            if (doc1.id === doc2.id || processed.has(doc2.id)) return;
            
            // Calculate similarity
            let similarity = 0;
            
            // Title similarity
            if (doc1.title.toLowerCase() === doc2.title.toLowerCase()) {
                similarity += 0.4;
            } else if (doc1.title.toLowerCase().includes(doc2.title.toLowerCase()) ||
                       doc2.title.toLowerCase().includes(doc1.title.toLowerCase())) {
                similarity += 0.2;
            }
            
            // Topic overlap
            const topics1 = new Set(doc1.topics.map(t => t.toLowerCase()));
            const topics2 = new Set(doc2.topics.map(t => t.toLowerCase()));
            const topicOverlap = [...topics1].filter(t => topics2.has(t)).length;
            const topicUnion = new Set([...topics1, ...topics2]).size;
            if (topicUnion > 0) {
                similarity += (topicOverlap / topicUnion) * 0.3;
            }
            
            // Key points overlap
            const keyPoints1 = doc1.key_points.join(' ').toLowerCase();
            const keyPoints2 = doc2.key_points.join(' ').toLowerCase();
            const commonWords = keyPoints1.split(/\s+/).filter(w => 
                w.length > 3 && keyPoints2.includes(w)
            ).length;
            if (commonWords > 5) {
                similarity += 0.3;
            }
            
            if (similarity >= threshold) {
                potentialDuplicates.push({
                    document: doc2,
                    similarity
                });
            }
        });
        
        if (potentialDuplicates.length > 0) {
            duplicates.push({
                original: doc1,
                duplicates: potentialDuplicates
            });
            processed.add(doc1.id);
            potentialDuplicates.forEach(d => processed.add(d.document.id));
        }
    });
    
    return duplicates;
}