import { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import { TextAreaProps } from 'antd/es/input/TextArea';
import { EditorState, LexicalEditor } from 'lexical';

import { Stack } from 'src/components/common/Stack/Stack';
import { Button } from 'src/components/common/Button/Button';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import { UserProfileDto } from 'src/transport/account/account.dto';
import { Editor, EditorOrderEnum } from '../Editor/Editor';

import * as S from './CommentInput.styled';

type CommentInputProps = {
  comment: string;
  isLoading?: boolean;
  showTitle?: boolean;
  saveText?: string;
  footer?: ReactNode;
  currentUser?: UserProfileDto;
  onChangeComment: (comment: string) => void;
  onClose?: () => void;
  onSave: () => void;
} & TextAreaProps;

export const CommentInput = forwardRef<any, CommentInputProps>(
  (
    {
      comment,
      isLoading = false,
      showTitle = true,
      saveText = 'Add',
      footer,
      currentUser,
      onClose,
      onSave,
      onChangeComment,
    },
    ref
  ) => {
    const editorRef = useRef<{ focus: () => void; clear: () => void }>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        editorRef.current?.focus();
      },
      clear: () => {
        editorRef.current?.clear();
      },
    }));

    const isDisabledAdd = comment.trim() === '';

    return (
      <Stack vertical>
        {showTitle && <S.Text>Comment</S.Text>}

        <S.Wrapper>
          <UserAvatar
            shape="circle"
            firstName={currentUser?.firstName || ''}
            lastName={currentUser?.lastName || ''}
          />
          <Stack vertical style={{ flex: 1 }}>
            <S.EditorWrapper>
              <Editor
                ref={editorRef}
                order={EditorOrderEnum.Default}
                initialContent={comment || ' '}
                allowedBlocks={['ol', 'paragraph', 'quote', 'ul']}
                onChange={(
                  _editorState: EditorState,
                  _editor: LexicalEditor
                ) => {
                  const isEmpty = !_editor
                    .getRootElement()
                    ?.textContent?.trim();

                  onChangeComment(
                    isEmpty
                      ? ''
                      : ((_editor._rootElement?.innerHTML ?? '') as string)
                  );
                }}
              />
            </S.EditorWrapper>

            <Stack vertical>
              {footer}
              <Stack spacing="normal">
                <Button
                  type="primary"
                  disabled={isDisabledAdd}
                  loading={isLoading}
                  onClick={onSave}
                >
                  {saveText}
                </Button>
                {!!onClose && <Button onClick={onClose}>Cancel</Button>}
              </Stack>
            </Stack>
          </Stack>
        </S.Wrapper>
      </Stack>
    );
  }
);
