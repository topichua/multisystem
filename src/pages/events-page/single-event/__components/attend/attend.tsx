import { Typography } from 'antd';

import { Card } from 'src/components/common/Card/Card';

import * as S from './attend.styled';

const { Text } = Typography;

export const Attend = () => {
  return (
    <Card title="Why attend?">
      <S.List>
        <li>
          <Text type="secondary">
            Start and end each day’s forum program with inspiring insights from
            our keynote speakers
          </Text>
        </li>
        <li>
          <Text type="secondary">
            Start and end each day’s forum program with inspiring insights from
            our keynote speakers
          </Text>
        </li>
        <li>
          <Text type="secondary">
            Start and end each day’s forum program with inspiring insights from
            our keynote speakers
          </Text>
        </li>
        <li>
          <Text type="secondary">
            Start and end each day’s forum program with inspiring insights from
            our keynote speakers
          </Text>
        </li>
      </S.List>
    </Card>
  );
};

// Start and end each day’s forum program with inspiring insights from our keynote speakers
// Stay current in your knowledge - hear about the exciting array of current mental health practice and research activity happening in the occupational therapy space
// Expand your practice knowledge and skills by participating in interactive workshops
// Connect with fellow OTs and meet like-minded professional peers
// Learn about the latest products and services by meeting industry partners
// Achieve up to 10 CPD hours
