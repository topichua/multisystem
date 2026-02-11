import {
  AnnotationQuestion,
  DotsVertical,
  ImageUserPlus,
  List,
  LogOut04,
  UserRight02,
} from '@untitled-ui/icons-react';
import {
  Dropdown,
  Empty,
  notification,
  Table,
  TableColumnsType,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { FC, useState } from 'react';

import { Button } from 'src/components/common/Button/Button';
import { ConfirmModal } from 'src/components/common/Modal/ConfirmModal';
import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import MemberBanReasonModal from 'src/pages/admin-pages/admin-community/__components/member_ban_reason_modal/member_ban_reason_modal.tsx';

import {
  BlockedUser,
  CommunityMember,
  CommunityRole,
  CommunityStatus,
} from 'src/transport/communities/communities.dto';

import { compact, noop } from 'lodash';
import { CommunityMemberRolesLabels } from 'src/utils/text-consts';
import { useCommunityManagementStore } from '../../admin-community.provider';
import { ChangeMemberRoleModal } from '../change-member-role-modal/change-member-role-modal';
import { JoinAnswersModal } from '../join-answers-modal/join-answers-modal';

export const COLUMN_STATUS_KEY = 'status';
export const COLUMN_ACTIONS_KEY = 'actions';
export const COLUMN_ROLE_KEY = 'role';
export const COLUMN_DATE_KEY = 'date';
export const COLUMN_REMOVED_STATUS = 'removed_status';

const { Text, Paragraph } = Typography;

type MembersTableProps = {
  members: (CommunityMember | BlockedUser)[];
  currentPage: number;
  isLoading?: boolean;
  canMemberAction?: (member: CommunityMember) => boolean;
  onChangeCurrentPage: (page: number) => void;
  columns?: (
    columns: TableColumnsType<CommunityMember>
  ) => TableColumnsType<CommunityMember>;
};

export const MembersTable = observer<FC<MembersTableProps>>(
  ({
    members,
    currentPage,
    isLoading = false,
    canMemberAction,
    onChangeCurrentPage,
    columns = noop,
  }) => {
    const {
      isChangeMemberRoleLoading,
      isRemoveMemberLoading,
      loadCommunity,
      changeMemberRole,
      loadMembers,
      removeMember: deleteMember,
      banMembers,
      isBanMembersLoading,
    } = useCommunityManagementStore();

    const [selectedMemberToChangeRole, setSelectedMemberToChangeRole] =
      useState<CommunityMember | null>(null);
    const [selectedMemberToDelete, setSelectedMemberToDelete] =
      useState<CommunityMember | null>(null);
    const [selectedMemberToApprove, setSelectedMemberToApprove] =
      useState<CommunityMember | null>(null);
    const [selectedMemberToJoinAnswers, setSelectedMemberToJoinAnswers] =
      useState<CommunityMember | null>(null);
    const [selectedMemberToBan, setSelectedMemberToBan] = useState<
      string | null
    >(null);

    const editMemberRole = (newRole: CommunityRole) => {
      changeMemberRole({
        role: newRole,
        userId: selectedMemberToChangeRole?.userId as string,
      })
        .then(() => {
          setSelectedMemberToChangeRole(null);
          loadMembers();
        })
        .catch((e) => {
          notification.error({ message: `Error updating member role:, ${e}` });
        });
    };

    const removeMember = () => {
      deleteMember(selectedMemberToDelete?.userId as string)
        .then(() => {
          setSelectedMemberToDelete(null);
          loadMembers();
          loadCommunity();
        })
        .catch((e) => {
          notification.error({ message: `Error removing member:, ${e}` });
        });
    };

    const approveMember = () => {
      changeMemberRole({
        status: CommunityStatus.Joined,
        userId: selectedMemberToApprove?.userId as string,
      })
        .then(() => {
          setSelectedMemberToApprove(null);
          loadMembers();
          loadCommunity();
        })
        .catch((e) => {
          notification.error({ message: `Error approving member:, ${e}` });
        });
    };

    const _columns: TableColumnsType<CommunityMember> = [
      {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_, member) => (
          <Stack alignment="center" spacing="tight">
            <UserAvatar
              shape="circle"
              firstName={member.firstName || 'Test'}
              lastName={member.lastName || 'Test'}
              src={member.avatarUrl}
            />

            <Paragraph
              style={{ marginBottom: 0 }}
            >{`${member.firstName || 'Test'} ${member?.lastName || 'Test'}`}</Paragraph>
            {member.pronoun && <Text type="secondary">({member.pronoun})</Text>}
          </Stack>
        ),
        width: 250,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (_, member) => <Text>{member?.email || '-'}</Text>,
        width: 200,
      },
      {
        title: 'Role',
        dataIndex: COLUMN_ROLE_KEY,
        key: COLUMN_ROLE_KEY,
        render: (_, member) => {
          if (member.role === CommunityRole.Member)
            return (
              <Tag color="success">{CommunityMemberRolesLabels.Member}</Tag>
            );

          if (member.role === CommunityRole.CommunityMoModerator)
            return (
              <Tag color="error">{CommunityMemberRolesLabels.Moderator}</Tag>
            );

          if (member.role === CommunityRole.Editor)
            return <Tag color="blue">{CommunityMemberRolesLabels.Editor}</Tag>;
          return null;
        },

        width: 150,
      },
      {
        title: 'Pending verification',
        dataIndex: 'status',
        key: COLUMN_STATUS_KEY,
        render: (_, member) =>
          member.status === CommunityStatus.Awaiting ? (
            <Tag color="warning">Awaiting approve</Tag>
          ) : null,
        width: 150,
      },
      {
        title: 'Join date',
        dataIndex: 'date',
        key: COLUMN_DATE_KEY,
        render: (_, member) =>
          member?.joinedAt && (
            <Text> {dayjs(member?.joinedAt).format('MMMM D, YYYY')}</Text>
          ),
        width: 150,
      },
      {
        title: '',
        key: COLUMN_ACTIONS_KEY,
        fixed: 'right',
        // hidden: !canMemberAction,
        width: 50,
        render: (_, member) => {
          if (canMemberAction && !canMemberAction(member)) return null;

          return (
            <Stack distribution="center">
              <Dropdown
                menu={{
                  items: compact([
                    {
                      key: '1',
                      label: 'Change community member role',
                      icon: <UserRight02 width={16} height={16} />,
                      onClick: () => {
                        setSelectedMemberToChangeRole(member);
                      },
                    },
                    member.isHaveAnswers && {
                      key: '5',
                      label: 'View join answers',
                      icon: <AnnotationQuestion width={16} height={16} />,
                      onClick: () => {
                        setSelectedMemberToJoinAnswers(member);
                      },
                    },
                    member.status === CommunityStatus.Awaiting
                      ? {
                          key: '3',
                          label: 'Approve request',
                          icon: <ImageUserPlus width={16} height={16} />,
                          onClick: () => setSelectedMemberToApprove(member),
                        }
                      : null,
                    {
                      key: '4',
                      label: 'Blacklist',
                      icon: <List width={16} height={16} />,
                      onClick: () => {
                        if (member.userId) {
                          setSelectedMemberToBan(member.userId);
                        }
                      },
                    },
                    member.status !== CommunityStatus.Removed && {
                      key: '2',
                      label: 'Remove member',
                      danger: true,
                      icon: <LogOut04 width={16} height={16} />,
                      onClick: () => setSelectedMemberToDelete(member),
                    },
                  ]),
                }}
              >
                <Button type="text" icon={<DotsVertical />} />
              </Dropdown>
            </Stack>
          );
        },
      },
    ];

    return (
      <>
        <Table
          pagination={{
            position: ['bottomCenter'],
            pageSize: 10,
            current: currentPage,
            onChange: onChangeCurrentPage,
          }}
          loading={isLoading || isBanMembersLoading}
          // @ts-expect-error alt
          columns={columns(_columns) ?? _columns}
          dataSource={members}
          rowKey="userId"
          scroll={{ x: 1100 }}
          locale={{ emptyText: !isLoading && <Empty description="No Data" /> }}
        />

        <MemberBanReasonModal
          isOpen={!!selectedMemberToBan}
          isLoading={isBanMembersLoading}
          onClose={() => setSelectedMemberToBan(null)}
          onBan={(reason: string) => {
            banMembers([selectedMemberToBan as string], reason).then(() => {
              loadMembers();
            });
          }}
        />

        <ChangeMemberRoleModal
          isOpen={!!selectedMemberToChangeRole}
          member={selectedMemberToChangeRole}
          isLoading={isChangeMemberRoleLoading}
          onClose={() => setSelectedMemberToChangeRole(null)}
          onSave={editMemberRole}
        />

        <ConfirmModal
          isOpen={!!selectedMemberToDelete}
          confirmButtonProps={{ danger: true }}
          isLoading={isRemoveMemberLoading}
          confirmButtonText="Remove"
          title={`Are you sure you want to remove: ${selectedMemberToDelete?.firstName || ''} ${selectedMemberToDelete?.lastName || ''}`}
          onClose={() => setSelectedMemberToDelete(null)}
          onConfirm={removeMember}
        />

        <ConfirmModal
          isOpen={!!selectedMemberToApprove}
          isLoading={isChangeMemberRoleLoading}
          confirmButtonText="Approve"
          title="Approve"
          description={`Are you sure you want to approve: ${selectedMemberToDelete?.firstName || ''} ${selectedMemberToDelete?.lastName || ''}`}
          onClose={() => setSelectedMemberToApprove(null)}
          onConfirm={approveMember}
        />

        <JoinAnswersModal
          open={!!selectedMemberToJoinAnswers}
          member={selectedMemberToJoinAnswers}
          okButtonProps={{ hidden: true }}
          onCancel={() => setSelectedMemberToJoinAnswers(null)}
        />
      </>
    );
  }
);
