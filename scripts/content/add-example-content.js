#!/usr/bin/env node

/**
 * Add example content to demonstrate different content types
 * Creates both storage files and metadata following the protocol
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..', '..');
const STORAGE_DIR = path.join(ROOT_DIR, 'storage');
const METADATA_DIR = path.join(ROOT_DIR, 'metadata');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

const log = {
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  detail: (msg) => console.log(`${colors.gray}  ${msg}${colors.reset}`)
};

// Example content for different categories
const exampleContent = [
  {
    category: 'tech',
    type: 'text',
    method: 'paste',
    title: 'Understanding React Server Components',
    content: `React Server Components represent a new paradigm in React development that allows components to be rendered on the server, reducing bundle sizes and improving performance.

Key benefits include:
- Reduced JavaScript bundle size
- Direct database access
- Automatic code splitting
- Improved SEO and initial page load

Server Components can fetch data directly without needing client-side state management or effects. This simplifies data fetching patterns and reduces the complexity of modern React applications.

Example usage:
async function BlogPost({ id }) {
  const post = await db.posts.findById(id);
  return <article>{post.content}</article>;
}

The future of React is moving towards a hybrid model where developers can choose the best rendering strategy for each component.`,
    tags: ['react', 'javascript', 'web-development', 'performance'],
    url: 'https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023'
  },
  {
    category: 'business',
    type: 'text',
    method: 'url',
    title: 'The Rise of AI-Powered Startups in 2024',
    content: `The startup ecosystem is experiencing a massive shift as AI becomes more accessible and powerful. In 2024, we're seeing unprecedented growth in AI-first companies across all sectors.

Key trends:
1. Vertical AI Solutions - Specialized AI for specific industries
2. AI Infrastructure - Tools and platforms for AI development
3. AI-Enhanced Productivity - Augmenting human capabilities
4. Generative AI Applications - Creative and content generation

Investors are pouring billions into AI startups, with valuations reaching new heights. However, the key to success is not just using AI, but solving real problems that create value for customers.

Successful AI startups focus on:
- Clear value proposition beyond "we use AI"
- Strong moat through data, technology, or network effects
- Sustainable unit economics
- Ethical AI practices and transparency`,
    tags: ['startups', 'ai', 'venture-capital', 'innovation'],
    url: 'https://techcrunch.com/2024/ai-startup-funding'
  },
  {
    category: 'finance',
    type: 'data',
    method: 'upload',
    title: 'Cryptocurrency Market Analysis Q1 2024',
    content: JSON.stringify({
      market_overview: {
        total_market_cap: "$2.45T",
        btc_dominance: "52.3%",
        eth_dominance: "16.8%",
        total_cryptocurrencies: 23451,
        active_markets: 745
      },
      top_performers: [
        { symbol: "SOL", name: "Solana", change_24h: "+8.5%", price: "$145.23" },
        { symbol: "AVAX", name: "Avalanche", change_24h: "+6.2%", price: "$42.18" },
        { symbol: "INJ", name: "Injective", change_24h: "+5.8%", price: "$38.92" }
      ],
      market_trends: [
        "Layer 2 scaling solutions gaining adoption",
        "RWA (Real World Assets) tokenization growing",
        "AI-crypto intersection creating new opportunities",
        "Institutional adoption continues despite volatility"
      ],
      risk_factors: [
        "Regulatory uncertainty in major markets",
        "Macroeconomic headwinds",
        "Technical vulnerabilities in DeFi protocols"
      ]
    }, null, 2),
    tags: ['cryptocurrency', 'bitcoin', 'ethereum', 'market-analysis', 'defi'],
    url: null
  },
  {
    category: 'health',
    type: 'text',
    method: 'paste',
    title: 'The Science of Sleep: Optimizing Your Rest for Peak Performance',
    content: `Quality sleep is the foundation of good health, yet millions struggle with sleep issues. Understanding sleep science can help optimize your rest and improve overall well-being.

The Sleep Cycle:
1. Stage 1: Light sleep (5-10 minutes)
2. Stage 2: Deeper relaxation (10-25 minutes)
3. Stage 3: Deep sleep (20-40 minutes)
4. REM Sleep: Dream stage (10-60 minutes)

Tips for Better Sleep:
- Maintain consistent sleep schedule
- Create a cool, dark environment (65-68°F)
- Avoid screens 2 hours before bed
- Limit caffeine after 2 PM
- Exercise regularly but not late evening

Sleep impacts:
- Memory consolidation
- Immune function
- Hormone regulation
- Mental health
- Physical recovery

Aim for 7-9 hours per night. Quality matters more than quantity - focus on uninterrupted, restorative sleep.`,
    tags: ['sleep', 'health', 'wellness', 'performance', 'science'],
    url: null
  },
  {
    category: 'cooking',
    type: 'text',
    method: 'paste',
    title: 'Mastering Sourdough: A Complete Guide',
    content: `Sourdough bread is both an art and a science. This guide will help you create perfect loaves every time.

Starter Recipe:
- 50g whole wheat flour
- 50g all-purpose flour
- 100g filtered water

Feed daily for 7 days, discarding half each time.

Basic Sourdough Recipe:
Ingredients:
- 100g active starter
- 375g water
- 500g bread flour
- 10g salt

Method:
1. Autolyse: Mix flour and water, rest 30 min
2. Add starter and salt, mix well
3. Bulk ferment: 4-6 hours with folds every 30 min
4. Pre-shape, rest 30 min
5. Final shape, cold proof 8-48 hours
6. Bake at 475°F in Dutch oven

Tips:
- Temperature affects timing dramatically
- Use the float test for starter readiness
- Don't rush the process
- Keep detailed notes`,
    tags: ['sourdough', 'baking', 'bread', 'fermentation', 'recipes'],
    url: null
  },
  {
    category: 'education',
    type: 'code',
    method: 'drop',
    title: 'Python Data Analysis Tutorial',
    content: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Python Data Analysis Tutorial
# Learn the fundamentals of data analysis with pandas

# 1. Loading Data
df = pd.read_csv('sales_data.csv')
print(f"Dataset shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")

# 2. Basic Exploration
print(df.head())
print(df.info())
print(df.describe())

# 3. Data Cleaning
# Check for missing values
print(df.isnull().sum())

# Fill missing values
df['price'].fillna(df['price'].mean(), inplace=True)

# 4. Data Analysis
# Group by category
category_sales = df.groupby('category')['revenue'].sum()
print(category_sales)

# Time series analysis
df['date'] = pd.to_datetime(df['date'])
monthly_sales = df.resample('M', on='date')['revenue'].sum()

# 5. Visualization
plt.figure(figsize=(12, 6))

# Sales by category
plt.subplot(1, 2, 1)
category_sales.plot(kind='bar')
plt.title('Sales by Category')
plt.xticks(rotation=45)

# Monthly trend
plt.subplot(1, 2, 2)
monthly_sales.plot(kind='line', marker='o')
plt.title('Monthly Sales Trend')

plt.tight_layout()
plt.show()

# 6. Statistical Analysis
# Correlation matrix
corr_matrix = df[['price', 'quantity', 'revenue']].corr()
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm')
plt.title('Correlation Matrix')
plt.show()

# Key Insights:
# - Category A generates highest revenue
# - Strong positive correlation between price and revenue
# - Seasonal patterns in monthly sales`,
    tags: ['python', 'data-analysis', 'pandas', 'tutorial', 'programming'],
    url: null
  },
  {
    category: 'lifestyle',
    type: 'text',
    method: 'url',
    title: 'Digital Minimalism: Reclaiming Focus in a Distracted World',
    content: `In an age of constant connectivity, digital minimalism offers a path to intentional technology use and improved well-being.

Core Principles:
1. Clutter is costly - Every app and notification has a cognitive price
2. Optimization matters - Use technology to support your values
3. Intentionality is satisfying - Conscious choices lead to fulfillment

Practical Steps:
- Digital Declutter: Remove non-essential apps for 30 days
- Operating Procedures: Define when/how you use specific technologies
- High-Quality Leisure: Replace digital entertainment with meaningful activities

Benefits:
- Improved focus and productivity
- Better sleep quality
- Stronger real-world relationships
- Reduced anxiety and FOMO
- More time for deep work and hobbies

Start small: Choose one digital habit to change this week. Perhaps check email only twice daily or keep your phone outside the bedroom.

Remember: Technology should serve you, not the other way around.`,
    tags: ['productivity', 'minimalism', 'digital-wellness', 'focus', 'mindfulness'],
    url: 'https://calnewport.com/digital-minimalism/'
  },
  {
    category: 'entertainment',
    type: 'web',
    method: 'url',
    title: 'The Evolution of Gaming: From Pixels to Virtual Worlds',
    content: `Gaming has transformed from simple pixels on screens to immersive virtual worlds that rival reality. This evolution represents one of the most dramatic technological advances in entertainment.

Timeline of Gaming Evolution:
- 1970s: Arcade classics (Pong, Space Invaders)
- 1980s: Home consoles rise (NES, Sega)
- 1990s: 3D graphics revolution (PlayStation, N64)
- 2000s: Online gaming explosion (Xbox Live, MMORPGs)
- 2010s: Mobile and indie renaissance
- 2020s: Cloud gaming, VR/AR, AI-powered experiences

Current Trends:
1. Cloud Gaming - Play anywhere without hardware
2. Cross-platform Play - Unite players across devices
3. Games as Service - Continuous content updates
4. Esports - Professional gaming as spectator sport
5. Metaverse Integration - Persistent virtual worlds

The future promises even more: AI-generated content, brain-computer interfaces, and fully immersive virtual reality that blurs the line between game and reality.`,
    tags: ['gaming', 'technology', 'entertainment', 'vr', 'esports'],
    url: 'https://www.youtube.com/watch?v=gaming-evolution-2024'
  }
];

function generateContentId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6);
  return `content-${timestamp}-${random}`;
}

function generateHash(content) {
  // Simple hash for demo (in production, use crypto.createHash)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256-${Math.abs(hash).toString(16).padStart(64, '0')}`;
}

async function createExampleContent() {
  console.log('📝 Adding Example Content to Inbox');
  console.log('=====================================\n');
  
  let created = 0;
  let errors = 0;
  
  for (const example of exampleContent) {
    const id = generateContentId();
    const timestamp = new Date().toISOString();
    
    try {
      // Determine file extension based on type
      let extension = '.txt';
      if (example.type === 'code') extension = '.py';
      else if (example.type === 'data') extension = '.json';
      else if (example.type === 'web') extension = '.html';
      
      // Create storage file
      const storageSubDir = example.type;
      const storagePath = path.join(STORAGE_DIR, storageSubDir, `${id}${extension}`);
      
      // Ensure directory exists
      await fs.promises.mkdir(path.dirname(storagePath), { recursive: true });
      
      // Write content to storage
      await fs.promises.writeFile(storagePath, example.content, 'utf-8');
      
      // Create metadata
      const metadata = {
        id,
        created_at: timestamp,
        updated_at: timestamp,
        status: 'inbox',
        source: {
          method: example.method,
          url: example.url
        },
        content: {
          type: example.type,
          title: example.title,
          full_text: '', // Empty as per optimization
          text: example.content,
          word_count: example.content.split(/\s+/).filter(Boolean).length,
          hash: generateHash(example.content)
        },
        location: {
          inbox_path: `storage/${storageSubDir}/${id}${extension}`,
          final_path: null
        },
        storage: {
          path: `storage/${storageSubDir}/${id}${extension}`,
          type: storageSubDir,
          size: Buffer.byteLength(example.content, 'utf8')
        },
        category: example.category,
        llm_analysis: null,
        tags: example.tags
      };
      
      // Write metadata
      const metadataPath = path.join(METADATA_DIR, `${id}.json`);
      await fs.promises.writeFile(
        metadataPath,
        JSON.stringify(metadata, null, 2) + '\n',
        'utf-8'
      );
      
      created++;
      log.success(`Created ${example.category} content: ${example.title}`);
      log.detail(`Storage: ${storagePath}`);
      log.detail(`Metadata: ${metadataPath}`);
      console.log('');
      
    } catch (error) {
      errors++;
      log.error(`Failed to create ${example.title}: ${error.message}`);
    }
  }
  
  // Summary
  console.log('📊 Summary:');
  console.log('===========');
  log.info(`Total examples: ${exampleContent.length}`);
  log.success(`Created: ${created}`);
  if (errors > 0) {
    log.error(`Errors: ${errors}`);
  }
  
  console.log('\n💡 Note:');
  console.log('Example content has been added to your inbox with proper categories.');
  console.log('Visit http://localhost:3000/inbox to see the news feed style layout.');
  console.log('\nCategories included:');
  const categories = [...new Set(exampleContent.map(e => e.category))];
  categories.forEach(cat => {
    console.log(`  - ${cat}`);
  });
}

// Run the script
createExampleContent().catch(console.error);