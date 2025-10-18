/**
 * @file config/index.ts
 * @purpose Central export point for all configurations
 * @description Re-exports all configuration modules
 * @llm-read true
 * @llm-write no
 */

// Schema exports
export * from './schemas/metadata-schema.config';
export * from './schemas/file-types.config';
export * from './schemas/content-types.config';
export * from './schemas/categories.config';
export * from './schemas/paths.config';
export * from './schemas/pipeline.config';

// Tier system exports
export * from './tier-system/features';