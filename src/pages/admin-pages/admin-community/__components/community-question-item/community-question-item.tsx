import { DotsHorizontal } from '@untitled-ui/icons-react';
import { Dropdown, Typography } from 'antd';

import { Button } from 'src/components/common/Button/Button';
import { Card } from 'src/components/common/Card/Card';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { CommunityQuestion } from 'src/transport/communities/communities.dto';

const { Text } = Typography;

export type CommunityQuestionItemProps = {
  question: CommunityQuestion;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
};

export const CommunityQuestionItem = ({
  index,
  question,
  onEdit,
  onDelete,
}: CommunityQuestionItemProps) => {
  return (
    <Card
      title={
        <Stack alignment="center" distribution="equalSpacing">
          <Stack.Item fill>
            <Title level={5}>Question #{index + 1}</Title>
          </Stack.Item>

          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Edit',
                  onClick: onEdit,
                },
                {
                  key: '2',
                  label: 'Delete',
                  danger: true,
                  onClick: onDelete,
                },
              ],
            }}
          >
            <Button type="link" icon={<DotsHorizontal />} />
          </Dropdown>
        </Stack>
      }
    >
      <Stack vertical spacing="none">
        <Title level={5}>{question.text}</Title>

        {question.isRequiredAssets && (
          <Text type="secondary">Asset is required</Text>
        )}
      </Stack>
    </Card>
  );
};
