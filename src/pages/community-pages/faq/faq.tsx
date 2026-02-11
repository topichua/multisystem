import { CollapseProps, notification, Spin, Typography } from 'antd';
import { HelpOctagon } from '@untitled-ui/icons-react';
import { components } from 'src/styled/definitions/colors';
import * as S from './faq.styled';
import { Page } from 'src/components/common/page/page';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header.tsx';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { useEffect, useState } from 'react';
import { faqApi } from 'src/transport/faq/faq.api';
import { FaqItem } from 'src/transport/faq/faq.dto';
import { Stack } from 'src/components/common/Stack/Stack';

const { Title } = Typography;

export const Faq = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [faqList, setFaqList] = useState<FaqItem[]>([]);

  const collapseItems: CollapseProps['items'] = faqList.map((item) => ({
    key: item.id,
    label: item.name,
    children: <span dangerouslySetInnerHTML={{ __html: item.description }} />,
  }));

  useEffect(() => {
    setIsLoading(true);
    faqApi
      .getAllFaq()
      .then((res) => {
        setFaqList(res.faQs);
      })
      .catch((error) => {
        notification.error({
          message: `Error during loading FAQ list. ${error}`,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<HelpOctagon color={components.colors.brandColor} />}
          title="Frequently asked questions"
        />
      </FixedContentHeader>
      <Spin spinning={isLoading}>
        <Page.Wrapper width="small">
          <Page.Content>
            <Stack alignment="center" vertical>
              <Title level={3}>
                Answers to common questions on Communities including Specialty
                Practice Groups
              </Title>
              <Stack.Item fill>
                <S.Collapse
                  items={collapseItems}
                  defaultActiveKey={collapseItems[0]?.key as string}
                  expandIconPosition="end"
                  bordered={false}
                  style={{ minWidth: '300px', width: 800 }}
                />
              </Stack.Item>
            </Stack>
          </Page.Content>
        </Page.Wrapper>
      </Spin>
    </>
  );
};
