import { UploadProps } from 'antd/es/upload';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { fileTypeIcons } from 'src/utils/file.tsx';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Card } from 'src/components/common/Card/Card.tsx';
import { Trash01 } from '@untitled-ui/icons-react';

export const CustomItemRender: UploadProps['itemRender'] = (
  originNode,
  file,
  _fileList,
  actions
) => {
  if (!file) return originNode;

  const fileType = file.name.split('.').pop()?.toLowerCase() || 'default';
  return (
    <Card>
      <Stack spacing="normal" wrap={false}>
        {fileTypeIcons[fileType]}

        <Stack.Item fill ellipsis>
          <Button type="link" size="small" onClick={actions.preview}>
            <strong>{file.name}</strong>
          </Button>
          {file.size ? (
            <div>
              {(file.size / 1024 / 1024).toFixed(2)}
              <span> MB</span>
            </div>
          ) : null}
        </Stack.Item>

        <Button type="link" onClick={actions.remove}>
          <Trash01 height={20} />
        </Button>
      </Stack>
    </Card>
  );
};
