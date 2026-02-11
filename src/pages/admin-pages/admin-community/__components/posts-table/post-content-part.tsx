import { useMemo } from 'react';
import { Popover, Tooltip, Typography } from 'antd';
import { useBoolean } from 'ahooks';

import { removeHtmlTags } from 'src/utils/text';
import { ExpandableHtml } from 'src/components/common/ExpandableHtml/expandableHtml';

import * as S from './posts-table.styled';

const { Paragraph, Text } = Typography;

type PostContentPartProps = {
  content: string;
};

export const PostContentPart = ({ content }: PostContentPartProps) => {
  const [isOpenPopover, { set: setIsOpenPopover }] = useBoolean(false);
  const [isOpenTooltip, { set: setIsOpenTooltip }] = useBoolean(false);

  const handleOpenPopoverChange = (isOpen: boolean) => {
    setIsOpenPopover(isOpen);
    if (!isOpen) setIsOpenTooltip(false);
  };

  const contentWithoutHtmlTags = useMemo(() => {
    return removeHtmlTags(content);
  }, []);

  return (
    <Popover
      trigger="click"
      open={isOpenPopover}
      content={
        <S.PopoverWrapper>
          <ExpandableHtml rawHtml={content} />
        </S.PopoverWrapper>
      }
      onOpenChange={handleOpenPopoverChange}
    >
      <Paragraph
        ellipsis={{ rows: 2 }}
        style={{ marginBottom: 0, cursor: 'pointer' }}
      >
        <Tooltip
          open={isOpenTooltip && !isOpenPopover}
          title="Click to see post"
          trigger="hover"
          onOpenChange={setIsOpenTooltip}
        >
          <Text>{contentWithoutHtmlTags}</Text>
        </Tooltip>
      </Paragraph>
    </Popover>
  );
};
