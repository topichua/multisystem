import { ChevronDown } from '@untitled-ui/icons-react';
import { Flex } from 'antd';
import { FC } from 'react';

import { components } from 'src/styled/definitions/colors';

import * as S from '../Meetings/home-page-meetings-header.styled.tsx';
import * as ES from '../Meetings/home-page-meetings.styled.tsx';

type UpcomingMeetingsHeaderProps = {
  isOpen: boolean;
  onToggle: () => void;
  showToggle: boolean;
};

export const Header: FC<UpcomingMeetingsHeaderProps> = ({
  isOpen,
  onToggle,
  showToggle,
}) => {
  return (
    <S.UpcomingMeetingsHeader
      align="flex-start"
      justify="space-between"
      $isOpen={isOpen}
    >
      <Flex vertical align="flex-start">
        <ES.MeetingsTitle level={4}>
          Recommended communities for you
        </ES.MeetingsTitle>
      </Flex>
      {showToggle && (
        <ES.ExpandButton
          iconPosition="end"
          icon={<ChevronDown color={components.colors.brandColor} />}
          type="text"
          onClick={onToggle}
          $isOpen={isOpen}
        >
          {isOpen ? 'Show less' : 'See all'}
        </ES.ExpandButton>
      )}
    </S.UpcomingMeetingsHeader>
  );
};
