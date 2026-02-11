import { FC, useRef, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { Presenter } from 'src/transport/events/events.dto';
import {
  SectionCard,
  StackPresenterDetails,
  StyledAvatar,
  StyledParagraph,
} from '../../single-event.page.styled';
import { Stack } from 'src/components/common/Stack/Stack';
import { useParagraphEllipsis } from '../../__hooks/useParagraphEllipsis';

type EventPresentersProps = {
  presenters: Presenter[];
};
export const EventPresenters: FC<EventPresentersProps> = ({ presenters }) => {
  const [divContainerWidth, setDivContainerWidth] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const ellipsisConfig = useParagraphEllipsis(6);

  useEffect(() => {
    const wrapperRefCurrent = wrapperRef?.current;
    const handleResize = () => {
      if (wrapperRefCurrent) {
        setDivContainerWidth(wrapperRefCurrent.offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (wrapperRefCurrent) {
      resizeObserver.observe(wrapperRefCurrent);
    }

    // Cleanup the observer on unmount
    return () => {
      if (wrapperRefCurrent) {
        resizeObserver.unobserve(wrapperRefCurrent);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <SectionCard>
        <p>Presented by</p>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          {presenters.map((item) => (
            <Col
              span={
                divContainerWidth <= 341 || presenters.length === 1 ? '24' : '8'
              }
            >
              <Stack spacing="loose">
                <StyledAvatar
                  src={
                    item.profileImageUrl ?? 'https://picsum.photos/200/?blur=1'
                  }
                />

                <StackPresenterDetails vertical spacing="none">
                  <span className="presenter-name">{item.name}</span>
                  <span className="presenter-item">{item.role ?? '-'}</span>
                </StackPresenterDetails>

                <StyledParagraph ellipsis={{ ...ellipsisConfig }}>
                  {item.profileDesc}
                </StyledParagraph>
              </Stack>
            </Col>
          ))}
        </Row>
      </SectionCard>
    </div>
  );
};
