import { NotificationBox } from '@untitled-ui/icons-react';
import { Empty, Form, Spin, Typography } from 'antd';
import { observer } from 'mobx-react';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { components } from 'src/styled/definitions/colors';
import styled from 'styled-components';
import { useCommunicationPreferncesStore } from './communication-preferences.provider';
import { Button } from 'src/components/common/Button/Button';

const { Text } = Typography;

const FormStyled = styled(Form)`
  .ant-form-item-row {
    display: flex;
    align-items: center;
    max-width: 960px;
  }
`;

export const UserCommunicationPreferences = observer(() => {
  const {
    isLoadingUserPreferences,
    userPreferences,
    loadingPreferences,
    removePreferenceFromUser,
  } = useCommunicationPreferncesStore();

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<NotificationBox color={components.colors.brandColor} />}
          title="My communication preferences"
        />
      </FixedContentHeader>
      <Page.Content>
        <Page.Wrapper>
          <Spin spinning={isLoadingUserPreferences}>
            <FormStyled
              labelAlign={'left'}
              labelWrap={false}
              initialValues={{}}
              onFinish={() => {}}
              onFinishFailed={() => {}}
              requiredMark={false}
              colon={false}
              validateTrigger={'onSubmit'}
              size={'middle'}
              labelCol={{ span: 23 }}
              wrapperCol={{ span: 1 }}
              layout={'horizontal'}
            >
              <Stack vertical spacing="extraLoose">
                <Stack vertical spacing="extraTight">
                  <Title level={3}>My communication preferences</Title>
                  <Text>
                    Simply go to All Communications Preferences to add further
                    communications to your list.
                  </Text>
                </Stack>
                <Stack vertical spacing={'none'}>
                  {userPreferences.length > 0
                    ? userPreferences.map((item, index) => (
                        <Form.Item
                          key={item.segmentId}
                          label={
                            <Text>
                              {index + 1}.{' '}
                              <Text strong>{item.segmentName || '-'}</Text>
                            </Text>
                          }
                          name={item.segmentName}
                        >
                          <Stack alignment="center" distribution="trailing">
                            <Button
                              size="small"
                              danger
                              type="primary"
                              loading={
                                loadingPreferences[item.segmentId] || false
                              }
                              onClick={() =>
                                removePreferenceFromUser(item.segmentId)
                              }
                            >
                              Remove
                            </Button>
                          </Stack>
                        </Form.Item>
                      ))
                    : !isLoadingUserPreferences && (
                        <Empty description="No communication preferences available" />
                      )}
                </Stack>
              </Stack>
            </FormStyled>
          </Spin>
        </Page.Wrapper>
      </Page.Content>
    </>
  );
});
