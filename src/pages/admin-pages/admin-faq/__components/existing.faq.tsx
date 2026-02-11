import { Trash01 } from '@untitled-ui/icons-react';
import { Card, Empty, Input, Tag, Tooltip, Typography } from 'antd';
import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import * as S from '../admin.faq.page.styled';
import { FaqItem } from 'src/transport/faq/faq.dto';

const { Text } = Typography;

type ExistingFaqProps = {
  faqList: FaqItem[];
  isLoading: boolean;
  removeFaq: (id: string) => void;
  handleInputChange: any;
  setFaqList: any;
};

export const ExistingFaq = (props: ExistingFaqProps) => {
  const { faqList, isLoading, removeFaq, handleInputChange, setFaqList } =
    props;

  const addNewFaq = () => {
    setFaqList([
      ...faqList,
      {
        name: '',
        description: '',
        id: '',
        createdAt: '',
        createdByUserId: '',
        isDeleted: false,
        updatedAt: '',
        updatedByUserId: '',
      },
    ]);
  };

  const removeNewFaq = (id: string) => {
    setFaqList(faqList.filter((faq) => faq.id !== id));
  };

  return (
    <>
      {faqList.length > 0 ? (
        <Stack vertical>
          {faqList
            .filter((item) => !item.isDeleted)
            .map((faq, index) => {
              return (
                <Card
                  key={faq.id}
                  title={
                    <Stack distribution="equalSpacing">
                      <Stack>
                        <Text>Question-answer block #{index + 1}</Text>
                        {faq.isDeleted && <Tag color="red">Deleted</Tag>}
                      </Stack>
                      <Tooltip title="Delete block">
                        <Button
                          type="link"
                          ghost
                          icon={
                            <Trash01 style={{ height: 16 }} fontSize={16} />
                          }
                          danger
                          onClick={() =>
                            faq.createdAt
                              ? removeFaq(faq.id)
                              : removeNewFaq(faq.id)
                          }
                          loading={isLoading}
                          disabled={faq.isDeleted}
                        />
                      </Tooltip>
                    </Stack>
                  }
                >
                  <Stack fill alignment="center">
                    <Stack spacing="none" vertical>
                      <S.FormItem
                        label="Question"
                        name={['faqList', index, 'name']}
                        rules={[
                          {
                            required: true,
                            message: 'Please input the question!',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Type question"
                          value={faq.name}
                          onChange={(e) =>
                            handleInputChange(index, 'name', e.target.value)
                          }
                        />
                      </S.FormItem>
                      <S.FormItem
                        label="Answer"
                        name={['faqList', index, 'description']}
                        rules={[
                          {
                            required: true,
                            message: 'Please input the answer!',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Type answer"
                          value={faq.description}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                        />
                      </S.FormItem>
                    </Stack>
                  </Stack>
                </Card>
              );
            })}

          <Button type="primary" onClick={addNewFaq}>
            Add question-answer block
          </Button>
        </Stack>
      ) : (
        !isLoading && (
          <Empty
            description={
              <Stack vertical alignment="center">
                <Text>There are no FAQ</Text>
                <Button type="primary" onClick={addNewFaq}>
                  Add first question-answer block
                </Button>
              </Stack>
            }
          />
        )
      )}
    </>
  );
};
