import { useUpdateEffect } from 'ahooks';
import { Affix, Col, Flex, Row, Skeleton } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityCard } from 'src/components/community/CommunityCard/CommunityCard.tsx';
import * as S from 'src/pages/bookmark/tabs/communities/common.styled.ts';
import { Header } from 'src/pages/home-page/__components/Communities/header.tsx';
import { useCommunities } from 'src/pages/home-page/hooks';
import { CountLabels } from 'src/utils/text-consts.ts';
import { formatSingular } from 'src/utils/text.ts';
import * as ES from '../../home.page.styled.tsx';

const HomePageCommunities = () => {
  const { communities, isLoading: isCommunitiesLoading } = useCommunities();

  const navigate = useNavigate();
  const headerWrapperRef = useRef<HTMLDivElement | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  const visibleCommunities = useMemo(
    () => (isExpanded ? communities : communities?.slice(0, 2)),
    [communities, isExpanded]
  );

  useUpdateEffect(() => {
    if (headerWrapperRef.current && !isExpanded) {
      headerWrapperRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isExpanded]);

  return (
    <>
      <ES.Section style={{ width: '100%' }}>
        <ES.SectionWrapper>
          <Flex
            gap={16}
            vertical
            style={{
              position: 'relative',
            }}
            ref={headerWrapperRef}
          >
            <Affix offsetTop={isExpanded ? 68 : 0}>
              <Header
                isOpen={isExpanded}
                onToggle={toggleExpand}
                showToggle={communities && communities.length > 2}
              />
            </Affix>
            <ES.StyledCommunitiesBlock xl={24} md={24} sm={24} xs={24}>
              <Row gutter={[16, 16]}>
                {isCommunitiesLoading
                  ? [111, 222].map((id) => {
                      return (
                        <Col key={id} span={8} xl={12} md={12} xs={24}>
                          <ES.CommunitySkeleton
                            active
                            style={{ width: '100%', height: '100%' }}
                          />
                          <Skeleton
                            active
                            paragraph={{ rows: 1 }}
                            avatar={false}
                          />
                        </Col>
                      );
                    })
                  : visibleCommunities.map((community) => {
                      return (
                        <Col
                          key={community.id}
                          span={8}
                          xl={12}
                          md={12}
                          sm={12}
                          xs={24}
                        >
                          <CommunityCard
                            id={community.id}
                            bgColor="#FCFCFD"
                            image={
                              community.imageUrl ||
                              'https://shpadevstorage.blob.core.windows.net/images/community/ae5d71fd-f2ab-411b-9170-cf71eb1afdc1'
                            }
                            isAutoJoin={community.isAutoJoin}
                            categoriesName={[]}
                            title={community.name}
                            info={[
                              community.isPublic
                                ? 'Open community'
                                : 'Private community',
                              `${community.membersCount} members`,
                              `${formatSingular(community.likesCount, CountLabels.LIKES)}`,
                              `${formatSingular(community.viewsCount, CountLabels.VIEWS)}`,
                            ]}
                            actions={[
                              <S.ViewCommunityButton
                                block
                                onClick={() =>
                                  navigate(`/communities/${community.alias}`)
                                }
                              >
                                View community
                              </S.ViewCommunityButton>,
                            ]}
                          />
                        </Col>
                      );
                    })}
              </Row>
            </ES.StyledCommunitiesBlock>
          </Flex>
        </ES.SectionWrapper>
      </ES.Section>
    </>
  );
};

export default HomePageCommunities;
