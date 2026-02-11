import {
  Eye,
  Lightbulb02,
  MessageCheckCircle,
  MessageXCircle,
  Users02,
  Heart,
  UserCheck01,
  Zap,
} from '@untitled-ui/icons-react';
import { Card, Typography } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Button } from 'src/components/common/Button/Button';
import { Divider } from 'src/components/common/Divider/Divider';

import { Stack } from 'src/components/common/Stack/Stack';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout.tsx';
import { CommunitiyDto } from 'src/transport/communities/communities.dto';
import { isUserAdmin } from 'src/utils/post/user.ts';
import { formatSingular } from 'src/utils/text';
import { CountLabels } from 'src/utils/text-consts';

type CommunityDetailsCardProps = {
  community: CommunitiyDto;
  canNavigateToSettings?: boolean;
  likesCount?: number;
  joinedAt?: Date | null;
};

const { Paragraph, Text } = Typography;

export const CommunityDetailsCard = ({
  community,
  canNavigateToSettings = false,
  likesCount,
  joinedAt,
}: CommunityDetailsCardProps) => {
  const navigate = useNavigate();
  const categories = community?.categories.map((c) => c.name);

  const { user } = useCurrentUserStore();
  const isAdmin = isUserAdmin(user);

  return (
    <Card>
      <Stack vertical>
        <Stack wrap={false}>
          <Lightbulb02 />
          <Paragraph strong>
            {categories?.length ? categories.join(', ') : 'Uncategorized'}
          </Paragraph>
        </Stack>
        {joinedAt && (
          <Stack wrap={false}>
            <UserCheck01 />
            <Stack vertical spacing="none">
              <Paragraph strong style={{ margin: 0 }}>
                Member since
              </Paragraph>
              <Text type="secondary">
                {dayjs(joinedAt).format('MMMM D, YYYY')}
              </Text>
            </Stack>
          </Stack>
        )}
        {isAdmin && (
          <Stack wrap={false}>
            <UserCheck01 />
            <Stack vertical spacing="none">
              <Paragraph strong style={{ margin: 0 }}>
                Created date
              </Paragraph>
              <Text type="secondary">
                {dayjs(community.createdAt).format('MMMM D, YYYY')}
              </Text>
            </Stack>
          </Stack>
        )}
        {community.latestActivity && (
          <Stack wrap={false}>
            <Zap />
            <Stack vertical spacing="none">
              <Paragraph strong style={{ margin: 0 }}>
                Last activity
              </Paragraph>
              <Text type="secondary">
                {dayjs(community.latestActivity).format('MMMM D, YYYY')}
              </Text>
            </Stack>
          </Stack>
        )}
        <Stack vertical>
          <Stack wrap={false}>
            <Users02 />
            <Paragraph strong style={{ margin: 0 }}>
              {formatSingular(community?.membersCount, CountLabels.MEMBERS)}
            </Paragraph>
          </Stack>
          <Stack wrap={false}>
            <Eye />
            <Paragraph strong style={{ margin: 0 }}>
              {formatSingular(community?.viewsCount, CountLabels.VIEWS)}
            </Paragraph>
          </Stack>
          <Stack wrap={false}>
            <Heart />
            <Paragraph strong style={{ margin: 0 }}>
              {formatSingular(likesCount || 0, CountLabels.LIKES)}
            </Paragraph>
          </Stack>
        </Stack>

        <Stack wrap={false}>
          {community?.isPublic ? <MessageCheckCircle /> : <MessageXCircle />}

          <Stack vertical spacing="none">
            <Paragraph strong style={{ margin: 0 }}>
              {community?.isPublic ? 'Public' : 'Private'}
            </Paragraph>

            <Text type="secondary">
              {community?.isPublic
                ? 'This community is open to everyone and can be found by anyone.'
                : 'Only invited participants can find this community.'}
            </Text>
          </Stack>
        </Stack>
        {canNavigateToSettings && (
          <>
            <Divider />
            <Button
              type="primary"
              onClick={() =>
                navigate(`/admin/community/${community.id}/settings`)
              }
            >
              Change admin settings
            </Button>
          </>
        )}
      </Stack>
    </Card>
  );
};
