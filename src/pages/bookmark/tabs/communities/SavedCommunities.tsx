import { Spin } from 'antd';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header.tsx';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header.tsx';
import { Page } from 'src/components/common/page/page.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useBookmarkStore } from 'src/pages/bookmark/bookmark.provider.tsx';
import { CommunitiesList } from 'src/pages/bookmark/tabs/communities/CommunitiesList.tsx';

export const SavedCommunities = observer(() => {
  const { allCommunities, isCommunityLoading, getAllCommunities } =
    useBookmarkStore();

  useEffect(() => {
    getAllCommunities();
  }, [getAllCommunities]);

  return (
    <Spin spinning={isCommunityLoading}>
      <FixedContentHeader>
        <InnerPageHeader
          title={
            !isCommunityLoading
              ? `${allCommunities.length} bookmarked communities`
              : ' '
          }
        />
      </FixedContentHeader>
      <Page.Content>
        <Stack vertical spacing="extraLoose">
          <CommunitiesList communities={allCommunities || []} />
        </Stack>
      </Page.Content>
    </Spin>
  );
});
