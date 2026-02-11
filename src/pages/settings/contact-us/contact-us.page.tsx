import { MessageTextSquare02 } from '@untitled-ui/icons-react';
import { Form, notification, Spin, Upload, UploadFile } from 'antd';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout.tsx';
import { components } from 'src/styled/definitions/colors';
import { PhoneInput } from './contact-us.styled';
import { Button } from 'src/components/common/Button/Button';
import { Input, InputTextArea } from 'src/components/common/Input/Input';
import { useState } from 'react';
import DEFAULT_IMG_FOR_DOC from 'src/assets/icons/document-901.png';
import { UploadOutlined } from '@ant-design/icons';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { enquiryApi } from 'src/transport/enquiry/enquiry.api';
import { UploadChangeParam } from 'antd/es/upload';

export const ContactUsPage = () => {
  const [form] = Form.useForm();
  const [isProccessing, setisProccessing] = useState(false);
  const [uploadedFileList, setUploadedFileList] = useState<UploadFile[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const { user } = useCurrentUserStore();

  const onFinish = async (values: {
    email: string;
    phoneNumber: string;
    message: string;
  }) => {
    setisProccessing(true);
    const formData = new FormData();

    formData.append('firstName', user?.firstName || '');
    formData.append('lastName', user?.lastName || '');
    formData.append('email', values.email);
    formData.append('phone', values.phoneNumber);
    formData.append('comments', values.message);
    formData.append('memberNumber', user?.memberNum || '');
    uploadedFileList.forEach((file) => {
      formData.append('fileAttachment', file.originFileObj as File);
    });

    await enquiryApi
      .submitEnquiry(formData)
      .then(() => {
        notification.success({
          message: 'Your enquiry has been submitted. Thank you.',
        });
      })
      .catch((error) => {
        notification.error({
          message:
            error.response.data.message ||
            error.response.data ||
            'Failed to send your enquiry. Try again.',
        });
      })
      .finally(() => {
        setisProccessing(false);
        form.resetFields();
        setUploadedFileList([]);
      });
    setisProccessing(false);
  };

  const beforeUploadFilesCheck = (newFiles: UploadFile[]) => {
    const maxSize: number = 10 * 1024 * 1024; // 10Mb
    const allowedExtensions = [
      'jpeg',
      'gif',
      'png',
      'tiff',
      'bmp',
      'pdf',
      'doc',
      'csv',
      'xlsx',
      'docx',
    ];

    return newFiles.every((file) => {
      const extension = file.name?.split('.').pop()?.toLowerCase() ?? '';

      if (!allowedExtensions.includes(extension)) {
        notification.error({
          message: `For preview allowed only: ${allowedExtensions.join(
            ', '
          )} file types`,
        });
        return false;
      }

      const totalSize =
        uploadedFileList.reduce((acc, f) => acc + (f.size ?? 0), 0) +
        (file?.size ?? 0);

      if (totalSize > maxSize) {
        notification.error({
          message: `The total size of all files must not exceed 10Mb`,
        });
        return false;
      }

      return true;
    });
  };

  const onPreview = async (file: UploadFile) => {
    const allowedPreviewExtensions = ['png', 'jpeg', 'jpg'];
    const extension = file.name?.split('.').pop()?.toLowerCase() ?? '';

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
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleChangeUploadFiles = ({
    fileList,
  }: UploadChangeParam<UploadFile>) => {
    const isValid = beforeUploadFilesCheck(fileList);
    if (!isValid) return;

    const newFileList = fileList.map((file: UploadFile) => {
      const isImage = file.type?.startsWith('image/');
      return {
        ...file,
        thumbUrl: isImage
          ? URL.createObjectURL(file.originFileObj as File)
          : DEFAULT_IMG_FOR_DOC,
      };
    });
    setUploadedFileList(newFileList);
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<MessageTextSquare02 color={components.colors.brandColor} />}
          title="Contact us"
        />
      </FixedContentHeader>
      <Page.Content style={{ maxWidth: 800, minHeight: 500, margin: '0 auto' }}>
        <Spin spinning={isProccessing}>
          <Form
            disabled={isProccessing}
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
            name="contact-us"
            form={form}
            validateTrigger={'onSubmit'}
            onFinishFailed={() => {}}
            initialValues={{
              email: user?.registeredEmail,
              phoneNumber: user?.mobile,
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'Please enter a valid email!',
                  pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                },
                {
                  required: true,
                  message: 'Please enter an Emaill address',
                },
              ]}
            >
              <Input placeholder="you@company.com" />
            </Form.Item>
            <Form.Item label="Phone number" name="phoneNumber">
              <PhoneInput
                placeholder="Enter phone number"
                value={phoneNumber}
                defaultCountry="au"
                onChange={setPhoneNumber}
                className="ant-input"
                disabled={isProccessing}
              />
            </Form.Item>
            <Form.Item
              label="Comments"
              name="message"
              rules={[{ required: true, message: 'Please enter a comments' }]}
            >
              <InputTextArea placeholder="Leave us a comments..." />
            </Form.Item>
            <Form.Item label="Attach file (JPEG, GIF, PNG, TIFF, BMP, PDF, DOC, CSV, XLSX and DOCX, max 10Mb)">
              <Upload
                beforeUpload={() => false}
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
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
              <Upload />
            </Form.Item>
            <Form.Item>
              <Stack alignment="center" distribution="center">
                <Button type="primary" onClick={form.submit}>
                  Send message
                </Button>
              </Stack>
            </Form.Item>
          </Form>
        </Spin>
      </Page.Content>
    </>
  );
};
