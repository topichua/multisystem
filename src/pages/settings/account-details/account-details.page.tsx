import { Mail01, User03 } from '@untitled-ui/icons-react';
import {
  DatePicker,
  Form,
  Grid,
  notification,
  Select,
  Skeleton,
  Spin,
  Switch,
  Typography,
  Upload,
} from 'antd';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { components } from 'src/styled/definitions/colors';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import { Input } from 'src/components/common/Input/Input';
import { useEffect, useState } from 'react';
import { Divider } from 'src/components/common/Divider/Divider';
import styled from 'styled-components';
import { PhoneInput as PhoneInputLibrary } from 'react-international-phone';
import { observer } from 'mobx-react';
import { useSettingsAccountStore } from './account-section.provider';
import dayjs from 'dayjs';
import { settingsAPI } from 'src/transport/settings/setting.api';
import { useBoolean } from 'ahooks';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const PhoneInput = styled(PhoneInputLibrary)`
  .react-international-phone-input {
    width: 100%;
    border-radius: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export const AccountDetailsPage = observer(() => {
  const [editMode, setEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formInstance] = Form.useForm();
  const [loading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);
  const [twoFa, setTwoFa] = useState(false);
  const size = useBreakpoint();

  const [avatarUploading, setAvatarUploading] = useState(false);

  const {
    gendersArray,
    titlesArray,
    loadAccountSettingsData,
    updateUser,
    values: currentUser,
    isDataLoading,
    isUserUpdating,
  } = useSettingsAccountStore();

  const fetch2FaValue = () => {
    settingsAPI
      .get2FaValue()
      .then((twoFaRes) => setTwoFa(twoFaRes.data.enableTfa));
  };

  useEffect(() => {
    loadAccountSettingsData();
    fetch2FaValue();
  }, []);

  if (isDataLoading || !currentUser) {
    return <Skeleton />;
  }

  const toggleTwoFa = async (value: boolean) => {
    startLoading();
    settingsAPI
      .update2FaValue({
        enableTFA: value,
        mailTo: 'Home',
        allowSms: value,
      })
      .then(() => {
        value
          ? notification.success({
              message: `Two-factor authentication enabled`,
            })
          : notification.error({
              message: `Two-factor authentication disabled`,
            });

        fetch2FaValue();
      })
      .catch(() => notification.error({ message: 'Error updating 2FA' }))
      .finally(() => finishLoading());
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const uploadAvatarToServer = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    setAvatarUploading(true);
    try {
      await settingsAPI
        .uploadAvatar(formData)
        .then(() => {
          notification.success({ message: 'Avatar uploaded successfully!' });
          loadAccountSettingsData();
        })
        .catch((err) => {
          console.log(err);
          notification.error({ message: 'Error during uploading avatar!' });
        })
        .finally(() => setAvatarUploading(false));
    } catch (error) {
      notification.error({ message: 'Error during uploading avatar!' });
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      notification.error({ message: 'Only images!' });
      return false;
    }

    const isSmallEnough = file.size / 1024 / 1024 < 5;
    if (!isSmallEnough) {
      notification.error({ message: 'Less than 5MB!' });
      return false;
    }

    return false;
  };

  const onChange: UploadProps['onChange'] = ({
    fileList: newFileList,
    file,
  }) => {
    console.log(file, newFileList);
    const uploadFile = file.originFileObj || file;
    uploadAvatarToServer(uploadFile as any);
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<User03 color={components.colors.brandColor} />}
          title="Account details"
        >
          <Stack distribution="trailing">
            {editMode ? (
              <Stack>
                <Button
                  onClick={() => {
                    setEditMode(false);
                  }}
                  block
                  type="text"
                >
                  Cancel
                </Button>
                <Button
                  block
                  type="primary"
                  onClick={() => {
                    formInstance.submit();
                  }}
                >
                  Save
                </Button>
              </Stack>
            ) : (
              <Button
                disabled={false}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                Edit
              </Button>
            )}
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>
      <Page.Content
        style={{
          maxWidth: 1064,
          width: '100%',
          minHeight: 500,
          margin: '0 auto',
        }}
      >
        <Spin
          size="large"
          tip="Loading..."
          spinning={isUserUpdating || loading}
        >
          <Form labelCol={{ span: 6 }} labelAlign={'left'} labelWrap={false}>
            <Form.Item label="Avatar">
              <Stack vertical>
                <Spin spinning={avatarUploading}>
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                  >
                    {currentUser?.avatarUrl ? (
                      <UserAvatar
                        src={currentUser?.avatarUrl}
                        size={100}
                        shape="circle"
                        firstName={currentUser?.firstName || ''}
                        lastName={currentUser?.lastName || ''}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Spin>
              </Stack>
            </Form.Item>
          </Form>
          <Divider style={{ marginBottom: 24 }} spacing="none" />
          <Form
            form={formInstance}
            labelAlign={'left'}
            labelWrap={false}
            initialValues={{
              title: currentUser?.title,
              fName: currentUser?.firstName,
              lName: currentUser?.lastName,
              mName: currentUser?.middleName,
              pronoun: currentUser?.pronoun,
              pref: currentUser?.prefName,
              graduationDate: currentUser?.graduationDate
                ? dayjs(currentUser.graduationDate, 'YYYY-MM-DD')
                : undefined,
              gender: currentUser?.gender,
              email: currentUser?.registeredEmail,
              dob: currentUser?.dob
                ? dayjs(currentUser.dob, 'YYYY-MM-DD')
                : undefined,
              postalAddress1: currentUser?.postalAddress1,
              postalSuburb: currentUser?.postalSuburb,
              postalState: currentUser?.postalState,
              postalPostcode: currentUser?.postalPostcode,
              postalCountry: 'Australia',
              phone: currentUser?.mobile,
            }}
            onFinish={(values: any) => {
              updateUser(values);
              setEditMode(false);
            }}
            onFinishFailed={() => {}}
            requiredMark={false}
            colon={false}
            disabled={!editMode}
            validateTrigger={'onSubmit'}
            size={'middle'}
            labelCol={{ span: 6 }}
            layout={'horizontal'}
          >
            <Form.Item label="Title" name="title">
              <Select
                style={{ width: '100px' }}
                options={
                  titlesArray != null
                    ? titlesArray?.map((x) => {
                        return { value: x.key, label: x.value };
                      })
                    : []
                }
                placeholder={''}
              />
            </Form.Item>

            <Divider style={{ marginBottom: 24 }} spacing="none" />
            <Form.Item label="Name *" style={{ marginBottom: 0 }}>
              <Stack fill vertical={!size.md}>
                <Stack vertical>
                  <Text>First name *</Text>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: 'Please input your First name',
                      },
                    ]}
                    label=""
                    name="fName"
                  >
                    <Input />
                  </Form.Item>
                </Stack>

                {/* <Stack vertical>
                  <Text>Middle name</Text>
                  <Form.Item label="" name="mName">
                    <Input />
                  </Form.Item>
                </Stack> */}

                <Stack vertical>
                  <Text>Last name*</Text>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Last name',
                      },
                    ]}
                    label=""
                    name="lName"
                  >
                    <Input />
                  </Form.Item>
                </Stack>
              </Stack>
            </Form.Item>
            <Form.Item label="Pronouns">
              <Form.Item style={{ marginBottom: 0 }} name="pronoun">
                <Input />
              </Form.Item>
            </Form.Item>
            <Form.Item label="Preferred name">
              <Form.Item style={{ marginBottom: 0 }} name="pref">
                <Input />
              </Form.Item>
            </Form.Item>
            <Divider style={{ marginBottom: 24 }} spacing="none" />
            <Form.Item label="Gender" name="gender">
              <Select
                options={gendersArray?.map((x) => {
                  return { value: x.key, label: x.value };
                })}
              />
            </Form.Item>
            <Form.Item label="Graduation Date">
              <Form.Item style={{ marginBottom: 0 }} name="graduationDate">
                <DatePicker
                  style={{ width: '100%' }}
                  format={'DD/MM/YYYY'}
                  placeholder="Type as DD / MM / YYYY or select date in the calendar"
                />
              </Form.Item>
            </Form.Item>
            <Divider style={{ marginBottom: 24 }} spacing="none" />
            <Form.Item
              label="Email address *"
              name="email"
              rules={[
                { required: true, message: 'Please enter an Emaill address' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input prefix={<Mail01 />} />
            </Form.Item>
            <Divider style={{ marginBottom: 24 }} spacing="none" />
            <Form.Item label="Date of birth">
              <Form.Item name="dob" style={{ marginBottom: 0 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  format={'DD/MM/YYYY'}
                  placeholder="Type as DD / MM / YYYY or select date in the calendar"
                />
              </Form.Item>
            </Form.Item>
            <Divider style={{ marginBottom: 24 }} spacing="none" />
            {/* ##################### */}
            <Form.Item label=" ">
              <Stack
                spacing="extraLoose"
                distribution="equalSpacing"
                vertical={!size.md}
              >
                <Stack.Item fill>
                  <Text>Address *</Text>
                  <Form.Item label="" name="postalAddress1">
                    <Input />
                  </Form.Item>
                </Stack.Item>

                <Stack.Item fill>
                  <Text>Suburb * </Text>
                  <Form.Item label="" name="postalSuburb">
                    <Input />
                  </Form.Item>
                </Stack.Item>
              </Stack>
            </Form.Item>
            <Form.Item label=" ">
              <Stack
                spacing="extraLoose"
                distribution="equalSpacing"
                vertical={!size.md}
              >
                <Stack.Item fill>
                  <Text>State *</Text>
                  <Form.Item label="" name="postalState">
                    <Input />
                  </Form.Item>
                </Stack.Item>

                <Stack.Item fill>
                  <Text>Postcode *</Text>
                  <Form.Item label="" name="postalPostcode">
                    <Input />
                  </Form.Item>
                </Stack.Item>
              </Stack>
            </Form.Item>
            <Form.Item label=" ">
              <Stack
                spacing="none"
                distribution="equalSpacing"
                vertical={!size.md}
              >
                <Stack.Item fill>
                  <Text>Country *</Text>
                  <Form.Item label="" name="postalCountry">
                    <Input disabled />
                  </Form.Item>
                </Stack.Item>
              </Stack>
            </Form.Item>
            {/* ##################### */}
            <Divider style={{ marginBottom: 24 }} spacing="none" />
            <Form.Item label="Primary phone number *" name="phone">
              <PhoneInput
                placeholder="Enter phone number"
                value={phoneNumber}
                defaultCountry="au"
                onChange={(value: any) => {
                  setPhoneNumber(value);
                }}
                className="ant-input"
                style={{ width: '100%' }}
                disabled={!editMode}
              />
            </Form.Item>
            <Form.Item label="Two factor authentication" name="2fa">
              <Switch checked={twoFa} onChange={toggleTwoFa} />
            </Form.Item>
          </Form>
        </Spin>
      </Page.Content>
    </>
  );
});
