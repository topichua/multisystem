import { Edit05, FileCheck02 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Empty, Skeleton, Spin } from 'antd';
import { observer } from 'mobx-react';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Card } from 'src/components/common/Card/Card.tsx';
import {
  Editor,
  EditorOrderEnum,
} from 'src/components/common/Editor/Editor.tsx';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header.tsx';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header.tsx';
import { Modal } from 'src/components/common/Modal/Modal.tsx';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title';
import { useTermsConditions } from './useTermsConditions.ts';

export const AdminGlobalTermsConditions = observer(() => {
  const {
    content,
    editorContent,
    setEditorContent,
    handleSave,
    isSaveLoading,
    isLoading,
    initContent,
  } = useTermsConditions();

  const [isOpenEditor, { setTrue: openEditor, setFalse: closeEditor }] =
    useBoolean(false);

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<FileCheck02 />}
          title="Global Terms and Conditions"
        >
          <Stack distribution="trailing">
            <Button type="link" icon={<Edit05 />} onClick={openEditor} />
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>
      <Page.Content>
        <Stack vertical>
          <Card style={{ maxWidth: 1064, margin: '0 auto' }}>
            <Stack vertical spacing="loose">
              <Title level={4}>Terms and Conditions</Title>

              {isLoading ? (
                <Skeleton active />
              ) : content.length > 0 ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <Empty description="No content" />
              )}
            </Stack>

            <Modal
              title="Global Terms and Conditions"
              open={isOpenEditor}
              width={700}
              onCancel={() => {
                closeEditor();
                setEditorContent(initContent);
              }}
              okText="Save"
              onOk={() => {
                handleSave();
                closeEditor();
              }}
              confirmLoading={isSaveLoading}
              style={{ top: 20 }}
            >
              <Spin spinning={isSaveLoading}>
                <Editor
                  styles={{
                    maxHeight: 'calc(100vh - 300px)',
                    overflowY: 'scroll',
                  }}
                  placeholder=""
                  onChange={(_, editor) =>
                    setEditorContent(editor._rootElement?.innerHTML ?? '')
                  }
                  initialContent={editorContent || ''}
                  order={EditorOrderEnum.Reverse}
                />
              </Spin>
            </Modal>
          </Card>
        </Stack>
      </Page.Content>
    </>
  );
});
