import { useBoolean } from 'ahooks';
import { Button, Typography } from 'antd';
import { FC, useCallback, useMemo } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import {
  CommunityAssetsItem,
  AssetsTypeEnum,
} from 'src/transport/communities/communities.dto';

import styled from 'styled-components';
import * as U from './assets-table.utils';

const { Text, Paragraph } = Typography;

const FileDescription = styled(Paragraph)`
  width: 100%;
  max-width: 550px;
  margin: 0px !important;
  display: inline-block !important;
`;

interface AssetRendererProps {
  record: CommunityAssetsItem;
}

export const AssetRenderer: FC<AssetRendererProps> = ({ record }) => {
  const [expanded, { toggle }] = useBoolean(false);
  const getExtension = useCallback((): string => {
    if (record.type === AssetsTypeEnum.Link) {
      return 'link';
    } else if (record.path) {
      const parts = record.path.split('.').pop()?.split('?');
      return parts ? parts[0] : '';
    }
    return '';
  }, [record.path, record.type]);

  const extension = useMemo(() => getExtension(), [getExtension]);

  return (
    <Stack>
      <Stack.Item>
        {U.fileTypeIcons[extension] || U.fileTypeIcons.default}
      </Stack.Item>
      <Stack vertical spacing="none">
        <Text>{record.name}</Text>
        <FileDescription
          ellipsis={{
            rows: 1,
            expandable: true,
            expanded,
            onExpand: toggle,
          }}
          type="secondary"
        >
          {record.description}
          {expanded && (
            <Button size="small" type="link" onClick={toggle}>
              Collapse
            </Button>
          )}
        </FileDescription>
      </Stack>
    </Stack>
  );
};
