export interface SearchResponse {
  posts: SearchPostDTO[];
  communities: SearchCommunityDTO[];
  tags: SearchTagDTO[];
}

export interface SearchPostDTO {
  id: string;
  title: string;
  body: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  savedCount: number;
  communityId: string;
  communityAlias: string;
}

export interface SearchCommunityDTO {
  id: string;
  name: string;
  imageUrl?: string;
  membersCount: number;
  postsCount: number;
  likesCount: number;
  viewsCount: number;
  isPublic: boolean;
  alias: string;
}

export interface SearchTagDTO {
  id: string;
  name: string;
  countOfPosts: number;
}
