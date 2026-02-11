import { useMemo } from 'react';
import { Dropdown, Space, notification } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';

import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { AgreementModal } from 'src/pages/explore-community/components/Content/AgreementModal.tsx';
import { components } from 'src/styled/definitions/colors';
import {
  CommunitiyDto,
  CommunityStatus,
} from 'src/transport/communities/communities.dto';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';

import { useToggleJoinCommunity } from '../../__hooks/useToggleJoinCommunity';

type HeaderActionsProps = {
  isAdmin: boolean;
  community: CommunitiyDto | null;
  status: CommunityStatus | null;
  onToggleJoinCommunity: (isJoined: boolean) => void;
};

export const HeaderActions = ({
  isAdmin,
  community,
  status,
  onToggleJoinCommunity,
}: HeaderActionsProps) => {
  const [
    isOpenLeaveCommunityModal,
    { setTrue: openLeaveCommunityModal, setFalse: closeLeaveCommunityModal },
  ] = useBoolean(false);

  const [
    isOpenAgreementModal,
    { setTrue: openAgreementModal, set: setAgreementModalVisible },
  ] = useBoolean(false);

  const { isLoading: isToggleJoinCommunityLoading, toggleJoinCommunity } =
    useToggleJoinCommunity(
      status === CommunityStatus.Joined,
      community?.id,
      community?.name,
      {
        onSuccess: (isJoined) => {
          closeLeaveCommunityModal();
          onToggleJoinCommunity(isJoined);
        },
        onError: (e) => {
          notification.error({
            message: 'Error leaving community. Try again.',
            description: e?.message,
          });
        },
      }
    );

  const handleJoinCommunity = () => {
    if (community?.isRequireAgreement) {
      openAgreementModal();
    } else {
      toggleJoinCommunity();
    }
  };

  const dropdownItems = useMemo(() => {
    return [
      {
        label: 'Leave Community',
        key: '1',
        onClick: openLeaveCommunityModal,
      },
    ];
  }, []);

  if (isAdmin)
    return (
      <>
        {community?.isAutoJoin && (
          <Tag size="small" color={components.colors.primary}>
            Auto joined
          </Tag>
        )}
      </>
    );

  return (
    <Stack spacing="tight">
      {isAdmin ? (
        <>
          {community?.isAutoJoin && (
            <Tag size="small" color={components.colors.primary}>
              Auto joined
            </Tag>
          )}
        </>
      ) : (
        <>
          {status === CommunityStatus.Joined ? (
            <Dropdown
              menu={{
                items: dropdownItems,
              }}
              trigger={['click']}
            >
              <Button>
                <Space>
                  Joined
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <>
              {community?.isAutoJoin ? (
                <Tag size="small" color={components.colors.primary}>
                  Auto joined
                </Tag>
              ) : (
                <Button
                  type="primary"
                  loading={isToggleJoinCommunityLoading}
                  onClick={handleJoinCommunity}
                >
                  Join community
                </Button>
              )}
            </>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={isOpenLeaveCommunityModal}
        confirmButtonProps={{ danger: true }}
        title="Leave Community?"
        description={`Are you sure you want to leave ${community?.name}? You can also turn off notifications for new posts.`}
        isLoading={isToggleJoinCommunityLoading}
        onClose={closeLeaveCommunityModal}
        onConfirm={toggleJoinCommunity}
      />

      <AgreementModal
        currentCommunity={community}
        setIsModalVisible={setAgreementModalVisible}
        isModalVisible={isOpenAgreementModal}
        onConfirm={toggleJoinCommunity}
      />
    </Stack>
  );
};
