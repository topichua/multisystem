import { HomeLine } from '@untitled-ui/icons-react';
import { observer } from 'mobx-react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { Tabs } from 'src/components/common/Tabs/Tabs';

export const AdminCommunityLayout = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Stack vertical>
      <FixedContentHeader>
        <InnerPageHeader title="Community home" icon={<HomeLine />} />
        <InnerPageHeader>
          <Tabs
            size="small"
            items={[
              {
                label: 'About',
                key: `/admin/community/${id}/about`,
              },
            ]}
            activeKey={location?.pathname}
            onChange={(key) => navigate(key)}
          />
        </InnerPageHeader>
      </FixedContentHeader>

      <Outlet />
    </Stack>
  );
});
