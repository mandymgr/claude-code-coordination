/**
 * 🧠 Cache Similarity Matcher - Intelligent Query Matching Engine
 * Advanced similarity matching with multiple algorithms and context awareness
 * TypeScript implementation for KRINS-Universe-Builder
 */

import { 
  SimilarityMatch, 
  CacheContext, 
  SimilarityConfig, 
  SimilarityAnalysis,
  CacheEntry
} from './cache-types.js';

export class CacheSimilarityMatcher {
  private config: SimilarityConfig;

  constructor(config: Partial<SimilarityConfig> = {}) {
    this.config = {
      algorithm: 'hybrid',
      threshold: 0.75,
      contextWeight: 0.3,
      queryWeight: 0.7,
      normalizeCase: true,
      removePunctuation: true,
      stemming: false,
      ...config
    };
  }

  /**
   * 🎯 Find similar cached queries
   */
  public findSimilarQueries(
    query: string,
    context: CacheContext,
    cacheEntries: Record<string, any>,
    metadata: Record<string, CacheEntry>
  ): SimilarityMatch[] {
    const normalizedQuery = this.normalizeQuery(query);
    const matches: SimilarityMatch[] = [];

    for (const [cacheKey, cachedData] of Object.entries(cacheEntries)) {
      const entry = metadata[cacheKey];
      if (!entry || this.isExpired(entry)) continue;

      const similarity = this.calculateSimilarity(
        normalizedQuery,
        cachedData.query,
        context,
        cachedData.context
      );

      if (similarity.overallSimilarity >= this.config.threshold) {
        matches.push({
          cacheKey,
          query: cachedData.query,
          similarity: similarity.overallSimilarity,
          context: cachedData.context,
          entry
        });
      }
    }

    // Sort by similarity descending
    return matches.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * 🔍 Calculate comprehensive similarity between queries
   */
  public calculateSimilarity(
    query1: string,
    query2: string,
    context1: CacheContext,
    context2: CacheContext
  ): SimilarityAnalysis {
    const normalizedQuery1 = this.normalizeQuery(query1);
    const normalizedQuery2 = this.normalizeQuery(query2);

    // Text similarity using selected algorithm
    const textSimilarity = this.calculateTextSimilarity(normalizedQuery1, normalizedQuery2);
    
    // Context similarity
    const contextSimilarity = this.calculateContextSimilarity(context1, context2);
    
    // Semantic similarity (simplified - could use embeddings in future)
    const semanticSimilarity = this.calculateSemanticSimilarity(normalizedQuery1, normalizedQuery2);
    
    // Overall weighted similarity
    const overallSimilarity = (
      textSimilarity * this.config.queryWeight +
      contextSimilarity * this.config.contextWeight
    );

    // Confidence based on consistency of different similarity measures
    const confidence = this.calculateConfidence(textSimilarity, contextSimilarity, semanticSimilarity);

    return {
      textSimilarity,
      contextSimilarity,
      semanticSimilarity,
      overallSimilarity,
      confidence
    };
  }

  /**
   * ✨ Normalize query for better matching
   */
  private normalizeQuery(query: string): string {
    let normalized = query;

    if (this.config.normalizeCase) {
      normalized = normalized.toLowerCase();
    }

    if (this.config.removePunctuation) {
      normalized = normalized.replace(/[^\w\s]/g, ' ');
    }

    // Remove extra whitespace
    normalized = normalized.replace(/\s+/g, ' ').trim();

    if (this.config.stemming) {
      normalized = this.applyStemming(normalized);
    }

    return normalized;
  }

  /**
   * 📝 Calculate text similarity using selected algorithm
   */
  private calculateTextSimilarity(query1: string, query2: string): number {
    switch (this.config.algorithm) {
      case 'levenshtein':
        return this.levenshteinSimilarity(query1, query2);
      case 'jaccard':
        return this.jaccardSimilarity(query1, query2);
      case 'cosine':
        return this.cosineSimilarity(query1, query2);
      case 'hybrid':
        return this.hybridSimilarity(query1, query2);
      default:
        return this.levenshteinSimilarity(query1, query2);
    }
  }

  /**
   * 📏 Levenshtein distance similarity
   */
  private levenshteinSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  }

  /**
   * 📏 Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * 🎲 Jaccard similarity (token-based)
   */
  private jaccardSimilarity(str1: string, str2: string): number {
    const tokens1 = new Set(str1.split(/\s+/));
    const tokens2 = new Set(str2.split(/\s+/));
    
    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);
    
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  /**
   * 📐 Cosine similarity (character-based vectors)
   */
  private cosineSimilarity(str1: string, str2: string): number {
    const vector1 = this.getCharacterFrequency(str1);
    const vector2 = this.getCharacterFrequency(str2);
    
    const allChars = new Set([...Object.keys(vector1), ...Object.keys(vector2)]);
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (const char of allChars) {
      const freq1 = vector1[char] || 0;
      const freq2 = vector2[char] || 0;
      
      dotProduct += freq1 * freq2;
      magnitude1 += freq1 * freq1;
      magnitude2 += freq2 * freq2;
    }
    
    const magnitude = Math.sqrt(magnitude1) * Math.sqrt(magnitude2);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  /**
   * 🔄 Hybrid similarity combining multiple algorithms
   */
  private hybridSimilarity(str1: string, str2: string): number {
    const levenshtein = this.levenshteinSimilarity(str1, str2);
    const jaccard = this.jaccardSimilarity(str1, str2);
    const cosine = this.cosineSimilarity(str1, str2);
    
    // Weighted average with emphasis on Levenshtein for typos
    return (levenshtein * 0.5) + (jaccard * 0.3) + (cosine * 0.2);
  }

  /**
   * 🔤 Get character frequency vector
   */
  private getCharacterFrequency(str: string): Record<string, number> {
    const freq: Record<string, number> = {};
    for (const char of str) {
      freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
  }

  /**
   * 🌐 Calculate context similarity
   */
  private calculateContextSimilarity(context1: CacheContext, context2: CacheContext): number {
    const weights = {
      projectType: 0.3,
      language: 0.25,
      framework: 0.2,
      taskType: 0.15,
      fileType: 0.1
    };

    let similarity = 0;
    let totalWeight = 0;

    for (const [key, weight] of Object.entries(weights)) {
      const value1 = context1[key as keyof CacheContext];
      const value2 = context2[key as keyof CacheContext];

      if (value1 && value2) {
        totalWeight += weight;
        if (value1 === value2) {
          similarity += weight;
        } else if (typeof value1 === 'string' && typeof value2 === 'string') {
          // Partial match for similar values
          const partialSimilarity = this.levenshteinSimilarity(value1, value2);
          if (partialSimilarity > 0.7) {
            similarity += weight * partialSimilarity;
          }
        }
      }
    }

    return totalWeight === 0 ? 0.5 : similarity / totalWeight; // Default to neutral if no context
  }

  /**
   * 🧠 Calculate semantic similarity (simplified)
   */
  private calculateSemanticSimilarity(query1: string, query2: string): number {
    // Simplified semantic analysis - could be enhanced with embeddings
    const keywords1 = this.extractKeywords(query1);
    const keywords2 = this.extractKeywords(query2);
    
    const commonKeywords = keywords1.filter(k => keywords2.includes(k));
    const totalKeywords = new Set([...keywords1, ...keywords2]).size;
    
    return totalKeywords === 0 ? 0 : commonKeywords.length / totalKeywords;
  }

  /**
   * 🔑 Extract keywords from query
   */
  private extractKeywords(query: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'how', 'what', 'where', 'when', 'why', 'this', 'that', 'these', 'those'
    ]);

    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .filter(word => /^[a-zA-Z]+$/.test(word)); // Only alphabetic words
  }

  /**
   * 🌿 Apply basic stemming
   */
  private applyStemming(query: string): string {
    // Simple suffix removal (could be enhanced with proper stemming library)
    return query.replace(/\b(\w+)(ing|ed|er|est|ly|tion|sion)\b/g, '$1');
  }

  /**
   * 🎯 Calculate confidence based on consistency of measures
   */
  private calculateConfidence(
    textSimilarity: number,
    contextSimilarity: number,
    semanticSimilarity: number
  ): number {
    const similarities = [textSimilarity, contextSimilarity, semanticSimilarity];
    const average = similarities.reduce((a, b) => a + b) / similarities.length;
    
    // Calculate variance
    const variance = similarities.reduce((acc, sim) => acc + Math.pow(sim - average, 2), 0) / similarities.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher confidence
    return Math.max(0, 1 - (standardDeviation * 2));
  }

  /**
   * ⏰ Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  /**
   * 🎛️ Update similarity configuration
   */
  public updateConfig(config: Partial<SimilarityConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 📊 Get current configuration
   */
  public getConfig(): SimilarityConfig {
    return { ...this.config };
  }
}