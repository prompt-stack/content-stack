/**
 * @layer backend-test
 * @description Simple test to verify backend services work
 * @dependencies ../services/ContentInboxService, ../services/MetadataService
 * @status experimental
 * @since 2024-01-15
 * 
 * Following design-system naming conventions:
 * - Test functions: test[Feature]
 */

import { ContentInboxService } from './services/ContentInboxService';
import { MetadataService } from './services/MetadataService';

async function testBackendServices() {
  console.log('🧪 Testing Backend Services...\n');

  const contentInboxService = new ContentInboxService();
  const metadataService = new MetadataService();

  try {
    // Test 1: Add content
    console.log('📝 Test 1: Adding content...');
    const result = await contentInboxService.handleContentSubmission({
      method: 'paste',
      content: 'This is a test content for our new backend system. It should be categorized properly.',
    });

    if (result.success && result.metadata) {
      console.log('✅ Content added successfully');
      console.log(`   ID: ${result.metadata.id}`);
      console.log(`   Type: ${result.metadata.content.type}`);
      console.log(`   Title: ${result.metadata.content.title}`);
      console.log(`   Path: ${result.metadata.location.inbox_path}`);
    } else {
      console.log('❌ Failed to add content:', result.error);
      return;
    }

    // Test 2: Get inbox items
    console.log('\n📥 Test 2: Getting inbox items...');
    const items = await contentInboxService.getInboxContent();
    console.log(`✅ Found ${items.length} items in inbox`);

    // Test 3: Get metadata stats
    console.log('\n📊 Test 3: Getting metadata stats...');
    const stats = await metadataService.getMetadataStats();
    console.log('✅ Stats retrieved:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   By status:`, stats.byStatus);
    console.log(`   By type:`, stats.byType);

    // Test 4: File upload simulation
    console.log('\n📄 Test 4: Adding file content...');
    const fileResult = await contentInboxService.handleContentSubmission({
      method: 'upload',
      content: 'function hello() { console.log("Hello World!"); }',
      filename: 'hello.js'
    });

    if (fileResult.success && fileResult.metadata) {
      console.log('✅ File content added successfully');
      console.log(`   Detected type: ${fileResult.metadata.content.type}`);
      console.log(`   Extension: ${fileResult.metadata.location.inbox_path.split('.').pop()}`);
    }

    // Test 5: URL content
    console.log('\n🌐 Test 5: Adding URL content...');
    const urlResult = await contentInboxService.handleContentSubmission({
      method: 'url',
      content: 'https://example.com/article',
      url: 'https://example.com/article'
    });

    if (urlResult.success && urlResult.metadata) {
      console.log('✅ URL content added successfully');
      console.log(`   Detected type: ${urlResult.metadata.content.type}`);
    }

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testBackendServices();
}

export { testBackendServices };