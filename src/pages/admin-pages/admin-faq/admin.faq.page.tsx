import { MessageQuestionCircle } from '@untitled-ui/icons-react';
import { Form, notification, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Button } from 'src/components/common/Button/Button';
import { Divider } from 'src/components/common/Divider/Divider.styled';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { faqApi } from 'src/transport/faq/faq.api';
import { FaqItem } from 'src/transport/faq/faq.dto';
import { DeletedFaq } from './__components/deleted.faq';
import { ExistingFaq } from './__components/existing.faq';

export const FaqPage = () => {
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [originalFaqList, setOriginalFaqList] = useState<FaqItem[]>([]);
  const [deletedFaqList, setDeletedFaqList] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const removeFaq = (id: string) => {
    setIsLoading(true);

    if (id === 'newId') {
      fetchFaq();
      return;
    }

    faqApi
      .deleteQuestion(id)
      .then(() => {
        notification.success({
          message: 'Successfuly deleted',
        });
        fetchFaq();
      })
      .catch((error) => {
        notification.error({
          message: `Error during deleting: ${error}`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (
    index: number,
    field: keyof FaqItem,
    value: string
  ) => {
    const newFaqList = [...faqList];
    newFaqList[index] = { ...newFaqList[index], [field]: value };
    setFaqList(newFaqList);
    form.setFieldsValue({ faqList: newFaqList });
  };

  const restoreQuestion = (id: string) => {
    setIsLoading(true);
    faqApi
      .restoreQuestion(id)
      .then(() => {
        notification.success({
          message: 'Successfuly restored',
        });
        fetchFaq();
      })
      .catch((error) => {
        notification.error({
          message: `Error during restoring: ${error}`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        const newFaqList = getNewFaqList();
        const updatedFaqList = getUpdatedFaqList();

        if (newFaqList.length === 0 && updatedFaqList.length === 0) {
          notification.info({
            message: 'No changes to save',
          });
          return;
        }

        setIsLoading(true);

        const createPromises = newFaqList.map((faq) => faqApi.createFaq(faq));

        const updatePromises = updatedFaqList.map((faq) =>
          faqApi.updateFaq(faq.id, faq)
        );

        Promise.all([...createPromises, ...updatePromises])
          .then(() => {
            notification.success({
              message: 'Successfully saved',
            });
            fetchFaq();
          })
          .catch((error) => {
            notification.error({
              message: `Error during saving: ${error}`,
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((errorInfo) => {
        console.error('Validation error:', errorInfo);
      });
  };

  const fetchFaq = () => {
    setIsLoading(true);
    faqApi
      .getAllAdminFaq()
      .then((resp) => {
        const existingFaq = resp.faQs.filter((item) => !item.isDeleted);
        const deletedFaq = resp.faQs.filter((item) => item.isDeleted);
        setFaqList(existingFaq);
        setDeletedFaqList(deletedFaq);
        setOriginalFaqList(existingFaq);
        form.setFieldsValue({ faqList: existingFaq });
      })
      .catch((error) => {
        notification.error({
          message: `Error during loading FAQ list. ${error}`,
        });
      })
      .finally(() => setIsLoading(false));
  };

  const getNewFaqList = () => {
    return faqList.filter((faq) => !faq.id);
  };

  const getUpdatedFaqList = () => {
    return faqList.filter((faq) => {
      const originalFaq = originalFaqList.find((item) => item.id === faq.id);

      return (
        originalFaq &&
        (faq.name !== originalFaq.name ||
          faq.description !== originalFaq.description)
      );
    });
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<MessageQuestionCircle />}
          title="Create frequently asked questions"
        >
          <Stack distribution="trailing">
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={faqList.length === 0}
            >
              Save
            </Button>
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>
      <Page.Content
        style={{ margin: '0 auto', background: 'white', width: 1120 }}
      >
        <Spin spinning={isLoading} tip="Loading...">
          <Stack vertical spacing="extraLoose">
            <Title level={3}>Frequently asked questions</Title>
            <Form form={form} layout="vertical">
              <ExistingFaq
                faqList={faqList}
                isLoading={isLoading}
                removeFaq={removeFaq}
                handleInputChange={handleInputChange}
                setFaqList={setFaqList}
              />
            </Form>
            <Divider spacing="extraLoose" />
            {deletedFaqList.length > 0 && (
              <DeletedFaq
                deletedFaqList={deletedFaqList}
                isLoading={isLoading}
                restoreQuestion={restoreQuestion}
              />
            )}
          </Stack>
        </Spin>
      </Page.Content>
    </>
  );
};
