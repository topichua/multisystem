import React from 'react';
import { Badge, Typography } from 'antd';
import { Tag } from 'src/components/common/Tag/Tag';

const { Text } = Typography;

type EventState = 'NEW' | 'MISSED' | 'CURRENT';

type EventsCounterProps = {
  state: EventState;
  eventCounter: number;
};

const eventStates: Record<EventState, { color: string; text: string }> = {
  NEW: { color: '#B42318', text: 'new' },
  MISSED: { color: 'orange', text: 'due' },
  CURRENT: { color: 'green', text: 'now' },
};

export const EventsCounter: React.FC<EventsCounterProps> = ({
  state,
  eventCounter,
}) => {
  const { color, text } = eventStates[state];

  return (
    <Tag size="small">
      <Badge color={color} />
      {'  '}
      <Text style={{ color }}>
        {eventCounter} {text}
      </Text>
    </Tag>
  );
};
