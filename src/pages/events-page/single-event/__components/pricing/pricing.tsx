import { Collapse, CollapseProps, Typography } from 'antd';
import { useMemo } from 'react';

import { Card } from 'src/components/common/Card/Card';
import { Divider } from 'src/components/common/Divider/Divider';
import { Stack } from 'src/components/common/Stack/Stack';
import { formatPrice } from 'src/utils/text';

const { Text } = Typography;

const FAKE_PRICE_DETAILS = [
  {
    title: 'Member',
    options: [
      {
        description: 'Early bird (before 15 October 2024)',
        price: 745.0,
      },
      {
        description: 'Standard (after 16 October 2024)',
        price: 906.0,
      },
      {
        description: 'Day',
        price: 491.0,
      },
    ],
  },
  {
    title: 'Non-member',
    options: [
      {
        description: 'Early bird (before 15 October 2024)',
        price: 745.0,
      },
      {
        description: 'Standard (after 16 October 2024)',
        price: 906.0,
      },
      {
        description: 'Day',
        price: 491.0,
      },
    ],
  },
  {
    title: 'New graduate member',
    options: [
      {
        description: 'Early bird (before 15 October 2024)',
        price: 745.0,
      },
      {
        description: 'Standard (after 16 October 2024)',
        price: 906.0,
      },
      {
        description: 'Day',
        price: 491.0,
      },
    ],
  },
];

export const Pricing = () => {
  const items: CollapseProps['items'] = useMemo(() => {
    return FAKE_PRICE_DETAILS.map((priceDetails, index) => ({
      key: `${index}`,
      label: priceDetails.title,
      children: (
        <Stack vertical spacing="none">
          {priceDetails.options.map((option, index) => {
            const isLast = index === priceDetails.options.length - 1;

            return (
              <>
                <Stack key={index}>
                  <Stack.Item fill>
                    <Text type="secondary">{option.description}</Text>
                  </Stack.Item>

                  <Text strong>{formatPrice(option.price)}</Text>
                </Stack>

                {!isLast && <Divider spacing="normal" />}
              </>
            );
          })}
        </Stack>
      ),
    }));
  }, []);

  return (
    <Card title="Pricing">
      <Stack vertical>
        <Text type="secondary">
          All prices are in Australian Dollars and inclusive of 10% GST.If
          you're unsure of your registration type, head to our 
          <Text strong> registration categories page</Text> for descriptions of
          member, new graduate and student eligibility.
        </Text>

        <Collapse items={items} size="small" defaultActiveKey={['0']} />
      </Stack>
    </Card>
  );
};
