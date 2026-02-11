import { ChevronLeft } from '@untitled-ui/icons-react';
import { Modal, Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { styled } from 'styled-components';

const { Text } = Typography;
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';

export const StyledModal = styled(Modal)`
  .ant-modal-footer {
    display: none;
  }

  .ant-modal-title {
    div {
      display: flex;
    }

    h4 {
      font-size: 18px;
      font-weight: 600;
      line-height: 28px;
      margin: 0;
    }
  }
`;

export const StyledModalBlock = styled(Stack)`
  margin-top: 16px;
`;

export const StyledBlock = styled(Stack)<{ isDisabled?: boolean }>`
  box-sizing: border-box;
  border: 1px solid #eaecf0;
  background: #fcfcfd;
  padding: 16px 16px 16px 24px;
  border-radius: 16px;

  ${(props) =>
    props.isDisabled &&
    `
		 filter: opacity(0.5);
	`}
`;

export const StyledIcon = styled(ChevronLeft)`
  box-sizing: border-box;
  border: 1px solid #d0d5dd;
  box-shadow: 0 1px 2px 0 #1018280d;
  width: 36px;
  height: 36px;
  padding: 8px;
  gap: 8px;
  border-radius: 8px;
  cursor: pointer;
`;

export const StyledText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  margin-bottom: 15px;
`;

export const StyledButtonContainer = styled(Stack)`
  margin-top: 20px;
`;

export const StyledAvatar = styled(UserAvatar)<{ isInvited?: boolean }>`
  ${(props) =>
    props.isInvited &&
    `
		 filter: opacity(0.5);
	`}
`;
