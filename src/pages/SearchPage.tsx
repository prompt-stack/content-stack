/**
 * @file pages/SearchPage.tsx
 * @purpose Search page component
 * @layer page
 * @deps [SearchFeature, BaseLayout]
 * @used-by [main]
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role page
 */

import { SearchFeature } from '@/features/search/SearchFeature';
import { BaseLayout } from '@/layout/BaseLayout';

export function SearchPage() {
  return (
    <BaseLayout>
      <SearchFeature />
    </BaseLayout>
  );
}