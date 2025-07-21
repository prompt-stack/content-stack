/**
 * @page Inbox
 * @route /inbox
 * @cssFile /styles/pages/inbox.css
 * @features ContentInbox
 * @className .inbox__
 */
import { Box } from '@/components/Box';
import { ContentInboxFeature } from '@/features/content-inbox/ContentInboxFeature';

export function InboxPage() {
  return (
    <Box className="inbox__container">
      <h1 className="inbox__title">Content Inbox</h1>
      <div className="inbox__subtitle">
        Drop, paste, upload or link - your content processing pipeline
      </div>
      <ContentInboxFeature />
    </Box>
  );
}