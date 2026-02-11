import { FC } from 'react';
import {
  SectionCard,
  SectionContentCard,
  SectionDescription,
  StyledAvatar,
  Text,
} from '../../single-event.page.styled';
import { CanEnrollLayoutType } from 'src/transport/events/events.dto';
import { Col, Row } from 'antd';

type WhoCanErollProps = {
  sectionDescription: string;
  canEnrollLayout?: Array<CanEnrollLayoutType>;
};

export const WhoCanEnroll: FC<WhoCanErollProps> = ({
  sectionDescription,
  canEnrollLayout,
}) => {
  return (
    <SectionCard>
      <p>Who can enrol</p>

      <SectionDescription>{sectionDescription}</SectionDescription>

      <Row gutter={[16, 16]}>
        {canEnrollLayout?.map((item) => (
          <Col xl={12} lg={12} sm={24} xs={24}>
            <SectionContentCard>
              <StyledAvatar
                src={
                  item.canEnrolImageUrl ?? 'https://picsum.photos/200/?blur=1'
                }
              />
              <Text>{item.canEnrolTitle ?? '-'}</Text>
            </SectionContentCard>
          </Col>
        ))}
      </Row>
    </SectionCard>
  );
};
