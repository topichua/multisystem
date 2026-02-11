import { useBoolean } from 'ahooks';
import { Col, Row, Spin, notification } from 'antd';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { observer } from 'mobx-react';

import { Page } from 'src/components/common/page/page';
import { CommunityAboutCard } from 'src/components/community/CommunityAboutCard/CommunityAboutCard';
import { CommunityDetailsCard } from 'src/components/community/CommunityDetailsCard/CommunityDetailsCard';
import { communityApi } from 'src/transport/communities/communities.api';

import { useCommunityManagementStore } from '../../admin-community.provider';

export const AdminCommunityAboutPage = observer(() => {
  const {
    isCommunityAboutLoading,
    communityAbout,
    community,
    loadCommunityAbout,
  } = useCommunityManagementStore();

  useEffect(() => {
    if (communityAbout === null) loadCommunityAbout();
  }, []);

  const [isPublishing, { setTrue: publishStart, setFalse: publishEnd }] =
    useBoolean(false);

  const editAbout = async (content: string) => {
    if (!community?.id) return;

    publishStart();

    await communityApi
      .editAbout(community.id, content)
      .then(() => {
        loadCommunityAbout();
        notification.success({ message: 'Successfully saved' });
      })
      .catch((e) => {
        notification.error({
          message: 'Error creating/editing category. Try again.',
          description: (e as AxiosError)?.message,
        });
      })
      .finally(publishEnd);
  };
  return (
    <Page.Content>
      <Row gutter={[16, 16]}>
        <Col sm={14} xs={24}>
          <Spin spinning={isCommunityAboutLoading}>
            <CommunityAboutCard
              about={communityAbout}
              canEdit
              isLoading={isPublishing}
              onEdit={editAbout}
            />
          </Spin>
        </Col>
        <Col sm={10} xs={24}>
          {community && (
            <CommunityDetailsCard community={community} canNavigateToSettings />
          )}
        </Col>
      </Row>
    </Page.Content>
  );
});
