import { Spin } from 'antd';
import { observer } from 'mobx-react';
import { Page } from 'src/components/common/page/page.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { CommunitiesList } from 'src/pages/explore-community/components/Content/CommunitiesList.tsx';
import { useExploreCommunityStore } from 'src/pages/explore-community/explore-communities.provider.tsx';

export const Content = observer(() => {
  const { allCommunities, isCommunityLoading, isCategoryLoading } =
    useExploreCommunityStore();

  return (
    <Spin spinning={isCommunityLoading || isCategoryLoading}>
      <Page.Content>
        <Stack vertical spacing="extraLoose">
          {!isCommunityLoading && (
            <CommunitiesList communities={allCommunities || []} />
          )}
        </Stack>
      </Page.Content>
    </Spin>
  );
});
