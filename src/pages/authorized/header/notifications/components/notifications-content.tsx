import { Bell01 } from '@untitled-ui/icons-react';
import { Button, Drawer, Popover } from 'antd';
import { FC, ReactNode } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { components } from 'src/styled/definitions/colors';

import * as S from '../notifications.styled';

type NotificationPopoverProps = {
  count?: number;
  isPopoverOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: ReactNode;
};

export const NotificationPopover: FC<NotificationPopoverProps> = ({
  count,
  isPopoverOpen,
  onOpenChange,
  content,
}) => {
  return (
    <Popover
      open={isPopoverOpen}
      onOpenChange={onOpenChange}
      content={content}
      trigger="click"
      placement="bottomRight"
      arrow={false}
      overlayInnerStyle={{
        padding: 4,
        paddingRight: 0,
        overflow: 'hidden',
      }}
      overlayStyle={{ width: 460 }}
    >
      <S.Badge
        size="small"
        count={count}
        offset={[-3, 3]}
        color={components.colors.brandColor}
      >
        <Button icon={<Bell01 />} type="text" />
      </S.Badge>
    </Popover>
  );
};

type NNotificationDrawerProps = {
  count?: number;
  isDrawerOpen: boolean;
  toggleDrawerOpen: () => void;
  content: ReactNode;
  titleCounter: number;
};

export const NotificationDrawer: FC<NNotificationDrawerProps> = ({
  count,
  isDrawerOpen,
  toggleDrawerOpen,
  content,
  titleCounter,
}) => {
  return (
    <>
      <S.Badge
        size="small"
        count={count}
        offset={[-3, 3]}
        color={components.colors.brandColor}
      >
        <Button onClick={toggleDrawerOpen} icon={<Bell01 />} type="text" />
      </S.Badge>

      <Drawer
        title={<TabsHeader titleCounter={titleCounter} />}
        placement="right"
        onClose={toggleDrawerOpen}
        open={isDrawerOpen}
        width="100vw"
        styles={{
          body: {
            padding: 0,
          },
          header: {
            borderBottom: 'none',
            paddingBottom: 0,
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
};

type TabsHeaderProps = { titleCounter: number };

export const TabsHeader: FC<TabsHeaderProps> = ({ titleCounter }) => {
  return (
    <Stack alignment="center" wrap={false} distribution="equalSpacing">
      <S.PopoverTitle>Notifications</S.PopoverTitle>
      <S.PopoverTitle type="secondary">{`(${titleCounter})`}</S.PopoverTitle>
    </Stack>
  );
};
