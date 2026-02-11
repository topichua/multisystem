import { useState } from 'react';
import { Edit05 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Empty } from 'antd';
import { EditorState, LexicalEditor } from 'lexical';

import { Button } from 'src/components/common/Button/Button';
import { Card } from 'src/components/common/Card/Card';
import { Editor, EditorOrderEnum } from 'src/components/common/Editor/Editor';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { Modal } from 'src/components/common/Modal/Modal';

type CommunityAboutCardProps = {
  about: string | null;
  canEdit?: boolean;
  isLoading?: boolean;
  onEdit?: (content: string) => Promise<void>;
};

export const CommunityAboutCard = ({
  about,
  canEdit = false,
  isLoading = false,
  onEdit,
}: CommunityAboutCardProps) => {
  const [isOpenEditor, { setTrue: openEditor, setFalse: closeEditor }] =
    useBoolean(false);

  const [content, setContent] = useState('');

  const onChangeContent = (
    _editorState: EditorState,
    _editor: LexicalEditor
  ) => {
    setContent(_editor._rootElement?.innerHTML ?? '');
  };

  const editAbout = async () => {
    if (onEdit) {
      await onEdit(content);
      closeEditor();
    }
  };

  return (
    <Card>
      <Stack vertical spacing="loose">
        <Stack distribution="equalSpacing">
          <Title level={4}>Who are we?</Title>
          {canEdit && (
            <Button type="link" icon={<Edit05 />} onClick={openEditor} />
          )}
        </Stack>

        {about ? (
          <div dangerouslySetInnerHTML={{ __html: about }} />
        ) : (
          <Empty description="No about yet" />
        )}
      </Stack>

      <Modal
        title="Who we are"
        open={isOpenEditor}
        width={700}
        onCancel={closeEditor}
        okText="Publish"
        okButtonProps={{ loading: isLoading }}
        onOk={editAbout}
        style={{ top: 20 }}
      >
        <Editor
          styles={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'scroll' }}
          onChange={onChangeContent}
          order={EditorOrderEnum.Reverse}
          initialContent={about || ''}
        />
      </Modal>
    </Card>
  );
};
