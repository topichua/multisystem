import { ChevronLeft, ChevronRight } from '@untitled-ui/icons-react';
import { Empty } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { Card } from 'src/components/common/Card/Card';
import { Presenter } from 'src/transport/events/events.dto';

import { HostItemComponent } from '../host-item-component/host-item-component';

import * as S from './hosts-component.styled';

type HostsComponentProps = {
  presenters: Presenter[];
};

export const HostsComponent = ({ presenters }: HostsComponentProps) => {
  return (
    <Card
      title={
        <Stack distribution="equalSpacing" alignment="center">
          <Title fontWeight={600} level={5}>
            Meet your hosts
          </Title>

          <Stack spacing="extraTight" alignment="center">
            <S.Icon>
              <ChevronLeft />
            </S.Icon>

            <S.Icon>
              <ChevronRight />
            </S.Icon>
          </Stack>
        </Stack>
      }
    >
      <S.ScrollWrapper align={presenters.length === 0}>
        {presenters.length ? (
          <>
            {presenters.map((presenter, index) => (
              <HostItemComponent key={index} presenter={presenter} />
            ))}
          </>
        ) : (
          <Empty description="No presenters yet" />
        )}
      </S.ScrollWrapper>
    </Card>
  );
};
