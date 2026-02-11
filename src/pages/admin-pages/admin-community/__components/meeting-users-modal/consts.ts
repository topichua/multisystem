import {
  MeetingMember,
  MeetingStatus,
} from 'src/transport/communities/communities.dto.ts';

type GroupedUsers = Record<MeetingStatus, string[]>;

export const meetingStatusValues = Object.values(MeetingStatus).filter(
  (value) => typeof value === 'number'
);

export const getStatusTitle: Record<MeetingStatus, string> = {
  [MeetingStatus.NoResponse]: 'No response',
  [MeetingStatus.CantGo]: `Can't go`,
  [MeetingStatus.Going]: 'Going',
};

export const getGroupedUsersByStatus = (meetingMembers: MeetingMember[]) => {
  return meetingMembers.reduce((acc: GroupedUsers, user: MeetingMember) => {
    const { status, userId } = user;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(userId);
    return acc;
  }, {} as GroupedUsers);
};
