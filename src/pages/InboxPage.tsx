/**
 * @file pages/InboxPage.tsx
 * @purpose Inbox page component
 * @layer page
 * @deps none
 * @used-by [main]
 * @css none
 * @llm-read true
 * @llm-write suggest-only
 * @llm-role entrypoint
 */

/**
 * @page Inbox
 * @route /inbox
 * @cssFile /styles/pages/inbox.css
 * @features ContentInbox
 * @className .inbox__
 */
import { Box } from '@/components/Box';
import { ContentInboxFeature } from '@/features/content-inbox/ContentInboxFeature';
import { InboxLayout } from '@/layout/InboxLayout';
import { ContentInboxProvider } from '@/contexts/ContentInboxContext';
import { useContentQueue } from '@/features/content-inbox/hooks/useContentQueue';

export function InboxPage() {
  // This is now a wrapper component that provides the content queue context
  return <InboxPageContent />;
}

function InboxPageContent() {
  const { queue, isProcessing, addContent } = useContentQueue();
  
  return (
    <ContentInboxProvider value={{ addContent, queue, isProcessing }}>
      <InboxLayout>
        <Box className="inbox__container">
          <ContentInboxFeature />
        </Box>
      </InboxLayout>
    </ContentInboxProvider>
  );
}
