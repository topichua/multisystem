import { Passcode } from '@untitled-ui/icons-react';
import { Alert, Form, notification, Typography } from 'antd';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { InputPassword } from 'src/components/common/Input/Input';
import * as S from '../account.styled';
import { accountAPI } from 'src/transport/account/account.api';
import { useAuth } from 'src/context/auth-context';
import { LoadingOutlined } from '@ant-design/icons';
import {
  getReturnUrlOrNull,
  storeUserCredentialsInLocalStorage,
} from 'src/utils/route-utils';
import { pagesMap } from 'src/pages/authorized/routes';

const { Text } = Typography;

function valuesToArray(input: string | Record<string, any>): string[] {
  if (typeof input === 'string') {
    return [input];
  } else if (typeof input === 'object' && input !== null) {
    return Object.values(input).flatMap(valuesToArray);
  } else {
    return [];
  }
}

export const PasswordEntryPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [wrongPassword, setWrongPassword] = React.useState(false);
  const [form] = Form.useForm();
  const { authData } = useAuth();
  const allAppRoutes = valuesToArray(pagesMap);

  const submitOneTimeCode = async (formData: {
    password: string;
  }): Promise<void> => {
    setIsProcessing(true);

    try {
      const data = await accountAPI.login(authData.email, formData.password);
      setIsProcessing(false);

      if (Object.keys(data).length === 0) {
        setWrongPassword(true);
        form.resetFields();
      } else {
        storeUserCredentialsInLocalStorage(data);
        const returnUrl = getReturnUrlOrNull(window.location.search);
        const regex = /^\/.*\/:[a-zA-Z0-9]+$/;
        const validReturnUrl =
          returnUrl &&
          (allAppRoutes.includes(returnUrl) ||
            allAppRoutes.some(
              (route) =>
                regex.test(route) &&
                returnUrl.startsWith(route.replace('/:id', ''))
            ));

        navigate(validReturnUrl ? returnUrl : '/');
      }
    } catch {
      setWrongPassword(true);
      form.resetFields();
      setIsProcessing(false);
    }
  };

  const resendCode = async () => {
    if (!authData.email || !authData.password) {
      notification.error({
        message:
          'Error. Please, back to login page and type your login and password',
      });
    }

    setIsProcessing(true);
    await accountAPI
      .getOneTimeCode(authData.email, authData.password)
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <Stack vertical alignment="fill" spacing="extraLoose">
      <Title style={{ textAlign: 'center' }} level={4}>
        Please enter the verification code
        <br />
        we just sent to your email or sms
      </Title>
      {wrongPassword && <Alert message="Wrong password" type="error" />}
      <Stack.Item>
        <S.Form
          form={form}
          disabled={isProcessing}
          title="Verification code"
          onFinish={submitOneTimeCode as any}
          onFinishFailed={() => {}}
          requiredMark={false}
          colon={false}
          validateTrigger={'onSubmit'}
          size={'middle'}
          layout={'vertical'}
          style={{ minWidth: 320 }}
        >
          <Form.Item
            label="Verification code"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please, enter code',
              },
            ]}
          >
            <InputPassword
              placeholder="Type code"
              size="large"
              prefix={<Passcode />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isProcessing}
              size={'large'}
              block
              type="primary"
              htmlType="submit"
            >
              Continue
            </Button>
          </Form.Item>
          <Stack spacing="extraTight">
            <Text type="secondary">Didn't get a code? </Text>
            {isProcessing ? (
              <LoadingOutlined />
            ) : (
              <a onClick={resendCode}>Resend</a>
            )}
          </Stack>
          <Stack spacing="extraTight">
            <Text type="secondary">
              Back to <a href="/account/sign-in">login page</a>
            </Text>
          </Stack>
        </S.Form>
      </Stack.Item>
    </Stack>
  );
};
