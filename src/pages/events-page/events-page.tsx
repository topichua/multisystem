import {
  Calendar,
  CalendarCheck01,
  ClockRewind,
  Compass03,
  ChevronRight,
  // CalendarDate,
  // Certificate01,
  // Mail02,
  // Settings03,
  // ClockCheck,
} from '@untitled-ui/icons-react';
import { Layout } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'src/components/common/menu/menu';
import { Page } from 'src/components/common/page/page';
import { pagesMap } from '../authorized/routes';
import { Stack } from 'src/components/common/Stack/Stack';
// import { EventsCounter } from './__components/events-counter/events-counter';
import { useEventsDiscoverPath } from './__hooks/useRoutes';

const ICON_DIMENSIONS = { width: 16, height: 16 };

export const EventsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const discoverCpdAndEventsPath = useEventsDiscoverPath();

  const getItems = useCallback(() => {
    const items: Array<ItemType> = compact([
      {
        key: pagesMap.events,
        label: 'Home',
        icon: <Calendar {...ICON_DIMENSIONS} />,
      },
      {
        key: discoverCpdAndEventsPath,
        label: (
          <Stack alignment="center" distribution="equalSpacing">
            <Stack.Item>Discover CPD & Events</Stack.Item>
            <ChevronRight style={{ display: 'flex' }} width={16} height={16} />
          </Stack>
        ),
        icon: <Compass03 {...ICON_DIMENSIONS} />,
      },
      {
        key: '2',
        label: 'My events',
        children: [
          {
            key: pagesMap.eventsAttending,
            label: (
              <Stack alignment="center" distribution="equalSpacing">
                <Stack.Item>Attending</Stack.Item>
              </Stack>
            ),
            icon: <CalendarCheck01 {...ICON_DIMENSIONS} />,
          },
          {
            key: pagesMap.eventsPastEvents,
            label: (
              <Stack alignment="center" distribution="equalSpacing">
                <Stack.Item>My past events</Stack.Item>
              </Stack>
            ),

            icon: <ClockRewind {...ICON_DIMENSIONS} />,
          },
          // {
          //   key: pagesMap.eventsMyInvites,
          //   label: (
          //     <Stack alignment="center" distribution="equalSpacing">
          //       <Stack.Item>My invites</Stack.Item>
          //       <EventsCounter state="NEW" eventCounter={3} />
          //     </Stack>
          //   ),
          //   icon: <Mail02 {...ICON_DIMENSIONS} />,
          // },
          // {
          //   key: '',
          //   label: 'My requirements',
          //   icon: <Settings03 {...ICON_DIMENSIONS} />,
          // },
        ],
      },
      // {
      //   key: '3',
      //   label: 'Event category',
      //   children: [
      //     {
      //       key: pagesMap.eventsGeneral,
      //       label: 'Events',
      //       icon: <CalendarDate {...ICON_DIMENSIONS} />,
      //     },
      //     {
      //       key: pagesMap.eventsCpd,
      //       label: 'CPD',
      //       icon: <Certificate01 {...ICON_DIMENSIONS} />,
      //     },
      //     {
      //       key: 'events-discover-past',
      //       label: 'Discover past events',
      //       icon: <ClockCheck {...ICON_DIMENSIONS} />,
      //     },
      //   ],
      // },
    ]);
    return items;
  }, []);

  return (
    <Layout>
      <Page.Sider title="CPD & Events" fixed>
        {/* <S.SerachBarWrapper>
          <SearchBar
            value={''}
            onChange={() => {}}
            placeholder="Search"
            style={{ margin: '0 auto' }}
          />
        </S.SerachBarWrapper> */}

        <Menu
          mode="inline"
          defaultOpenKeys={['2', '3']}
          selectedKeys={[location?.pathname]}
          onClick={(e) => navigate(e.key)}
          items={getItems()}
        />
      </Page.Sider>
      <Page.Content noPadding>
        <Outlet />
      </Page.Content>
    </Layout>
  );
};
