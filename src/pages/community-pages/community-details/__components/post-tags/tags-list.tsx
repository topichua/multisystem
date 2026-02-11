import { StyledTag } from './post-tags.styled';

type TagsListProps = {
  tags: string[];
};

export const TagsList = ({ tags }: TagsListProps) =>
  tags?.map((tag, index) => {
    return (
      <StyledTag key={index} bordered={false} color="#F2F4F7">
        {tag}
      </StyledTag>
    );
  });
