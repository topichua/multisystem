import { Link } from 'react-router-dom';
import { ChevronLeft } from '@untitled-ui/icons-react';
import { Avatar, Button, Typography } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { CommunitiyDto } from 'src/transport/communities/communities.dto';
import { Title } from 'src/components/common/Typography/Title';
import { pagesMap } from 'src/pages/authorized/routes';
import { Tag } from 'src/components/common/Tag/Tag';

import * as S from './sidebar-header.styled';

const { Paragraph, Text } = Typography;

type SidebarHeaderProps = {
  community: CommunitiyDto | null;
};

export const SidebarHeader = ({ community }: SidebarHeaderProps) => {
  const categories = community?.categories.map((c) => c.name);

  return (
    <Stack vertical>
      <Link to={pagesMap.adminPageCommunitiesManagement}>
        <Button
          type="text"
          icon={<ChevronLeft />}
          style={{ paddingLeft: 0, paddingRight: 8 }}
        >
          Back to member view
        </Button>
      </Link>

      <Stack alignment="center">
        <Avatar shape="square" size={36} src={community?.imageUrl} />
        <Paragraph>
          {categories?.length ? categories.join(', ') : 'Uncategorized'}
        </Paragraph>
      </Stack>

      <Stack alignment="center" spacing="tight">
        <Stack
          vertical
          spacing={community?.shortDescription ? 'extraTight' : 'none'}
        >
          <Title level={5}>{community?.name}</Title>
          <Text>{community?.shortDescription}</Text>
        </Stack>
        {community?.isArchived && (
          <Tag color="warning" size="small">
            Archived
          </Tag>
        )}
      </Stack>

      <Stack split="•" spacing="extraTight" alignment="center">
        <S.InfoText>
          {!community?.isPublic ? 'Private community' : 'Open community'}
        </S.InfoText>
        <S.InfoText>{community?.membersCount} members</S.InfoText>
      </Stack>
    </Stack>
  );
};
