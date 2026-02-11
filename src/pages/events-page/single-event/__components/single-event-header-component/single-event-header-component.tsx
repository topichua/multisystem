import { Camera01, Cursor02, Tag01 } from '@untitled-ui/icons-react';
// import { useBoolean } from 'ahooks';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { Card } from 'src/components/common/Card/Card';

import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { Title } from 'src/components/common/Typography/Title';
// import { EventQueryModal } from './event-query-modal/event-query-modal';
import { EventResponse } from 'src/transport/events/events.dto';
import { formatDateTime } from 'src/utils/date-time';

import * as S from './single-event-header-component.styled';

const { Text } = Typography;

const iconSize = {
  height: 12,
  width: 12,
};

export const SingleEventHeaderComponent = ({
  featureImg,
  shortDesc,
  title,
  eventStartUtc,
  eventEndUtc,
  type,
  address,
  // id,
  tags,
}: EventResponse) => {
  // const rsvpItems: MenuProps['items'] = [
  //   {
  //     label: 'Going',
  //     key: '1',
  //     icon: <CheckCircle {...iconSize} />,
  //     onClick: openPaidModal,
  //   },
  //   {
  //     label: "Can't attend",
  //     key: '2',
  //     icon: <XCircle {...iconSize} />,
  //   },
  // ];

  // const actionsItems: MenuProps['items'] = [
  //   {
  //     label: 'Bookmark',
  //     key: '1',
  //     icon: <Bookmark {...iconSize} />,
  //     // onClick: openPaidModal,
  //   },
  //   {
  //     label: 'Add to calendar',
  //     key: '2',
  //     icon: <CalendarPlus02 {...iconSize} />,
  //   },
  //   {
  //     label: 'Copy event link',
  //     key: '3',
  //     icon: <Link01 {...iconSize} />,
  //   },
  //   {
  //     label: 'Add requirements',
  //     key: '4',
  //     icon: <Settings04 {...iconSize} />,
  //   },
  // ];

  // const [
  //   isEventQueryModalOpen,
  //   { setTrue: openEventQueryModalOpen, setFalse: closeEventQueryModalOpen },
  // ] = useBoolean(false);

  return (
    <>
      <Card>
        <Stack distribution="equalSpacing" wrap={false}>
          <Stack.Item fill>
            <Stack vertical alignment="fill">
              {eventStartUtc && (
                <S.DayWrapper>
                  <S.DayWrapperLine />
                  {dayjs(eventStartUtc).date()}
                </S.DayWrapper>
              )}

              <S.DateText>
                {eventStartUtc ? formatDateTime(eventStartUtc) : ''} -{' '}
                {eventEndUtc ? formatDateTime(eventEndUtc) : ''}
              </S.DateText>
              <Stack vertical spacing="none">
                <Title fontWeight={600} level={4}>
                  {title}
                </Title>
                {shortDesc && <Text>{shortDesc}</Text>}
              </Stack>

              <Stack spacing="extraTight" alignment="center">
                <Stack.Item fill>
                  <Stack spacing="extraTight">
                    {address && (
                      <Tag size="small" icon={<Cursor02 {...iconSize} />}>
                        {address}
                      </Tag>
                    )}
                    {type && (
                      <Tag size="small" icon={<Camera01 {...iconSize} />}>
                        {type}
                      </Tag>
                    )}
                    {tags?.map((item) => {
                      return (
                        <Tag
                          key={item.id}
                          size="small"
                          icon={<Tag01 {...iconSize} />}
                        >
                          {item.label}
                        </Tag>
                      );
                    })}

                    {/* <Tag size="small" icon={<Briefcase01 {...iconSize} />}>
                        CPD
                      </Tag> */}
                  </Stack>
                </Stack.Item>

                {/* <Dropdown trigger={['click']} menu={{ items: actionsItems }}>
                <Button
                  type="link"
                  icon={<DotsVertical height={16} width={16} />}
                />
              </Dropdown> */}
              </Stack>
            </Stack>
          </Stack.Item>
          <Stack distribution="trailing" alignment="trailing" vertical>
            {/* <Button onClick={openEventQueryModalOpen}>Send event query</Button> */}
            {featureImg && (
              <S.ImageWrapper>
                <img src={featureImg} alt="event image" />
              </S.ImageWrapper>
            )}
          </Stack>
        </Stack>
      </Card>
      {/* <EventQueryModal
        eventId={id}
        isOpen={isEventQueryModalOpen}
        onClose={closeEventQueryModalOpen}
      /> */}
    </>
  );
};
