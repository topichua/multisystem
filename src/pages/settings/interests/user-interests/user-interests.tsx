import { UserCheck01 } from '@untitled-ui/icons-react';
import { Empty, Form, Spin, Typography } from 'antd';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { components } from 'src/styled/definitions/colors';
import styled from 'styled-components';
import { useInterestsStore } from '../interests.provider';
import { observer } from 'mobx-react';
import { Button } from 'src/components/common/Button/Button';

const FormStyled = styled(Form)`
  .ant-form-item-row {
    display: flex;
    align-items: center;
    max-width: 932px;
  }
`;

const { Text } = Typography;

export const UserInterests = observer(() => {
  const {
    userInterests,
    isLoadingUserInterests,
    removeInterestFromUser,
    loadingInterests,
  } = useInterestsStore();

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<UserCheck01 color={components.colors.brandColor} />}
          title="My Areas of Interest"
        />
      </FixedContentHeader>
      <Page.Content>
        <Page.Wrapper>
          <Spin spinning={isLoadingUserInterests}>
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
                  <Title level={3}>My Areas of Interest</Title>
                  <Text>
                    Simply go to Practice Areas of Interest to add additional
                    areas to your list.
                  </Text>
                </Stack>
                <Stack vertical spacing={'none'}>
                  {userInterests.length > 0
                    ? userInterests.map((item, index) => (
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
                                loadingInterests[item.segmentId] || false
                              }
                              onClick={() =>
                                removeInterestFromUser(item.segmentId)
                              }
                            >
                              Remove
                            </Button>
                          </Stack>
                        </Form.Item>
                      ))
                    : !isLoadingUserInterests && (
                        <Empty description="No interests yet" />
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
