import { Typography } from 'antd';
import { ReactNode } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import { UserProfileDto } from 'src/transport/account/account.dto';

const { Text, Paragraph } = Typography;

type CollapseLabelProps = {
  title: ReactNode;
  subtitle: ReactNode;
  user?: UserProfileDto;
  actions?: ReactNode;
};

export const CollapseLabel = ({
  title,
  subtitle,
  actions,
  user,
}: CollapseLabelProps) => {
  return (
    <Stack alignment="center" wrap={false}>
      <Stack.Item>
        <UserAvatar
          firstName={user?.firstName || ''}
          lastName={user?.lastName || ''}
          size={40}
          src={user?.avatarUrl}
        />
      </Stack.Item>

      <Stack.Item fill ellipsis>
        <div style={{ flex: 1, width: 0 }}>
          <Text>{title}</Text>

          <Paragraph type="secondary" style={{ margin: 0 }}>
            {subtitle}
          </Paragraph>
        </div>
      </Stack.Item>

      {actions && <Stack.Item>{actions}</Stack.Item>}
    </Stack>
  );
};
