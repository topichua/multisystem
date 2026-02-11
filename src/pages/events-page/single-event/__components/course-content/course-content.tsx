import { FC } from 'react';
import {
  SectionCard,
  SectionContentCard,
  StyledAvatar,
  StyledParagraph,
  Text,
} from '../../single-event.page.styled';
import { Stack } from 'src/components/common/Stack/Stack';
import { Course } from 'src/transport/events/events.dto';
import { Col, Row } from 'antd';
import { useParagraphEllipsis } from '../../__hooks/useParagraphEllipsis';

type CourseContentProps = {
  courses?: Course[];
};
export const CourseContent: FC<CourseContentProps> = ({ courses }) => {
  const ellipsisConfig = useParagraphEllipsis();

  return (
    <SectionCard titleHasBottomMargin>
      <p>Course content</p>

      <Row gutter={[16, 16]}>
        {courses?.map((item) => (
          <Col span={24}>
            <SectionContentCard>
              <Stack wrap={false} spacing="loose">
                <StyledAvatar
                  shape="square"
                  src={
                    item.courseImageUrl ?? 'https://picsum.photos/200/?blur=1'
                  }
                />

                <Stack vertical spacing="tight">
                  <Text style={{ margin: 0 }}>{item.courseTitle}</Text>
                  <StyledParagraph
                    className="paragraph-block"
                    style={{ margin: 0 }}
                    ellipsis={{ ...ellipsisConfig }}
                  >
                    {item.courseDesc}
                  </StyledParagraph>
                </Stack>
              </Stack>
            </SectionContentCard>
          </Col>
        ))}
      </Row>
    </SectionCard>
  );
};
