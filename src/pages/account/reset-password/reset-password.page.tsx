import { ArrowNarrowLeft, Check } from '@untitled-ui/icons-react';
import { Form, Typography, notification } from 'antd';
import * as React from 'react';
import * as S from '../account.styled';

import { useLocation, useNavigate } from 'react-router-dom';
import { accountAPI } from 'src/transport/account/account.api';
import { Title } from 'src/components/common/Typography/Title';
import { Button } from 'src/components/common/Button/Button';
import { InputPassword } from 'src/components/common/Input/Input';
import { InternalLink } from 'src/components/common/Link/Link';
import { Stack } from 'src/components/common/Stack/Stack';

const { Text } = Typography;

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = React.useState(false);
  const [isPasswordSet, setIsPasswordSet] = React.useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const onFinish = (values: any) => {
    setIsBusy(true);
    accountAPI
      .resetPassword(token as string, values.password, userId as string)
      .then((success) => {
        if (success) {
          setIsPasswordSet(true);
        } else {
          notification.error({
            message:
              'This password does not meet our requirements. Please choose a password that is at least 8 characters with one uppercase letter and at least one non letter or digit character.',
          });
        }
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  if (isPasswordSet) {
    return (
      <Stack alignment="center" vertical>
        <S.IconWrapper>
          <Check />
        </S.IconWrapper>
        <Title style={{ marginBlockStart: 'unset' }} level={4}>
          New password set
        </Title>
        <Text type="secondary">
          Your password has successfully been updated
        </Text>
        <div style={{ height: 25 }} />
        <Stack.Item fill>
          <Button
            style={{ width: 280 }}
            size={'large'}
            block
            type="primary"
            onClick={() => navigate('/account/sign-in', { replace: true })}
          >
            Return to log in
          </Button>
        </Stack.Item>
      </Stack>
    );
  }

  return (
    <Stack alignment="center" vertical spacing="extraLoose">
      <Title level={4}>Reset password</Title>
      <S.Form
        disabled={isBusy}
        name="basic"
        title="Reset Password"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={() => {}}
        autoComplete="off"
        requiredMark={false}
        colon={false}
        size={'middle'}
        layout={'vertical'}
      >
        <Form.Item
          label="New password *"
          name="password"
          rules={[{ required: true, message: 'Please enter a password' }]}
        >
          <InputPassword size="large" />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm new password *"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please enter a password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The new password that you entered do not match')
                );
              },
            }),
          ]}
        >
          <InputPassword size="large" />
        </Form.Item>
        <Form.Item>
          <Text type="secondary">
            Password must contain a capital letter, a lowercase letter, <br />a
            number, and be a minimum of 8 characters.
          </Text>
        </Form.Item>
        <Form.Item>
          <Button
            loading={isBusy}
            disabled={isBusy}
            size={'large'}
            block
            type="primary"
            htmlType="submit"
          >
            Set new password
          </Button>
        </Form.Item>
        <Stack distribution="center" style={{ marginTop: 16 }}>
          <InternalLink href={'/account/sign-in'} icon={<ArrowNarrowLeft />}>
            Back to Log in
          </InternalLink>
        </Stack>
      </S.Form>
    </Stack>
  );
};
