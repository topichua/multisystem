import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  ModalProps,
  notification,
  Select,
  Upload,
  UploadFile,
} from 'antd';
import React, { useState } from 'react';
import DEFAULT_IMG_FOR_DOC from 'src/assets/icons/document-901.png';
import { communityAssetsApi } from 'src/transport/communities/community.assets.api';

type AddFileModalProps = {
  visible: boolean;
  onCancel: () => void;
  communityId: string;
  folderId: string;
  setIsAddFileModalOpen: (value: boolean) => void;
  fetchFoldersAndItems: () => void;
} & ModalProps;

export const AddFileModal: React.FC<AddFileModalProps> = ({
  visible,
  onCancel,
  communityId,
  folderId,
  fetchFoldersAndItems,
  setIsAddFileModalOpen,
  ...modalProps
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadedFileList, setUploadedFileList] = React.useState<UploadFile[]>(
    []
  );
  const fileType = Form.useWatch('fileType', form);

  const uploadFileToFolder = async () => {
    await form.validateFields();
    const { fileType, name, description, url } = form.getFieldsValue();

    if (!fileType || (!url && !uploadedFileList.length)) {
      notification.error({
        message: 'Please select a file type and provide the necessary data.',
      });
      return;
    }

    const payload = {
      type: fileType,
      data: fileType === 'link' ? url : uploadedFileList[0],
      name,
      description,
    };

    setLoading(true);
    communityAssetsApi
      .uploadCommunityAssetsItem(communityId, folderId, payload)
      .then(() => {
        notification.success({
          message: 'File added successfully.',
        });
        setIsAddFileModalOpen(false);
        fetchFoldersAndItems();
      })
      .catch((error) => {
        notification.error({
          message: 'Failed to add file.' + error,
        });
      })
      .finally(() => {
        setLoading(false);
        setUploadedFileList([]);
        form.resetFields();
      });
  };

  const beforeUploadFilesCheck = (file: any) => {
    const maxSize = 500 * 1024 * 1024; // 500Mb
    const allowedExtensions = [
      'pdf',
      'doc',
      'docx',
      'xlsx',
      'xls',
      'txt',
      'mp4',
      'png',
      'jpeg',
      'jpg',
      'pptx',
      'ppt',
    ];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      notification.error({
        message: `Allowed only: ${allowedExtensions.join(', ')} file types`,
      });
      return false;
    }
    if (file.size > maxSize) {
      notification.error({
        message: `Maximum allowed file size is 5Mb`,
      });
      return false;
    }

    setUploadedFileList((prevState) => [...prevState, file]);
    return false;
  };

  const onPreview = async (file: any) => {
    const allowedPreviewExtensions = ['png', 'jpeg', 'jpg'];

    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedPreviewExtensions.includes(extension)) {
      notification.error({
        message: `Allowed only: ${allowedPreviewExtensions.join(
          ', '
        )} file types for preview`,
      });
      return false;
    }

    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as any);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleChangeUploadFiles = ({ file }: any) => {
    const newFileList = file.map((file: any) => {
      const isImage = file.type.startsWith('image/');
      return {
        ...file,
        thumbUrl: isImage
          ? URL.createObjectURL(file.originFileObj)
          : DEFAULT_IMG_FOR_DOC,
      };
    });
    setUploadedFileList(newFileList);
  };

  return (
    <Modal
      title="Add file to folder"
      open={visible}
      onOk={uploadFileToFolder}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      cancelButtonProps={{ disabled: loading }}
      okButtonProps={{ loading: loading }}
      {...modalProps}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="fileType"
          label="Choose type of uploading data"
          initialValue="link"
        >
          <Select
            showSearch
            placeholder="Select file type"
            options={[
              { value: 'link', label: 'Link' },
              { value: 'file', label: 'File' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Type name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Type description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input />
        </Form.Item>

        {fileType === 'link' ? (
          <Form.Item
            name="url"
            label="Type URL"
            rules={[
              { required: true, message: 'Please input the URL!' },
              {
                pattern:
                  /^(https?:\/\/)([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}(\/[\w\-._~:/?#[\]@!$&'()*+,;%=]*)?$/,
                message:
                  'The URL must start with http:// or https:// and must have domain',
              },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          <Form.Item name="file" label="Upload file">
            <Upload
              beforeUpload={beforeUploadFilesCheck}
              maxCount={1}
              multiple={false}
              fileList={uploadedFileList}
              onPreview={onPreview}
              listType="text"
              onChange={handleChangeUploadFiles}
              onRemove={(file) => {
                setUploadedFileList((prevList) =>
                  prevList.filter((item) => item.uid !== file.uid)
                );
              }}
            >
              {uploadedFileList.length === 0 && (
                <Button icon={<UploadOutlined />}>Upload</Button>
              )}
            </Upload>
          </Form.Item>
        )}

        <Form.Item name="fileData" hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
