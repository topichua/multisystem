import { Typography } from 'antd';

import { Stack } from '../Stack/Stack';
import { UploadCloud02 } from '@untitled-ui/icons-react';
import { useUploadMeetingAttachments } from './useUploadMeetingAttachments.ts';
import { Button } from 'src/components/common/Button/Button.tsx';
import * as S from './CustomItemRender.styled.tsx';
import { CustomItemRender } from './CustomItemRender.tsx';
import { UploadAttachmentsProps } from './upload-attachments-type.ts';

const { Text } = Typography;

export const UploadMeetingAttachments = ({
  label = 'Add files',
  note,
  files,
  onChange,
  maxFileLength = 5,
}: UploadAttachmentsProps) => {
  const { onPreview, handleDelete, onChangeFiles, filteredFiles } =
    useUploadMeetingAttachments(files, onChange);

  return (
    <S.Wrapper vertical>
      <Stack vertical spacing="none">
        <Text strong>{label}</Text>
        {note && (
          <Text>
            <Text strong>Note:</Text> {note}
          </Text>
        )}
      </Stack>

      <S.Dragger
        beforeUpload={() => false}
        maxCount={maxFileLength}
        fileList={filteredFiles}
        onPreview={onPreview}
        onChange={onChangeFiles}
        onRemove={handleDelete}
        itemRender={CustomItemRender}
        disabled={filteredFiles.length >= maxFileLength}
      >
        <Stack vertical alignment="center">
          <Button type="default" icon={<UploadCloud02 height={20} />} />
          <Text type="secondary">
            <Text strong>Click to upload</Text> files or drag and drop
          </Text>
        </Stack>
      </S.Dragger>
    </S.Wrapper>
  );
};
