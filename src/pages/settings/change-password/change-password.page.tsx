import * as React from 'react';
import styled from 'styled-components';
import { Form, Typography, Spin, Alert, notification } from 'antd';
import { Divider } from 'src/components/common/Divider/Divider';
import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import { InputPassword } from 'src/components/common/Input/Input';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { PasscodeLock } from '@untitled-ui/icons-react';
import { components } from 'src/styled/definitions/colors';
import { Page } from 'src/components/common/page/page';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { settingsAPI } from 'src/transport/settings/setting.api';

const { Title, Text } = Typography;

const FormStyled = styled(Form)`
  .ant-form-item-row {
    display: flex;
    align-items: baseline;
    max-width: 932px;
  }
`;

export const ChangePasswordPage = () => {
  const [isBusy, setIsBusy] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    setIsBusy(true);
    settingsAPI
      .changePassword({
        currentPassword: values.current,
        newPassword: values.newpass,
        confirmPassword: values.rnew,
      })
      .then(() => {
        notification.success({
          message: 'Password successfully changed',
        });
      })
      .catch((error) => {
        const errorText = Object.values(error.response.data.ModelState).join();
        notification.error({
          message: 'Password not changed',
          description: errorText,
        });
      })
      .finally(() => {
        form.resetFields();
        setIsBusy(false);
      });
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<PasscodeLock color={components.colors.brandColor} />}
          title="Change password"
        />
      </FixedContentHeader>
      <Page.Content
        style={{ maxWidth: 1064, minHeight: 500, margin: '0 auto' }}
      >
        <Spin size="large" tip="Saving..." spinning={isBusy}>
          <FormStyled
            form={form}
            labelAlign={'left'}
            labelWrap={false}
            onFinish={onFinish}
            onFinishFailed={() => {}}
            requiredMark={false}
            colon={false}
            size={'middle'}
            labelCol={{ span: 6 }}
            layout={'horizontal'}
          >
            <Stack alignment="center" distribution="equalSpacing">
              <Stack spacing="none" vertical>
                <Title level={4}>Password settings</Title>
                <Text type="secondary">Update your password</Text>
              </Stack>
              <Stack>
                <Button
                  disabled={isBusy}
                  block
                  type="primary"
                  htmlType="submit"
                >
                  Save
                </Button>
              </Stack>
            </Stack>
            <Alert
              style={{ marginTop: 16 }}
              type={'info'}
              description="Password should contain at least 8 characters, combination of uppercase, lowercase, numbers and symbols."
            ></Alert>
            <Divider />
            <Form.Item
              name="current"
              label="Current password"
              rules={[{ required: true, message: 'Please enter a password' }]}
            >
              <InputPassword />
            </Form.Item>
            <Divider />
            <Form.Item
              name="newpass"
              required
              label="New password"
              rules={[
                { required: true, message: 'Please enter a password' },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                  message:
                    'Should contain at least 8 characters, a combination of upper/lowercase, numbers, and symbols.',
                },
              ]}
            >
              <InputPassword />
            </Form.Item>
            <Form.Item
              name="rnew"
              label="Re-type new password"
              dependencies={['newpass']}
              rules={[
                { required: true, message: 'Please enter a password' },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                  message:
                    'Should contain at least 8 characters, a combination of upper/lowercase, numbers, and symbols.',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newpass') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        'The new password that you entered do not match'
                      )
                    );
                  },
                }),
              ]}
            >
              <InputPassword />
            </Form.Item>
          </FormStyled>
        </Spin>
      </Page.Content>
    </>
  );
};
