import { useMemo } from 'react';
import { Briefcase01 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Typography } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { Tag } from 'src/components/common/Tag/Tag';
import { Presenter } from 'src/transport/events/events.dto';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';

import * as S from './host-item-component.styled';

const { Text, Paragraph } = Typography;

const iconSize = {
  width: 16,
  height: 16,
};

type HostItemComponentProps = {
  presenter: Presenter;
};

export const HostItemComponent = ({ presenter }: HostItemComponentProps) => {
  const [isExpanded, { toggle: expand }] = useBoolean(false);

  const { firstName, lastName } = useMemo(() => {
    const parts = presenter.name.split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts[1] || '',
    };
  }, [presenter]);

  return (
    <S.HostCard>
      <Stack vertical alignment="center">
        <UserAvatar
          shape="circle"
          firstName={firstName}
          lastName={lastName}
          size={72}
          src={presenter.profileImageUrl}
        />

        <Stack vertical spacing="extraTight" alignment="center">
          <Title fontWeight={600} level={5}>
            {presenter.name}
          </Title>
          <Stack vertical spacing="none">
            <Paragraph
              type="secondary"
              style={{ textAlign: 'center', marginBottom: 0 }}
              ellipsis={{
                rows: 3,
                expandable: 'collapsible',
                expanded: isExpanded,
                symbol: !isExpanded ? 'More' : 'Less',
                onExpand: expand,
              }}
            >
              {presenter.profileDesc}
            </Paragraph>
          </Stack>
        </Stack>

        <Stack alignment="center" spacing="extraTight">
          <Briefcase01 {...iconSize} />
          <Text type="secondary">{presenter.role}</Text>
        </Stack>

        {presenter?.keywords?.length > 0 && (
          <Stack>
            {presenter?.keywords.map((keyword) => (
              <Tag key={keyword} size="small" color="purple">
                {keyword}
              </Tag>
            ))}
          </Stack>
        )}
      </Stack>
    </S.HostCard>
  );
};
