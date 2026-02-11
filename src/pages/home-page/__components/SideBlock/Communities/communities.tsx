import { Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { InternalLink } from 'src/components/common/Link/Link.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { pagesMap } from 'src/pages/authorized/routes.tsx';
import BlockLoading from 'src/pages/home-page/__components/SideBlock/block-loading.tsx';
import * as S from 'src/pages/home-page/__components/SideBlock/Events/events.styles.ts';
import * as CS from 'src/pages/home-page/__components/SideBlock/side-block.styled.ts';
import { useCommunities } from 'src/pages/home-page/hooks';

const Communities = () => {
  const { communitiesPreference, isLoading: isCommunitiesLoading } =
    useCommunities();
  const navigate = useNavigate();

  return (
    <S.UpcomingEvents>
      <Title level={4}>Communities</Title>
      {isCommunitiesLoading ? (
        <BlockLoading />
      ) : (
        communitiesPreference.map((community) => (
          <S.EventStack
            distribution="equalSpacing"
            alignment="center"
            wrap={false}
          >
            <S.EventTitleContainer alignment="center" wrap={false}>
              <Avatar
                shape="square"
                size={40}
                src={
                  community.imageUrl ||
                  'https://shpadevstorage.blob.core.windows.net/images/community/ae5d71fd-f2ab-411b-9170-cf71eb1afdc1'
                }
              />
              <Stack.Item ellipsis>
                <S.EventTitle>{community.name}</S.EventTitle>
              </Stack.Item>
            </S.EventTitleContainer>
            <S.ArrowIcon
              color="#98A2B3"
              onClick={() =>
                navigate(`${pagesMap.communities}/${community.alias}`)
              }
            />
          </S.EventStack>
        ))
      )}
      <InternalLink href={pagesMap.exploreCommunities}>
        <CS.LinkText>Go to communities</CS.LinkText>{' '}
      </InternalLink>
    </S.UpcomingEvents>
  );
};

export default Communities;
