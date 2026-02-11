import {
  File03,
  File06,
  FileAttachment01,
  FileAttachment02,
  Image03,
  Paperclip,
} from '@untitled-ui/icons-react';
import { Typography } from 'antd';

import { Divider } from 'src/components/common/Divider/Divider';
import { Stack } from 'src/components/common/Stack/Stack';
import { components } from 'src/styled/definitions/colors';
import { Attachment } from 'src/transport/posts/posts.dto';

const { Text } = Typography;

type AttachmentsListProps = {
  attachments: Attachment[];
  ellipsis?: boolean;
  label?: string | null;
};

export const fileIconComponents: { [key: string]: JSX.Element } = {
  'application/pdf': <FileAttachment01 color={components.colors.brandColor} />,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (
    <FileAttachment02 color={components.colors.brandColor} />
  ),
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': (
    <File03 color={components.colors.brandColor} />
  ),
  'text/plain': <File06 color={components.colors.brandColor} />,
  'image/png': <Image03 color={components.colors.brandColor} />,
  'image/jpeg': <Image03 color={components.colors.brandColor} />,
  'image/jpg': <Image03 color={components.colors.brandColor} />,
  default: <Paperclip color={components.colors.brandColor} />,
};

export const AttachmentsList = ({
  attachments,
  ellipsis = true,
  label = 'Attachments',
}: AttachmentsListProps) => {
  return (
    <>
      {label && (
        <>
          <Text strong>{label}</Text>
          <Divider spacing="extraTight" />
        </>
      )}

      {attachments.map((attachment) => {
        const iconComponent =
          fileIconComponents[attachment.type] || fileIconComponents.default;

        return (
          <Stack
            alignment="center"
            key={attachment?.name + attachment?.path}
            wrap={false}
            spacing="tight"
          >
            <div style={{ height: 24 }}>{iconComponent}</div>
            <Stack.Item fill ellipsis={ellipsis}>
              <Text
                onClick={() => window.open(attachment.path, '_blank')}
                style={{
                  textOverflow: 'ellipsis',
                  color: components.colors.brandColor,
                  cursor: 'pointer',
                }}
              >
                {attachment.name}
              </Text>
            </Stack.Item>
          </Stack>
        );
      })}
    </>
  );
};
