import { ModalProps, Typography } from 'antd';
import styled from 'styled-components';
import {
  FacebookIcon,
  FacebookShareButton,
  EmailIcon,
  EmailShareButton,
  TwitterIcon,
  TwitterShareButton,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinIcon,
  LinkedinShareButton,
} from 'react-share';

import { Modal } from 'src/components/common/Modal/Modal';
import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import { Clipboard } from '@untitled-ui/icons-react';
import { copyToClipboard } from 'src/utils/copyToClipboard';

type ShareModalProps = ModalProps & {
  link: string;
};

const { Paragraph } = Typography;

const iconProps = {
  round: true,
  size: 30,
};

export const ShareModal = ({ link, ...rest }: ShareModalProps) => {
  const copyLink = () => {
    copyToClipboard(link);
  };

  return (
    <Modal title="Share" footer={null} {...rest}>
      <Stack vertical>
        <Stack wrap>
          <FacebookShareButton url={link}>
            <FacebookIcon {...iconProps} />
          </FacebookShareButton>
          <EmailShareButton url={link}>
            <EmailIcon {...iconProps} />
          </EmailShareButton>
          {/* <FacebookMessengerShareButton url={link}>
          <FacebookMessengerIcon round size={40} />
        </FacebookMessengerShareButton> */}
          <TwitterShareButton url={link}>
            <TwitterIcon {...iconProps} />
          </TwitterShareButton>
          <TelegramShareButton url={link}>
            <TelegramIcon {...iconProps} />
          </TelegramShareButton>
          <WhatsappShareButton url={link}>
            <WhatsappIcon {...iconProps} />
          </WhatsappShareButton>
          <LinkedinShareButton url={link}>
            <LinkedinIcon {...iconProps} />
          </LinkedinShareButton>
        </Stack>

        <CopyLinkWrapper>
          <Stack alignment="center" wrap={false}>
            <Stack.Item fill>
              <Paragraph style={{ marginBottom: 0 }} ellipsis={{ rows: 1 }}>
                {link}
              </Paragraph>
            </Stack.Item>

            <Button
              icon={<Clipboard height={14} width={14} />}
              type="link"
              onClick={copyLink}
            />
          </Stack>
        </CopyLinkWrapper>
      </Stack>
    </Modal>
  );
};

const CopyLinkWrapper = styled.div`
  border: 1px solid
    ${(props) => props.theme.colors.components.border.primaryBorder};
  padding: 8px 16px;
  border-radius: 4px;
`;
