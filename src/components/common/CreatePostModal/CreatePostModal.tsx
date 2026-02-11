import { useEffect, useState } from 'react';
import { Form, Upload, UploadFile, UploadProps } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import ImgCrop from 'antd-img-crop';
import { EditorState, LexicalEditor } from 'lexical';

import { Attachment, Post } from 'src/transport/posts/posts.dto';
import { PostTags } from 'src/pages/community-pages/community-details/__components/post-tags/post-tags';

import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Divider } from '../Divider/Divider';
import { Input } from '../Input/Input';
import { Editor, EditorOrderEnum } from '../Editor/Editor';
import {
  UploadAttachment,
  UploadAttachments,
} from '../UploadAttachments/UploadAttachments';

import * as S from './CreatePostModal.styled';

export type AttachmentUploadFile = UploadFile | Attachment;

export type CreatePostValues = {
  id: string | null;
  title: string;
  body: string;
  files: any[];
  imageFile?: UploadAttachment;
};

type CreatePostModalProps = {
  isOpen: boolean;
  post?: Partial<Post>;
  isLoading?: boolean;
  onClose: () => void;
  onSave: (data: CreatePostValues, tags: string[]) => void;
};

export const CreatePostModal = ({
  isOpen,
  isLoading = false,
  post,
  onClose,
  onSave,
}: CreatePostModalProps) => {
  const [form] = useForm<CreatePostValues>();
  const image = useWatch('imageFile', form);
  const files = useWatch('files', form);
  const body = useWatch('body', form);
  const title = useWatch('title', form);

  const [tags, setTags] = useState<string[]>(() => {
    return !post?.tags ? [] : post?.tags.map((tag) => tag.id);
  });

  useEffect(() => {
    setTags(!post?.tags ? [] : post?.tags.map((tag) => tag.id));
  }, [isOpen]);

  const onChangeImage: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    const [newFile] = newFileList;
    form.setFieldValue('imageFile', newFile);
  };

  const onDeleteImage = () => {
    form.setFieldValue('imageFile', null);
  };

  const onChangeEditorContent = (
    _editorState: EditorState,
    _editor: LexicalEditor
  ) => {
    const isEmpty = !_editor.getRootElement()?.textContent?.trim();

    form.setFieldValue(
      'body',
      isEmpty ? '' : (_editor._rootElement?.innerHTML ?? '')
    );
    form.validateFields(['body']);
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    onSave(values, tags);
  };

  const isEditMode = !!post?.id;

  return (
    <S.Modal
      title={`${isEditMode ? 'Edit' : 'Create'} post`}
      style={{ top: 20 }}
      open={isOpen}
      width={700}
      footer={[
        <Stack key="publish" distribution="trailing">
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          ,
          <Button
            type="primary"
            disabled={!body || !title}
            loading={isLoading}
            onClick={form.submit}
          >
            {isEditMode ? 'Save' : 'Post'}
          </Button>
        </Stack>,
      ]}
      destroyOnClose
      onCancel={onClose}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          id: post?.id || null,
          title: post?.title || null,
          body: post?.body || null,
          files: post?.attachments?.length
            ? post?.attachments.map((a) => ({ ...a, uid: a.path, url: a.path }))
            : [],
          imageFile: post?.imageUrl ? { url: post.imageUrl } : null,
        }}
        clearOnDestroy
        onFinish={handleSubmit}
      >
        <Form.Item name="imageFile" label={<S.FormLabel>Image</S.FormLabel>}>
          <ImgCrop rotationSlider aspect={3}>
            <Upload
              listType="picture-card"
              fileList={image ? [image] : []}
              customRequest={(obj) => {
                if (obj.onSuccess) obj.onSuccess({});
              }}
              onChange={onChangeImage}
              onRemove={onDeleteImage}
              onPreview={() => {}}
            >
              {!image && 'Add cover image'}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Divider spacing="tight" />

        <Form.Item name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          name="title"
          label={<S.FormLabel>Post title</S.FormLabel>}
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please enter a post title',
            },
            { max: 150, message: 'Max length is 150 symbols' },
          ]}
        >
          <Input
            maxLength={150}
            placeholder="Title"
            variant="borderless"
            style={{ fontSize: 20, fontWeight: 600 }}
            required
          />
        </Form.Item>

        <Form.Item
          name="body"
          label={<S.FormLabel>Post content</S.FormLabel>}
          rules={[
            {
              required: true,
              whitespace: true,
              message: 'Please enter a post content',
            },
          ]}
        >
          <Editor
            order={EditorOrderEnum.Default}
            initialContent={post?.body || ''}
            onChange={onChangeEditorContent}
          />
        </Form.Item>

        <Divider spacing="tight" />
        <Form.Item name="files">
          <UploadAttachments
            files={files || []}
            note="max 10 files of any of the types: pdf, docx, xlsx, ppt, pptx, txt, png, jpeg, jpg. Max file size 5Mb."
            onChange={(newFiles) => form.setFieldValue('files', newFiles)}
          />
        </Form.Item>
      </Form>
      <Divider spacing="tight" />
      <PostTags
        reverseOrder
        selectedTags={tags}
        label="Post tags"
        note="Post tags (up to 10 allowed)"
        onTagSelect={setTags}
      />
    </S.Modal>
  );
};
