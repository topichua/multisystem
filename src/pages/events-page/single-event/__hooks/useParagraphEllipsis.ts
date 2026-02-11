import { useState } from 'react';
import { EllipsisConfig } from 'antd/es/typography/Base';
export const useParagraphEllipsis = (
  unTruncatedRows?: number
): EllipsisConfig => {
  const [expanded, setExpanded] = useState(false);

  const ellipsis: EllipsisConfig = {
    expanded,
    rows: unTruncatedRows ?? 4,
    expandable: 'collapsible',
    symbol: (isExpanded) => (isExpanded ? 'Less' : 'More'),
    onExpand: (_, info) => setExpanded(info.expanded),
  };

  return ellipsis;
};
