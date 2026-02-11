export enum CountLabels {
  LIKES = 'like',
  VIEWS = 'view',
  COMMENTS = 'comment',
  MEMBERS = 'member',
  REPORTS = 'report',
  POSTS = 'post',
  COMMUNITIES = 'community',
  MEEETINGS = 'meeting',
  NEWS = 'news',
  RESOURCES = 'resource',
  EVENTS = 'items',
}

interface FormatOptions {
  singular: string;
  plural: string;
  empty?: string;
}

export const formatOptionsMap: Record<CountLabels, FormatOptions> = {
  [CountLabels.LIKES]: {
    singular: 'like',
    plural: 'likes',
    empty: 'No likes yet',
  },
  [CountLabels.VIEWS]: {
    singular: 'view',
    plural: 'views',
    empty: 'No views yet',
  },
  [CountLabels.COMMENTS]: {
    singular: 'comment',
    plural: 'comments',
    empty: 'No comments yet',
  },
  [CountLabels.MEMBERS]: {
    singular: 'member',
    plural: 'members',
    empty: 'No members yet',
  },
  [CountLabels.REPORTS]: {
    singular: 'report',
    plural: 'reports',
    empty: 'No reports yet',
  },
  [CountLabels.POSTS]: {
    singular: 'post',
    plural: 'posts',
    empty: 'No posts yet',
  },
  [CountLabels.COMMUNITIES]: {
    singular: 'community',
    plural: 'communities',
    empty: 'No communities yet',
  },
  [CountLabels.MEEETINGS]: {
    singular: 'meeting',
    plural: 'meetings',
    empty: 'No meetings yet',
  },
  [CountLabels.NEWS]: {
    singular: 'news',
    plural: 'news',
    empty: 'No news yet',
  },
  [CountLabels.RESOURCES]: {
    singular: 'resource',
    plural: 'resources',
    empty: 'No resources yet',
  },
  [CountLabels.EVENTS]: {
    singular: 'item',
    plural: 'items',
    empty: '0 items',
  },
};

export enum CommunityMemberRolesLabels {
  Member = 'Member',
  Moderator = 'Moderator',
  Editor = 'Editor',
}
