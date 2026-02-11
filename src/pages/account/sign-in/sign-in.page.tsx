import { useMemo, useState } from 'react';
import { Mail01, Passcode } from '@untitled-ui/icons-react';
import { Alert, Form, notification, Typography } from 'antd';
import { useWatch } from 'antd/es/form/Form';

import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { Input, InputPassword } from 'src/components/common/Input/Input';
import { ExternalLink, InternalLink } from 'src/components/common/Link/Link';
import { Button } from 'src/components/common/Button/Button';
import { accountAPI } from 'src/transport/account/account.api';
import { storeUserCredentialsInLocalStorage } from 'src/utils/route-utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { pagesMap } from 'src/pages/authorized/routes';
import { EMAIL_REGEX } from 'src/utils/text';
import config from 'src/projects/factory';

import * as S from '../account.styled';
import { useAuth } from 'src/context/auth-context';

const { Text } = Typography;
const HeaderLogoImg = config.logo;

export const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProccessing, setisProccessing] = useState(false);
  const [wrongCredentialsMessage, setWrongCredentialsMessage] = useState<
    string | null
  >(null);

  const [form] = Form.useForm();
  const values = useWatch([], form);
  const { setAuthData } = useAuth();

  const getOneTimeCode = (formData: {
    email: string;
    password: string;
  }): void => {
    setisProccessing(true);

    accountAPI
      .getOneTimeCode(formData.email, formData.password)
      .then((resp) => {
        if (resp.data.tfaDisabled) {
          accountAPI
            .login(formData.email, formData.password)
            .then((data) => {
              storeUserCredentialsInLocalStorage(data);
              const redirectPath = location.state?.from || pagesMap.home;
              navigate(redirectPath, { replace: true });
            })
            .catch((error: any) => {
              const serverError =
                error?.response?.data?.error_description ||
                error?.response?.data?.message;

              if (serverError !== 'Invalid credential') {
                notification.error({
                  message: serverError,
                });
              } else {
                setWrongCredentialsMessage(
                  'The user name or password is incorrect.'
                );
              }

              form.setFieldValue('password', '');
            });
        } else {
          setAuthData({ email: formData.email, password: formData.password });
          navigate('/account/enter-password');
        }
      })
      .catch((error: any) => {
        const serverError =
          error?.response?.data?.error_description ||
          error?.response?.data?.message;

        if (serverError !== 'Invalid credential') {
          notification.error({
            message: serverError,
          });
        } else {
          setWrongCredentialsMessage('The user name or password is incorrect.');
        }

        form.setFieldValue('password', '');
      })
      .finally(() => {
        setisProccessing(false);
      });
  };

  const isDisableContinueButton = useMemo(() => {
    return !EMAIL_REGEX.test(values?.email) || values?.password?.length < 2;
  }, [values]);

  return (
    <Stack vertical alignment="fill" spacing="extraLoose">
      <Stack
        alignment="center"
        distribution="center"
        style={{ marginBottom: 90 }}
      >
        <ExternalLink href="https://site.com"></ExternalLink>
      </Stack>
      <Title style={{ textAlign: "center" }} level={4}>
        Log into your {config.name} Connect
      </Title>
      <Stack.Item>
        <S.Form
          form={form}
          disabled={isProccessing}
          title="Login "
          initialValues={{ remember: true, email: "", password: "" }}
          // onFinish={login as any}
          onFinish={getOneTimeCode as any}
          requiredMark={false}
          colon={false}
          validateTrigger={"onSubmit"}
          size={"middle"}
          layout={"vertical"}
          style={{ minWidth: 320 }}
          onValuesChange={(changedValues) => {
            localStorage.setItem("authorization", "avl");
            const fieldName = Object.keys(changedValues)[0];
            form.setFields([{ name: fieldName, errors: [] }]);
            setWrongCredentialsMessage(null);
          }}
        >
          <Form.Item label="Email address" name="email">
            <Input
              placeholder="email@bondhub.com"
              size="large"
              prefix={<Mail01 />}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please type password",
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <InputPassword
                placeholder="Type password"
                size="large"
                prefix={<Passcode />}
              />
            </Form.Item>

            <Stack distribution="trailing" style={{ margin: "6px 0" }}>
              <InternalLink href="/account/forgot-password">
                Forgot password?
              </InternalLink>
            </Stack>
          </Form.Item>

          {wrongCredentialsMessage && (
            <Form.Item>
              <Alert
                message={wrongCredentialsMessage}
                type="error"
                style={{ marginBottom: 8 }}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              loading={isProccessing}
              size={"large"}
              block
              type="primary"
              htmlType="submit"
              disabled={isDisableContinueButton}
            >
              Continue
            </Button>
          </Form.Item>
          <Text type="secondary">Don't have an account? Go back to </Text>
          <ExternalLink href="https://otaus.com.au/">otaus.com.au</ExternalLink>
        </S.Form>
      </Stack.Item>
    </Stack>
  );
};
