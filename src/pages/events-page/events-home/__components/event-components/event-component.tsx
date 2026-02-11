import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CurrencyDollar,
  Hash02,
  NavigationPointer01,
  VideoRecorder,
} from '@untitled-ui/icons-react';
import { Empty, Typography } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { EventResponse, Ticket } from 'src/transport/events/events.dto';

import * as S from './event-component.styled';
import { getFullDateShortRangeWithTime } from 'src/utils/date-time';
import { Divider } from 'src/components/common/Divider/Divider';
import { formatPrice } from 'src/utils/text';

const { Text, Paragraph } = Typography;

type EventComponentProps = EventResponse & {
  vertical?: boolean;
  ticket?: Ticket;
  action?: ReactNode;
  onSingleClickRegistration?: () => void;
  bookmark?: ReactNode;
};

const iconSize = {
  width: 14,
  height: 14,
};

export const EventComponent = ({
  id,
  eventStartUtc,
  eventEndUtc,
  shortDesc,
  title,
  featureImg,
  address,
  type,
  vertical = false,
  ticket,
  action,
  bookmark,
  listingImg,
}: EventComponentProps) => {
  const eventDateTime = getFullDateShortRangeWithTime(
    eventStartUtc,
    eventEndUtc,
    true
  );

  return (
    <S.Card vertical={vertical}>
      <Stack
        vertical={vertical}
        alignment={vertical ? 'fill' : 'center'}
        distribution="equalSpacing"
        wrap={false}
        fill={true}
      >
        <Stack.Item fill>
          <Stack vertical={vertical} wrap={false} spacing="loose">
            <S.ImageWrapper vertical={vertical}>
              {featureImg || listingImg ? (
                <img src={featureImg || listingImg} />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </S.ImageWrapper>
            <Stack
              vertical
              spacing="tight"
              style={{
                height: vertical ? '169px' : 'auto',
                overflow: vertical ? 'hidden' : 'visible',
              }}
            >
              <Stack spacing="extraTight" vertical>
                <S.ColoredText>{eventDateTime} </S.ColoredText>

                <Stack distribution="equalSpacing" wrap={false}>
                  <Link to={`/events/${id}`}>
                    <S.Title level={5} ellipsis={{ rows: 2 }} title={title}>
                      {title || '-'}
                    </S.Title>
                  </Link>
                  {vertical ? bookmark : <S.Bookmark>{bookmark}</S.Bookmark>}
                </Stack>

                <Link to={`/events/${id}`}>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    title={shortDesc}
                    style={{ marginBottom: '0' }}
                  >
                    {shortDesc || '-'}
                  </Paragraph>
                </Link>
              </Stack>

              <Stack spacing="extraTight" vertical>
                <S.Text type="secondary">
                  <NavigationPointer01 {...iconSize} />
                  <Stack.Item>{address || '-'}</Stack.Item>
                </S.Text>
                <S.Text type="secondary">
                  <VideoRecorder {...iconSize} /> {type}
                </S.Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack.Item>

        {ticket && (
          <>
            {vertical && <Divider spacing="extraTight" />}

            <Text>Ticket</Text>
            <S.Text type="secondary">
              <CurrencyDollar {...iconSize} /> {formatPrice(ticket.ticketPrice)}
            </S.Text>
            <S.Text type="secondary">
              <Hash02 {...iconSize} /> ticket number - {ticket.ticketNumber}
            </S.Text>
            <S.Text type="secondary" title="Status">
              <AlertCircle {...iconSize} />{' '}
              {ticket?.attendanceStatus || 'Active'}
            </S.Text>
          </>
        )}

        <Stack spacing="tight" wrap={false} distribution="trailing">
          <Stack.Item fill={vertical}>{action}</Stack.Item>
        </Stack>
      </Stack>
    </S.Card>
  );
};
