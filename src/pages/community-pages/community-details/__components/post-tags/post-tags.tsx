import { Spin, Typography } from 'antd';
import noop from 'lodash/noop';
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { communityTagsApi } from 'src/transport/communities/community.tag.api';

import { StyledHeader, Wrapper } from './post-tags.styled';
import { TagsDropdown } from './tags-dropdown';
import { TagsList } from './tags-list';

const { Text } = Typography;
interface PostTagsProps {
  label?: string | ReactNode;
  note?: string;
  selectedTags: string[];
  reverseOrder?: boolean;
  readonly?: boolean;
  onTagSelect?: (selected: string[]) => void;
}

export const PostTags = ({
  selectedTags,
  label = 'Post tags:',
  note,
  readonly = false,
  reverseOrder = false,
  onTagSelect = noop,
}: PropsWithChildren<PostTagsProps>) => {
  const [isFetching, setFetching] = useState(false);
  const [options, setOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  useEffect(() => {
    initLoadTags();
  }, []);

  const handleSelectChange = useCallback((newValue: string[]) => {
    onTagSelect(newValue);
  }, []);

  const initLoadTags = useCallback(async () => {
    setFetching(true);

    try {
      const data = await communityTagsApi.getTagsCommon({});
      setOptions(data.tags.map((tag) => ({ label: tag.name, value: tag.id })));
    } finally {
      setFetching(false);
    }
  }, []);

  const tagsTitle = useMemo(() => {
    return options.reduce((acc, current) => {
      if (selectedTags.includes(current.value)) {
        acc.push(current.label);
      }
      return acc;
    }, [] as string[]);
  }, [options, selectedTags]);

  return (
    <Stack vertical spacing="tight">
      <Stack vertical spacing="none">
        <StyledHeader>{label}</StyledHeader>
        {note && (
          <Text>
            <Text strong>Note: </Text>
            {note}
          </Text>
        )}
      </Stack>

      {isFetching ? (
        <Stack>
          <Spin size="small" />
        </Stack>
      ) : (
        <>
          {reverseOrder ? (
            <Wrapper>
              {!readonly && (
                <TagsDropdown
                  isLoading={isFetching}
                  values={selectedTags}
                  onChange={handleSelectChange}
                  options={options}
                />
              )}

              {<TagsList tags={tagsTitle} />}
            </Wrapper>
          ) : (
            <Wrapper>
              {<TagsList tags={tagsTitle} />}
              {!readonly && (
                <TagsDropdown
                  isLoading={isFetching}
                  values={selectedTags}
                  onChange={handleSelectChange}
                  options={options}
                />
              )}
            </Wrapper>
          )}
        </>
      )}
    </Stack>
  );
};
