import { useState } from 'react';
import {
  CalendarCheck02,
  ClockFastForward,
  Pencil01,
  Plus,
} from '@untitled-ui/icons-react';

import { Menu } from 'src/components/common/menu/menu';
import { Button } from 'src/components/common/Button/Button';
import { Title } from 'src/components/common/Typography/Title';

import * as S from '../admin-pages-layout.styled';
import { Page } from 'src/components/common/page/page';
import { Result } from 'antd';

export const AdminEventsProvider = () => {
  const [headerTitle, setHeaderTitle] = useState('Upcoming events');

  const handleMenuClick = (e: { key: any }) => {
    switch (e.key) {
      case 'upcoming':
        setHeaderTitle('Upcoming events');
        break;
      case 'past':
        setHeaderTitle('Past events');
        break;
      case 'drafts':
        setHeaderTitle('Drafts');
        break;
      default:
        setHeaderTitle('Upcoming events');
    }
  };
  return (
    <S.Container>
      <S.LeftSideHeader>
        <Title level={4}>Events</Title>
      </S.LeftSideHeader>
      <S.RightSideHeader>
        <Title level={4}>{headerTitle}</Title>
      </S.RightSideHeader>
      <S.InnerSider>
        <Button block type="primary" icon={<Plus />}>
          Create new event
        </Button>
        <Menu
          mode="inline"
          defaultOpenKeys={['published']}
          defaultSelectedKeys={['upcoming']}
          onClick={handleMenuClick}
          items={[
            {
              label: 'Published events',
              key: 'published',
              children: [
                {
                  label: 'Upcoming',
                  icon: <ClockFastForward />,
                  key: 'upcoming',
                },
                {
                  label: 'Past',
                  icon: <CalendarCheck02 />,
                  key: 'past',
                },
                {
                  label: 'Drafts',
                  icon: <Pencil01 />,
                  key: 'drafts',
                },
              ],
            },
          ]}
        />
      </S.InnerSider>
      <S.InnerContent>
        <Page.Content style={{ width: 1064, minHeight: 500, margin: '0 auto' }}>
          <Result
            status="500"
            title="Oops!"
            subTitle="Sorry, page is under construction!"
          />
        </Page.Content>
      </S.InnerContent>
    </S.Container>
  );
};
