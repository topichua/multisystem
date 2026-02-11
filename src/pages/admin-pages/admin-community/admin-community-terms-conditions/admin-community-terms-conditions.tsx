import { useEffect } from 'react';
import { Edit05 } from '@untitled-ui/icons-react';
import { Form, Skeleton, Spin, Switch } from 'antd';
import { observer } from 'mobx-react';
import { useBoolean } from 'ahooks';

import { Button } from 'src/components/common/Button/Button.tsx';
import {
  Editor,
  EditorOrderEnum,
} from 'src/components/common/Editor/Editor.tsx';
import { Modal } from 'src/components/common/Modal/Modal.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title';
import { Card } from 'src/components/common/Card/Card.tsx';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout.tsx';

import { useCommunityManagementStore } from '../admin-community.provider.tsx';

import { useTermsConditions } from './useTermsConditions.ts';

export const AdminCommunityTermsConditions = observer(() => {
  const {
    form,
    content,
    editorContent,
    setEditorContent,
    handleSave,
    isSaveLoading,
    initContent,
    isRequireAgreement,
  } = useTermsConditions();

  const { community, permissions } = useCommunityManagementStore();
  const { globalPermission } = useCurrentUserStore();

  const [isOpenEditor, { setTrue: openEditor, setFalse: closeEditor }] =
    useBoolean(false);

  useEffect(() => {
    if (community?.id) {
      form.setFieldsValue({
        isRequireAgreement: community.isRequireAgreement,
      });
    }
  }, [community, form]);

  const canEditTC = permissions?.commentEdit || globalPermission?.commentEdit;

  return (
    <>
      <Stack vertical>
        <Card style={{ maxWidth: 1064, margin: '0 auto' }}>
          <Stack distribution="equalSpacing">
            <Form form={form}>
              <Form.Item
                label="Require Terms and Conditions approval"
                name="isRequireAgreement"
                style={{ marginBottom: 0 }}
              >
                <Switch loading={isSaveLoading} disabled={!canEditTC} />
              </Form.Item>
            </Form>
            {isRequireAgreement && (
              <Button
                type="link"
                icon={<Edit05 />}
                disabled={!canEditTC}
                onClick={openEditor}
              />
            )}
          </Stack>
        </Card>
        {isRequireAgreement && (
          <Card style={{ maxWidth: 1064, margin: '0 auto' }}>
            <Stack vertical spacing="loose">
              <Stack alignment="center" distribution="equalSpacing">
                <Title level={4}>Terms and Conditions</Title>
              </Stack>

              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <Skeleton />
              )}
            </Stack>

            <Modal
              title="Terms and Conditions"
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
                  initialContent={editorContent.trim() || ''}
                  order={EditorOrderEnum.Reverse}
                />
              </Spin>
            </Modal>
          </Card>
        )}
      </Stack>
    </>
  );
});
