/**
 * @file pages/StoragePage.tsx
 * @purpose Storage page wrapper
 * @layer page
 * @deps [InboxLayout, StorageView, ContentInboxProvider]
 * @used-by [Router]
 * @llm-read true
 * @llm-write full-edit
 * @llm-role entrypoint
 */

import { BaseLayout } from '@/layout/BaseLayout';
import { StorageView } from '@/features/storage';

export function StoragePage() {
  return (
    <BaseLayout>
      <StorageView />
    </BaseLayout>
  );
}