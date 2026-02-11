import { Result } from 'antd';
import { Page } from 'src/components/common/page/page';

export const MarketplacePage = () => {
  return (
    <Page.Content style={{ width: 1064, minHeight: 500, margin: '0 auto' }}>
      <Result
        status="500"
        title="Oops!"
        subTitle="Sorry, page is under construction!"
      />
    </Page.Content>
  );
};
