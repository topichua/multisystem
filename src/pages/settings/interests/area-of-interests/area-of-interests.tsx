import { FileQuestion01 } from '@untitled-ui/icons-react';
import { Empty, Form, Skeleton, Spin, Typography } from 'antd';
import { Button } from 'src/components/common/Button/Button';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { components } from 'src/styled/definitions/colors';
import styled from 'styled-components';
import { useInterestsStore } from '../interests.provider';
import { observer } from 'mobx-react';

const FormStyled = styled(Form)`
  .ant-form-item-row {
    display: flex;
    align-items: center;
    max-width: 932px;
  }
`;

const { Text } = Typography;

export const AreaOfInterests = observer(() => {
  const {
    areaOfInterests,
    isLoadingAreaOfInterests,
    isInterestAdded,
    addInterestToUser,
    isLoadingUserInterests,
    removeInterestFromUser,
    loadingInterests,
  } = useInterestsStore();

  if (isLoadingAreaOfInterests || isLoadingUserInterests) {
    return <Skeleton />;
  }

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<FileQuestion01 color={components.colors.brandColor} />}
          title="Practice Areas of Interest"
        />
      </FixedContentHeader>
      <Page.Content>
        <Page.Wrapper>
          <Spin spinning={isLoadingAreaOfInterests}>
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
                  <Title level={3}>Practice Areas of Interest</Title>
                  <Text>
                    Please select the areas of practice that you are interested
                    in receiving information about from the list below. <br />{' '}
                    You can also remove previously selected areas of practice
                    that you are no longer interested in.
                  </Text>
                </Stack>
                <Stack vertical spacing={'none'}>
                  {areaOfInterests.length > 0
                    ? areaOfInterests.map((item, index) => (
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
                              danger={isInterestAdded(item.id)}
                              loading={loadingInterests[item.id] || false}
                              onClick={() => {
                                if (isInterestAdded(item.id)) {
                                  removeInterestFromUser(item.id);
                                } else {
                                  addInterestToUser(item);
                                }
                              }}
                            >
                              {isInterestAdded(item.id)
                                ? 'Remove from your list'
                                : 'Add to your interest'}
                            </Button>
                          </Stack>
                        </Form.Item>
                      ))
                    : !isLoadingAreaOfInterests && (
                        <Empty description="No interests available" />
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
