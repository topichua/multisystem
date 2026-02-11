import * as React from 'react';
import { Form, Input, Typography, notification } from 'antd';
import config from 'src/projects/factory.ts';
import * as S from '../account.styled';
import { Mail01, ArrowNarrowLeft, Mail05 } from '@untitled-ui/icons-react';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { Button } from 'src/components/common/Button/Button';
import { ExternalLink, InternalLink } from 'src/components/common/Link/Link';
import { accountAPI } from 'src/transport/account/account.api';

const HeaderLogoImg = config.logo;

const { Text } = Typography;

export const ForgotPasswordPage = () => {
  const [isBusy, setIsBusy] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  if (emailSent) {
    return (
      <Form>
        <Stack alignment="center" vertical>
          <S.IconWrapper>
            <Mail05 />
          </S.IconWrapper>
          <Title style={{ marginBlockStart: 'unset' }} level={4}>
            Reset password email sent!
          </Title>
          <Text
            style={{ textAlign: 'center', display: 'block' }}
            type="secondary"
          >
            Head over to your email with instructions to <br /> reset your
            password.
          </Text>
          <Form.Item>
            <Stack distribution="center" style={{ marginTop: 16 }}>
              <InternalLink
                href={'/account/sign-in'}
                icon={<ArrowNarrowLeft />}
              >
                Back to Log in
              </InternalLink>
            </Stack>
          </Form.Item>
        </Stack>
      </Form>
    );
  }

  const onFinish = (values: any) => {
    setIsBusy(true);
    accountAPI
      .forgotPassword(values.email)
      .then((success) => {
        if (success) {
          setEmailSent(true);
        } else {
          notification.error({
            message: 'Incorrect email provided',
          });
        }
      })
      .finally(() => {
        setIsBusy(false);
      });
  };

  return (
    <Stack
      alignment="center"
      vertical
      spacing="extraLoose"
      style={{ height: 510 }}
    >
      <Stack vertical spacing="extraLoose">
        <Stack
          alignment="center"
          distribution="center"
          style={{ marginBottom: 90 }}
        >
          <ExternalLink href="https://otaus.com.au/">
            <HeaderLogoImg />
          </ExternalLink>
        </Stack>
        <Stack vertical spacing="tight">
          <Title level={4} style={{ textAlign: 'center', display: 'block' }}>
            Reset password
          </Title>
          <Text
            style={{ textAlign: 'center', display: 'block' }}
            type="secondary"
          >
            To reset your password, enter your email address <br /> you may use
            for OTA Connect
          </Text>
        </Stack>
      </Stack>
      <Stack.Item>
        <S.Form
          disabled={isBusy}
          name="basic"
          title="Forgot password"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={() => {}}
          autoComplete="off"
          requiredMark={false}
          colon={false}
          validateTrigger={'onSubmit'}
          size={'middle'}
          layout={'vertical'}
          style={{ minWidth: 320 }}
        >
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: 'Please enter an email address' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<Mail01 />}
              placeholder="example@email.com"
              size="large"
            />
          </Form.Item>
          <div style={{ height: 25 }} />
          <Form.Item>
            <Button
              loading={isBusy}
              disabled={isBusy}
              size={'large'}
              block
              type="primary"
              htmlType="submit"
            >
              Continue
            </Button>
            <Stack distribution="center" style={{ marginTop: 16 }}>
              <InternalLink
                href={'/account/sign-in'}
                icon={<ArrowNarrowLeft />}
              >
                Back to Log in
              </InternalLink>
            </Stack>
          </Form.Item>
        </S.Form>
      </Stack.Item>
    </Stack>
  );
};
