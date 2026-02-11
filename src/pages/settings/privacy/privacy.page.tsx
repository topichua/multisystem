import { Shield02 } from '@untitled-ui/icons-react';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { components } from 'src/styled/definitions/colors';
import { Col, Radio, Row, Typography } from 'antd';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { privacy_MOCK } from 'src/MOCK_DATA/privacy_MOCK';
import { Divider } from 'src/components/common/Divider/Divider';

const { Text } = Typography;

export const PrivacyPage = () => {
  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Shield02 color={components.colors.brandColor} />}
          title="Privacy"
        />
      </FixedContentHeader>
      <Page.Content
        style={{ maxWidth: 1064, minHeight: 500, margin: '0 auto' }}
      >
        {privacy_MOCK.map((item, index) => {
          return (
            <>
              <Row gutter={[16, 0]} justify="space-between">
                <Col span={9}>
                  <Stack vertical spacing="none">
                    <Text strong>{item.title}</Text>
                    <Text>{item.description}</Text>
                  </Stack>
                </Col>
                <Col offset={1} span={14}>
                  <Radio.Group
                    defaultValue={
                      item.values.find((value) => value.active)?.title
                    }
                    buttonStyle="solid"
                  >
                    {item.values.map((value) => (
                      <Radio.Button value={value.title}>
                        {value.title}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </Col>
              </Row>
              {index < privacy_MOCK.length - 1 && (
                <Divider spacing="extraLoose" />
              )}
            </>
          );
        })}
      </Page.Content>
    </>
  );
};
