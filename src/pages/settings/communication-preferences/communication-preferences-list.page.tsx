import { Bell04 } from '@untitled-ui/icons-react';
import { Empty, Form, Skeleton, Spin, Typography } from 'antd';
import { observer } from 'mobx-react';
import { Button } from 'src/components/common/Button/Button';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { components } from 'src/styled/definitions/colors';
import styled from 'styled-components';
import { useCommunicationPreferncesStore } from './communication-preferences.provider';

const { Text } = Typography;

const FormStyled = styled(Form)`
  .ant-form-item-row {
    display: flex;
    align-items: center;
    max-width: 960px;
    max-height: 56px;
  }
`;

export const CommunicationPreferencesList = observer(() => {
  const {
    listOfPreferences,
    isLoadingListOfPreferences,
    isPreferenceAdded,
    loadingPreferences,
    removePreferenceFromUser,
    addPreferenceToUser,
    isLoadingUserPreferences,
  } = useCommunicationPreferncesStore();

  if (isLoadingListOfPreferences) {
    return <Skeleton active />;
  }

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Bell04 color={components.colors.brandColor} />}
          title="All communication preferences"
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
                  <Title level={3}>OTA Communications</Title>
                  <Text>
                    Please select the OTA communications you would like to
                    receive from the list below. <br /> You can also remove
                    previously selected communications that you no longer wish
                    to receive.
                  </Text>
                </Stack>
                <Stack vertical spacing={'none'}>
                  {listOfPreferences.length > 0
                    ? listOfPreferences.map((item, index) => (
                        <Form.Item
                          key={item.id}
                          label={
                            <Text>
                              {index + 1}.{' '}
                              <Text strong>{item.name || '-'}</Text>
                            </Text>
                          }
                          name={item.name}
                        >
                          <Stack alignment="center" distribution="trailing">
                            <Button
                              type="primary"
                              size="small"
                              danger={isPreferenceAdded(item.id)}
                              loading={loadingPreferences[item.id] || false}
                              onClick={() => {
                                if (isPreferenceAdded(item.id)) {
                                  removePreferenceFromUser(item.id);
                                } else {
                                  addPreferenceToUser(item);
                                }
                              }}
                            >
                              {isPreferenceAdded(item.id)
                                ? 'Remove from your list'
                                : 'Add to your list'}
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
