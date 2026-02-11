import {
  BookOpen01,
  Briefcase01,
  CalendarCheck01,
  CodeBrowser,
  DotsGrid,
  GraduationHat02,
  Heart,
  IntersectCircle,
  MessageChatCircle,
  Users01,
} from '@untitled-ui/icons-react';
import { Popover, Typography } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import * as S from './user-menu.styled';

const { Text } = Typography;

export const sections = [
  {
    title: 'Social',
    items: [
      {
        id: 1,
        title: 'Communities',
        shortDesc: 'Connect with others who share your interests',
        linkTo: '/communities',
        icon: <Users01 />,
      },
      {
        id: 2,
        title: 'Events',
        shortDesc:
          'Find conferences, get-togethers and other things to do online and in-person',
        linkTo: '/events',
        icon: <CalendarCheck01 />,
      },
      {
        id: 3,
        title: 'Chats',
        shortDesc: 'Message other members and share files directly',
        linkTo: '',
        icon: <MessageChatCircle />,
      },
      {
        id: 4,
        title: 'Members',
        shortDesc: 'Search for members you may know',
        linkTo: '',
        icon: <Heart />,
      },
    ],
  },
  {
    title: 'Professional',
    items: [
      {
        id: 5,
        title: 'Organisations',
        shortDesc: 'Search for other organisations or chapters',
        linkTo: '',
        icon: <IntersectCircle />,
      },
      {
        id: 6,
        title: 'Resources',
        shortDesc: 'Find insights and assets relevant to your field',
        linkTo: '',
        icon: <BookOpen01 />,
      },
      {
        id: 7,
        title: 'Education',
        shortDesc: 'Level up with CPD and skills training',
        linkTo: '',
        icon: <GraduationHat02 />,
      },
      {
        id: 8,
        title: 'Jobs',
        shortDesc: 'Search job listings posted in your network',
        linkTo: '',
        icon: <Briefcase01 />,
      },
    ],
  },
  {
    title: 'More from Logolpsum',
    items: [
      {
        id: 9,
        title: 'Website',
        linkTo: '',
        icon: <CodeBrowser />,
      },
    ],
  },
];

export const UserMenu = () => {
  const [open, setOpen] = React.useState(false);

  const menuContent = () => {
    const itemStyle = { height: '100%', display: 'flex', alignItems: 'center' };
    const menuSections = sections.map(({ title, items }: any) => {
      return {
        title: title,
        menu: items.map((item: any) => ({
          key: item.id,
          label: (
            <Link
              onClick={() => {
                setOpen(false);
              }}
              to={item.linkTo}
              style={{ maxWidth: '100%' }}
            >
              <Stack
                vertical
                spacing="none"
                style={{ lineHeight: '20px', padding: '5px 0' }}
              >
                <Text>{item.title}</Text>
                {item.shortDesc && (
                  <Text type="secondary">{item.shortDesc}</Text>
                )}
              </Stack>
            </Link>
          ),
          icon: <S.MenuIconWrapper> {item.icon} </S.MenuIconWrapper>,
          style: itemStyle,
        })),
      };
    });

    return (
      <div style={{ maxHeight: 500, overflow: 'auto' }}>
        <Stack vertical spacing="normal">
          <S.UserMenuTitle level={4}>Menu</S.UserMenuTitle>

          {menuSections.map(({ menu, title }) => (
            <Stack key={title} spacing="none" vertical>
              <S.UserMenuTitle level={5}>{title}</S.UserMenuTitle>
              <S.UserMenu items={menu} style={{ borderInlineEnd: 0 }} />
            </Stack>
          ))}

          <div style={{ padding: '0 12px' }}>
            <Text type="secondary">
              We acknowledge Aboriginal and Torres Strait Islander peoples as
              the First Australians and Traditional Custodians of the lands
              where we live, learn, and work.
            </Text>
          </div>
        </Stack>
      </div>
    );
  };

  return (
    <Popover
      open={open}
      onOpenChange={(val) => setOpen(val)}
      content={menuContent}
      trigger="click"
      placement="bottomRight"
      arrow={false}
      overlayStyle={{ width: 440 }}
    >
      <Button icon={<DotsGrid />} type="text" />
    </Popover>
  );
};
