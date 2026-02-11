import { Tour } from 'antd';
import * as React from 'react';
import { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import { useTourSteps } from 'src/pages/authorized/header/useTourSteps.tsx';
import { ALL_CATEGORIES_PARAM } from 'src/pages/news-and-resources/utils/utils';
import { accountAPI } from 'src/transport/account/account.api.ts';
import { useCurrentUserStore } from '../authorization.layout';

import { pagesMap } from '../routes';
import * as S from './header.styled';
import { Notifications } from './notifications/notifications';
import { ExpandingSearchInput } from './search/ExpandingSearchInput';
import { UserProfile } from './user-profile/user-profile';

export const Header = () => {
  const navigate = useNavigate();

  const {
    steps,
    open,
    setOpen,
    currentStep,
    refAccount,
    refCommunity,
    refEvents,
    refNewsResources,
  } = useTourSteps();
  const { user, refreshCurrent } = useCurrentUserStore();

  useEffect(() => {
    if (user?.isFirstLogin) {
      setOpen(true);
      accountAPI.setFirstLogin().then(() => {
        refreshCurrent({ ...user, isFirstLogin: false });
      });
    }
  }, [refreshCurrent, setOpen, user]);

  return (
    <>
      <S.HeaderPlaceholer />
      <S.Header>
        <S.HeaderWrapper>
          <Stack spacing="extraTight">
            <TabButton link={pagesMap.home} text="Home" exact />
            {/*<TabButton link={pagesMap.marketPlace} text="Marketplace" />*/}
            <div ref={refCommunity}>
              <TabButton link={pagesMap.communities} text="Communities" />
            </div>
            <div ref={refEvents}>
              <TabButton link={pagesMap.events} text="CPD & Events" />
            </div>
            <div ref={refNewsResources}>
              <Stack spacing="extraTight">
                <TabButton
                  link={`${pagesMap.news}/${ALL_CATEGORIES_PARAM}`}
                  text="News"
                />
                <TabButton
                  link={`${pagesMap.resources}/${ALL_CATEGORIES_PARAM}`}
                  text="Resources"
                />
              </Stack>
            </div>

            {/* <div>
              <TabButton link={pagesMap.memberContent} text="Member content" />
            </div> */}
          </Stack>
          <Stack alignment="center" spacing="tight">
            <ExpandingSearchInput />
            {/* <Button
              icon={<ShoppingCart03 />}
              onClick={() => console.log('basket click')}
              type="text"
            /> */}

            <div style={{ marginRight: 10 }}>
              <Notifications />
            </div>

            {/* <UserMenu /> */}
            <div ref={refAccount} style={{ borderRadius: 50 }}>
              <UserProfile />
            </div>
          </Stack>
          <Tour
            current={currentStep}
            open={open}
            onClose={() => setOpen(false)}
            steps={steps}
            gap={{ radius: currentStep == 4 ? 50 : 8, offset: 1 }}
            placement={
              currentStep == 0
                ? "center"
                : currentStep == 4
                  ? "bottomLeft"
                  : "bottom"
            }
          />
        </S.HeaderWrapper>
      </S.Header>
    </>
  );
};

type TabButtonProps = {
  text: string;
  link: string;
  target?: string;
  icon?: React.ReactNode;
  exact?: boolean;
};

const TabButton = (props: TabButtonProps) => {
  const location = useLocation();
  const isActive = props.exact
    ? location.pathname === props.link
    : location.pathname.startsWith(props.link);

  if (props.target) {
    return (
      <Button
        href={props.link}
        target={props.target}
        type="text"
        rightIcon={props.icon}
      >
        {props.text}
      </Button>
    );
  }

  return (
    <NavLink to={props.link} target={props.target}>
      {isActive ? (
        <S.HeaderMenuButton>{props.text}</S.HeaderMenuButton>
      ) : (
        <S.Button type="text">{props.text}</S.Button>
      )}
    </NavLink>
  );
};
