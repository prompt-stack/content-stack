/**
 * @file pages/StudioPage.tsx
 * @purpose Multi-channel content creation studio
 * @layer page
 * @deps [StudioFeature, InboxLayout]
 * @used-by [App routing]
 * @css pages/studio.css
 * @llm-read true
 * @llm-write full-edit
 * @llm-role user-facing
 */

import { BaseLayout } from '../layout/BaseLayout';
import { StudioFeature } from '../features/studio/StudioFeature';

export function StudioPage() {
  return (
    <BaseLayout>
      <StudioFeature />
    </BaseLayout>
  );
}