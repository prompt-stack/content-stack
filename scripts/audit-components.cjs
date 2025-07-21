#!/usr/bin/env node

/**
 * Component Audit Script
 * Provides a comprehensive audit of your component system
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

// Extract metadata
function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const metadata = {};
  
  const patterns = {
    layer: /@layer\s+(\w+)/,
    status: /@status\s+(\w+)/,
    since: /@since\s+([^\n]+)/,
    dependencies: /@dependencies\s+([^\n]+)/,
    cssFile: /@cssFile\s+([^\n]+)/,
    a11y: /@a11y\s+([^\n]+)/,
    performance: /@performance\s+([^\n]+)/
  };
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = content.match(pattern);
    metadata[key] = match ? match[1].trim() : null;
  });
  
  return metadata;
}

// Analyze all components
function analyzeComponents() {
  const components = glob.sync('src/components/*.tsx');
  const features = glob.sync('src/features/**/*.tsx');
  const pages = glob.sync('src/pages/*.tsx');
  const layout = glob.sync('src/layout/*.tsx');
  
  const allComponents = [...components, ...features, ...pages, ...layout];
  
  const analysis = {
    total: allComponents.length,
    byLayer: {},
    byStatus: {},
    missingMetadata: [],
    missingCSS: [],
    experimentalComponents: [],
    deprecatedComponents: [],
    recentComponents: [],
    a11yIssues: []
  };
  
  allComponents.forEach(filePath => {
    const name = path.basename(filePath, '.tsx');
    const metadata = extractMetadata(filePath);
    
    // Count by layer
    if (metadata.layer) {
      analysis.byLayer[metadata.layer] = (analysis.byLayer[metadata.layer] || 0) + 1;
    } else {
      analysis.missingMetadata.push(name);
    }
    
    // Count by status
    if (metadata.status) {
      analysis.byStatus[metadata.status] = (analysis.byStatus[metadata.status] || 0) + 1;
      
      if (metadata.status === 'experimental') {
        analysis.experimentalComponents.push(name);
      } else if (metadata.status === 'deprecated') {
        analysis.deprecatedComponents.push(name);
      }
    }
    
    // Check CSS
    if (metadata.cssFile && metadata.cssFile !== 'none') {
      const cssPath = path.join(process.cwd(), metadata.cssFile.replace(/^\//, ''));
      if (!fs.existsSync(cssPath)) {
        analysis.missingCSS.push({ name, cssFile: metadata.cssFile });
      }
    }
    
    // Check recent (last 7 days)
    if (metadata.since) {
      const componentDate = new Date(metadata.since);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      if (componentDate > weekAgo) {
        analysis.recentComponents.push({ name, since: metadata.since });
      }
    }
    
    // Check a11y
    if (!metadata.a11y && metadata.layer !== 'layout') {
      analysis.a11yIssues.push(name);
    }
  });
  
  return analysis;
}

// Generate report
function generateReport(analysis) {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}        COMPONENT SYSTEM AUDIT REPORT${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);
  
  // Overview
  console.log(`${colors.cyan}📊 OVERVIEW${colors.reset}`);
  console.log(`   Total Components: ${analysis.total}`);
  console.log('');
  
  // By Layer
  console.log(`${colors.cyan}📚 BY LAYER${colors.reset}`);
  Object.entries(analysis.byLayer).forEach(([layer, count]) => {
    const percentage = ((count / analysis.total) * 100).toFixed(1);
    console.log(`   ${layer}: ${count} (${percentage}%)`);
  });
  console.log('');
  
  // By Status
  console.log(`${colors.cyan}📈 BY STATUS${colors.reset}`);
  Object.entries(analysis.byStatus).forEach(([status, count]) => {
    const color = status === 'stable' ? colors.green : 
                  status === 'experimental' ? colors.yellow : 
                  colors.red;
    console.log(`   ${color}${status}${colors.reset}: ${count}`);
  });
  console.log('');
  
  // Issues
  console.log(`${colors.cyan}⚠️  ISSUES${colors.reset}`);
  
  if (analysis.missingMetadata.length > 0) {
    console.log(`\n   ${colors.red}Missing Metadata:${colors.reset}`);
    analysis.missingMetadata.forEach(name => {
      console.log(`   - ${name}`);
    });
  }
  
  if (analysis.missingCSS.length > 0) {
    console.log(`\n   ${colors.red}Missing CSS Files:${colors.reset}`);
    analysis.missingCSS.forEach(({ name, cssFile }) => {
      console.log(`   - ${name}: ${cssFile}`);
    });
  }
  
  if (analysis.a11yIssues.length > 0) {
    console.log(`\n   ${colors.yellow}Missing A11y Documentation:${colors.reset}`);
    analysis.a11yIssues.forEach(name => {
      console.log(`   - ${name}`);
    });
  }
  
  // Experimental
  if (analysis.experimentalComponents.length > 0) {
    console.log(`\n${colors.cyan}🧪 EXPERIMENTAL COMPONENTS${colors.reset}`);
    analysis.experimentalComponents.forEach(name => {
      console.log(`   - ${name}`);
    });
  }
  
  // Recent
  if (analysis.recentComponents.length > 0) {
    console.log(`\n${colors.cyan}🆕 RECENTLY ADDED (Last 7 days)${colors.reset}`);
    analysis.recentComponents.forEach(({ name, since }) => {
      console.log(`   - ${name} (${since})`);
    });
  }
  
  // Health Score
  const healthScore = calculateHealthScore(analysis);
  console.log(`\n${colors.cyan}💚 HEALTH SCORE${colors.reset}`);
  const scoreColor = healthScore >= 90 ? colors.green :
                     healthScore >= 70 ? colors.yellow :
                     colors.red;
  console.log(`   ${scoreColor}${healthScore}%${colors.reset}`);
  
  // Recommendations
  console.log(`\n${colors.cyan}💡 RECOMMENDATIONS${colors.reset}`);
  if (analysis.missingMetadata.length > 0) {
    console.log(`   - Add metadata to ${analysis.missingMetadata.length} components`);
  }
  if (analysis.missingCSS.length > 0) {
    console.log(`   - Create CSS files for ${analysis.missingCSS.length} components`);
  }
  if (analysis.experimentalComponents.length > 5) {
    console.log(`   - Review ${analysis.experimentalComponents.length} experimental components for stability`);
  }
  if (analysis.a11yIssues.length > 0) {
    console.log(`   - Document accessibility for ${analysis.a11yIssues.length} components`);
  }
  
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}\n`);
}

// Calculate health score
function calculateHealthScore(analysis) {
  let score = 100;
  
  // Deduct for missing metadata
  score -= analysis.missingMetadata.length * 5;
  
  // Deduct for missing CSS
  score -= analysis.missingCSS.length * 10;
  
  // Deduct for missing a11y
  score -= analysis.a11yIssues.length * 2;
  
  // Deduct for too many experimental
  const experimentalRatio = analysis.experimentalComponents.length / analysis.total;
  if (experimentalRatio > 0.3) {
    score -= 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

// Run audit
function main() {
  try {
    const analysis = analyzeComponents();
    generateReport(analysis);
  } catch (error) {
    console.error(`${colors.red}Error running audit:${colors.reset}`, error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeComponents, generateReport };