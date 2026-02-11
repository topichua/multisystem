import { Certificate01 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Flex, Skeleton } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';

import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import { components } from 'src/styled/definitions/colors';
import { userCpdApi } from 'src/transport/userCpd/userCpd.api';
import {
  CpdRecordDTO,
  UserCpdResponse,
} from 'src/transport/userCpd/userCpd.dto';

import styled from 'styled-components';

import { Period } from './components/cpd.periods';
import * as S from './cpd.periods.styled';

const PeriodSkeletonWrapper = styled(Stack)`
  width: 100%;
  margin-bottom: 16px;
`;

const PeriodSkeleton = styled(Skeleton)`
  & li {
    height: 24px !important;
  }
`;

const FadeIn = styled.div`
  animation: fadeIn 0.7s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const PeriodSkeletonItem: FC = () => (
  <PeriodSkeletonWrapper vertical spacing="loose">
    <Skeleton.Input style={{ width: 260 }} active size="small" />
    <Skeleton.Input style={{ width: 90 }} active size="small" />
    <Skeleton.Input style={{ width: 190 }} active size="small" />

    <PeriodSkeleton
      active
      paragraph={{ rows: 3 }}
      style={{ paddingLeft: 40 }}
      avatar={false}
      title={false}
    />
  </PeriodSkeletonWrapper>
);

export const iconSize = {
  width: 14,
  height: 14,
};

type TPeriod = {
  cpdId?: string;
  cpdPeriodId?: Array<CpdRecordDTO>;
};

export const CpdPeriodsPage = () => {
  const [userCpd, setUserCpd] = useState<UserCpdResponse>();
  const [isUserCpdLoading, { setFalse }] = useBoolean(true);
  const [createCPDUrl, setCreateCPDUrl] = useState<string | null>(null);

  const [, setSelectedPeriod] = useState<TPeriod>();

  const handleItemClick = useCallback((cpdData: TPeriod) => {
    setSelectedPeriod(cpdData);
  }, []);

  useEffect(() => {
    userCpdApi
      .getUserCpds()
      .then((res) => {
        setUserCpd(res);
      })
      .finally(() => setFalse());

    userCpdApi.getCreateCPDEntityUrl().then(({ data }) => {
      setCreateCPDUrl(data);
    });
  }, []);

  const renderContent = useCallback(() => {
    if (isUserCpdLoading) {
      return Array(2)
        .fill(null)
        .map((_, index) => <PeriodSkeletonItem key={index} />);
    }

    return (
      <FadeIn>
        <Stack vertical spacing="loose">
          {userCpd?.data?.periods?.map((period) => {
            return (
              <Period
                startDate={period?.periodStartDate}
                endDate={period?.periodEndDate}
                cpdRecords={[...(period?.cpdRecords || [])]}
                completedTotalHours={period?.completedTotalHours}
                minimumRequiredHours={period?.minimumRequiredHours}
                cpdPeriodId={period?.cpdPeriodId}
                onClick={() => {
                  handleItemClick({
                    cpdId: period?.cpdPeriod,
                    cpdPeriodId: period?.cpdRecords,
                  });
                }}
              />
            );
          })}
        </Stack>
      </FadeIn>
    );
  }, [handleItemClick, isUserCpdLoading, userCpd?.data?.periods]);

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Certificate01 color={components.colors.brandColor} />}
          title={'CPD Tracker'}
          fillChildren
        >
          <Stack distribution="trailing">
            <Button
              type="primary"
              disabled={!createCPDUrl}
              onClick={() => window.open(createCPDUrl as string, '_blank')}
            >
              Add CPD entry
            </Button>
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>
      <S.StylePageContent>
        <ColorBG />
        <Stack
          vertical
          spacing="extraLoose"
          style={{ width: '100%', maxWidth: 900 }}
        >
          <Flex vertical style={{ minWidth: '100%' }} gap={16}>
            {renderContent()}
          </Flex>
        </Stack>
      </S.StylePageContent>
    </>
  );
};

const ColorBG = styled.div`
  position: absolute;
  top: 0;
  z-index: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  background: radial-gradient(circle 600px at 100% 700px, #c9ebff, transparent);
  opacity: 0.45;
`;
