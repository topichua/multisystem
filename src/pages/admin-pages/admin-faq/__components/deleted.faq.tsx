import { RefreshCcw01 } from '@untitled-ui/icons-react';
import { Card, Tag, Tooltip, Typography } from 'antd';
import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { FaqItem } from 'src/transport/faq/faq.dto';

const { Text } = Typography;

type DeletedFaqProps = {
  deletedFaqList: FaqItem[];
  isLoading: boolean;
  restoreQuestion: (id: string) => void;
};

export const DeletedFaq = (props: DeletedFaqProps) => {
  const { deletedFaqList, isLoading, restoreQuestion } = props;

  return (
    <Stack vertical>
      <Title level={3}>Recently deleted Frequently asked questions</Title>
      {deletedFaqList.map((deletedFaq) => (
        <Card
          key={deletedFaq.id}
          title={
            <Stack distribution="equalSpacing">
              <Stack>
                <Text>Question-answer block</Text>
                {deletedFaq.isDeleted && <Tag color="red">Deleted</Tag>}
              </Stack>
              <Tooltip title="Restore block">
                <Button
                  type="link"
                  ghost
                  icon={<RefreshCcw01 style={{ height: 16 }} fontSize={16} />}
                  onClick={() => restoreQuestion(deletedFaq.id)}
                  loading={isLoading}
                />
              </Tooltip>
            </Stack>
          }
        >
          <Stack fill alignment="center">
            <Stack vertical>
              <Title level={4}>{deletedFaq.name}</Title>
              <Text>{deletedFaq.description}</Text>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};
