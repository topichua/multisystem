import React, { useState } from 'react';
import { Modal, Input, Typography, ModalProps } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack';
import {
  CommunityAssetsItem,
  AssetsTypeEnum,
} from 'src/transport/communities/communities.dto';

const { Text } = Typography;

type RenameModalProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  editingItem: CommunityAssetsItem | null;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & ModalProps;

export const RenameModal: React.FC<RenameModalProps> = ({
  visible,
  onCancel,
  onOk,
  editingItem,
  onTitleChange,
  onDescriptionChange,
  onLinkChange,
  ...modalProps
}) => {
  const [isLinkValid, setIsLinkValid] = useState(true);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pattern =
      /^(https?:\/\/)([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}(\/[\w\-._~:/?#[\]@!$&'()*+,;%=]*)?$/;
    const value = e.target.value;
    setIsLinkValid(pattern.test(value));
    onLinkChange(e);
  };

  const isLink = editingItem?.type === AssetsTypeEnum.Link;
  return (
    <Modal
      title={isLink ? 'Edit link' : 'Change title and description'}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      {...modalProps}
    >
      <Stack vertical>
        <Text>Title</Text>
        <Input
          placeholder="Title"
          value={editingItem?.name}
          onChange={onTitleChange}
        />
        <Text>Description</Text>
        <Input
          placeholder="Description"
          value={editingItem?.description}
          onChange={onDescriptionChange}
        />
        {isLink && (
          <>
            <Text>Link path</Text>
            <Input
              placeholder="Link"
              value={editingItem?.path}
              onChange={handleLinkChange}
              style={{ borderColor: isLinkValid ? '' : 'red' }}
            />
            {!isLinkValid && (
              <Text type="danger">
                The URL must start with http:// or https:// and must have domain
              </Text>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
};
