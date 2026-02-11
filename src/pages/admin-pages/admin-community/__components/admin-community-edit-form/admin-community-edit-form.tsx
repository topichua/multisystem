import { useEffect, useMemo, useState } from 'react';
import { FormInstance, useWatch } from 'antd/es/form/Form';
import {
  Typography,
  Upload,
  UploadProps,
  Select,
  DatePicker,
  Switch,
  notification,
  Tooltip,
  Form,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import dayjs from 'dayjs';

import { Input } from 'src/components/common/Input/Input';
import { PostTags } from 'src/pages/community-pages/community-details/__components/post-tags/post-tags.tsx';
import {
  CommunitiyCategoryDto,
  CommunitiyDto,
} from 'src/transport/communities/communities.dto';
import { communityApi } from 'src/transport/communities/communities.api';

import * as S from './admin-community-edit-form.styled';
import { Stack } from 'src/components/common/Stack/Stack';
import { Modal } from 'src/components/common/Modal/Modal';
import { Editor, EditorOrderEnum } from 'src/components/common/Editor/Editor';
import { EditorState, LexicalEditor } from 'lexical';
import { HelpCircle } from '@untitled-ui/icons-react';
import { AddSegmentsModal } from 'src/pages/admin-pages/admin-communities-list/__components/add-segments-community-modal/add-segments-modal.tsx';
import { aliasValidation } from 'src/utils/aliasValidation';
import { TreeSelect } from 'src/components/common/TreeSelect/TreeSelect';

const { Paragraph } = Typography;

export type AdminCommunityEditFormProps = {
  form: FormInstance;
  community: CommunitiyDto | null;
  readonly?: boolean;
  onSubmit: (values: any) => void;
};

export const AdminCommunityEditForm = ({
  form,
  community,
  readonly = false,
  onSubmit,
}: AdminCommunityEditFormProps) => {
  const [categories, setCategories] = useState<CommunitiyCategoryDto[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>(community?.tagsId || []);

  const image = useWatch('imageFile', form);
  const isPublic = useWatch('isPublic', form);
  const isVisible = useWatch('isVisible', form);
  const startDate = useWatch('aliveStartDate', form);
  const endDate = useWatch('aliveEndDate', form);
  const segmentIds = useWatch('segmentIds', form);

  const isNotPublicOrVisible = useMemo(
    () => !isPublic || !isVisible,
    [isPublic, isVisible]
  );

  useEffect(() => {
    communityApi
      .getAllCategories(1, 100, true)
      .then((response) => {
        setCategories(response?.communityCategories ?? []);
      })
      .catch((error) => {
        console.error('Failed to fetch categories:', error);
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    if (isPublic === undefined) return;

    if (!isPublic) {
      form.setFieldValue('isAutoJoin', false);
    } else {
      form.setFieldValue('isVisible', true);
    }
  }, [isPublic]);

  const handleDeleteImage = () => {
    form.setFieldValue('imageFile', null);
  };

  const handleChangeImage: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    const [newFile] = newFileList;
    form.setFieldValue('imageFile', newFile);
  };

  const categoriesOptions = useMemo(() => {
    return categories.map((category) => ({
      title: category.name,
      value: category.id,
      key: category.id,
      checkable: category.subCategories.length === 0,
      children: category.subCategories.map((subCategory) => ({
        title: subCategory.name,
        value: subCategory.id,
        key: subCategory.id,
      })),
    }));
  }, [categories]);

  const disablePastDates = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  const handleOk = () => {
    setIsSaving(true);
    if (community?.id) {
      communityApi
        .saveCommunityAgreement(community.id, content)
        .then(() => {
          notification.success({
            message: 'Agreement saved successfully.',
          });
        })
        .catch((error) => {
          notification.error({
            message: 'Failed to save agreement.' + error,
          });
        })
        .finally(() => {
          setModalIsOpen(false);
          setIsSaving(false);
        });
    }
  };

  const handleCancel = () => setModalIsOpen(false);

  const onChangeContent = (
    _editorState: EditorState,
    _editor: LexicalEditor
  ) => {
    setContent(_editor._rootElement?.innerHTML ?? '');
  };

  useEffect(() => {
    if (!community?.id) return;
    communityApi
      .getCommunityAgreement(community.id)
      .then((res) => {
        setContent(res as any);
      })
      .catch()
      .finally();
  }, [community?.id]);

  return (
    <>
      <S.Form
        form={form}
        labelCol={{ xs: 24, md: 10, lg: 24, xl: 6 }}
        wrapperCol={{ xs: 24, md: 14, lg: 24, xl: 14 }}
        layout="horizontal"
        size="large"
        disabled={readonly}
        initialValues={{
          name: community?.name || '',
          shortDescription: community?.shortDescription,
          imageFile: community?.imageUrl ? { url: community.imageUrl } : null,
          alias: community?.alias || '',
          categoryIds: community?.categoryIds || null,
          isPublic: community?.isPublic ?? true,
          segmentIds: community?.segmentIds || [],
          isVisible: community?.isVisible ?? true,
          aliveStartDate: community?.aliveStartDate
            ? dayjs(community?.aliveStartDate)
            : null,
          aliveEndDate: community?.aliveEndDate
            ? dayjs(community?.aliveEndDate)
            : null,
          archivedDate: community?.archivedDate
            ? dayjs(community?.archivedDate)
            : null,
          isAutoJoin: community?.isAutoJoin ?? false,
          isRequirePostApproval: community?.isRequirePostApproval ?? false,
          isRequireAgreement: community?.isRequireAgreement ?? false,
          pushToWebSite: community?.pushToWebSite ?? false,
        }}
        onFinish={onSubmit}
      >
        <S.Form.Item
          name="name"
          label="Community Name"
          rules={[
            { required: true, message: 'Please enter a community name' },
            { max: 150, message: 'Max length is 150 symbols' },
          ]}
        >
          <Input placeholder="Type community title" />
        </S.Form.Item>
        <S.Form.Item
          name="shortDescription"
          label="Short description"
          rules={[
            { required: true, message: 'Please enter a short description' },
            { max: 50, message: 'Max length is 50 symbols' },
          ]}
        >
          <Input placeholder="Type community short description" />
        </S.Form.Item>

        <S.Form.Item
          label={
            <div>
              <Paragraph strong>Community photo</Paragraph>
              <Paragraph>This will be displayed on your profile.</Paragraph>
            </div>
          }
          name="imageFile"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
          rules={[{ required: true, message: 'Please upload an image' }]}
        >
          <ImgCrop>
            <Upload
              listType="picture-card"
              fileList={image ? [image] : []}
              beforeUpload={() => false}
              onRemove={handleDeleteImage}
              onChange={handleChangeImage}
              onPreview={() => {}}
            >
              {!image && 'Upload image'}
            </Upload>
          </ImgCrop>
        </S.Form.Item>

        <S.Form.Item
          label="Alias"
          name="alias"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: 'Please enter a community alias' },
            { max: 150, message: 'Max length is 150 symbols' },
            {
              validator: (_, value) =>
                aliasValidation(value, community?.alias || ''),
            },
            {
              pattern: /^\S*$/,
              message: 'Spaces are not allowed in alias',
            },
          ]}
        >
          <Input />
        </S.Form.Item>

        <S.Form.Item
          name="categoryIds"
          label="Category"
          required
          rules={[{ required: true, message: 'Please enter a category' }]}
        >
          <TreeSelect
            treeData={categoriesOptions}
            placeholder="Select categories"
            loading={loadingCategories}
            treeCheckable
          />
        </S.Form.Item>

        <S.Form.Item label="Segments" name="segmentIds">
          <AddSegmentsModal
            segmentIds={segmentIds || community?.segmentIds || []}
            onSetSegmentIds={(newSegmentIds) => {
              form.setFieldValue('segmentIds', newSegmentIds);
            }}
          />
        </S.Form.Item>

        <Form.Item name="tagsId">
          <PostTags
            reverseOrder
            selectedTags={tags}
            label="Community tags"
            note="Community tags (up to 10 allowed)"
            onTagSelect={(tags) => {
              setTags(tags);
              form.setFieldValue('tagsId', tags);
            }}
          />
        </Form.Item>

        <S.Form.Item
          label="Privacy"
          name="isPublic"
          rules={[
            { required: true, message: 'Please select a privacy option' },
          ]}
        >
          <Select
            options={[
              {
                value: true,
                label: 'Public',
              },
              {
                value: false,
                label: 'Private',
              },
            ]}
          />
        </S.Form.Item>

        <S.Form.Item
          label={
            <div>
              <Stack alignment="center" spacing="none">
                <Paragraph strong>Visibility</Paragraph>
                <Stack.Item>
                  {isPublic && (
                    <Tooltip title="The community is public and will always be visible.">
                      <HelpCircle style={{ maxHeight: '14px' }} />
                    </Tooltip>
                  )}
                </Stack.Item>
              </Stack>
              <Paragraph>
                Hiding the group will make it only visible to members.
              </Paragraph>
            </div>
          }
          name="isVisible"
        >
          <Select
            options={[
              { label: 'Visible', value: true },
              { label: 'Hidden', value: false },
            ]}
            disabled={isPublic}
          />
        </S.Form.Item>

        <S.Form.Item name="aliveStartDate" label="Start date">
          <DatePicker
            maxDate={endDate}
            allowClear={!community?.aliveStartDate}
            disabledDate={disablePastDates}
          />
        </S.Form.Item>

        <S.Form.Item name="aliveEndDate" label="End date">
          <DatePicker
            minDate={startDate}
            allowClear={!community?.aliveEndDate}
            disabledDate={disablePastDates}
          />
        </S.Form.Item>

        <S.Form.Item name="archivedDate" label="Archived date">
          <DatePicker minDate={dayjs().add(1, 'day')} allowClear />
        </S.Form.Item>

        <S.Form.Item
          name="isRequirePostApproval"
          label="Require post approval?"
          initialValue={false}
        >
          <Switch />
        </S.Form.Item>

        <S.Form.Item
          tooltip={
            isNotPublicOrVisible &&
            'This option is available only for public communities.'
          }
          name="isAutoJoin"
          label="Auto joined community"
        >
          <Switch disabled={isNotPublicOrVisible || readonly} />
        </S.Form.Item>
        <S.Form.Item name="pushToWebSite" label="Push to website?">
          <Switch />
        </S.Form.Item>
      </S.Form>
      <Modal
        title="Community agreement"
        open={modalIsOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        width={800}
        style={{ top: 20 }}
        destroyOnClose={true}
        okButtonProps={{
          loading: isSaving,
        }}
        cancelButtonProps={{
          disabled: isSaving,
        }}
      >
        <S.EditorWrapper>
          <Editor
            onChange={onChangeContent}
            order={EditorOrderEnum.Reverse}
            initialContent={content.trim() || ''}
          />
        </S.EditorWrapper>
      </Modal>
    </>
  );
};
