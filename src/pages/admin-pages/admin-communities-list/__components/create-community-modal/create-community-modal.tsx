import { DatePicker, Form, Select, Switch, Upload, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { Divider } from 'src/components/common/Divider/Divider';
import { Input } from 'src/components/common/Input/Input';
import { Modal } from 'src/components/common/Modal/Modal';
import { PostTags } from 'src/pages/community-pages/community-details/__components/post-tags/post-tags.tsx';
import { communityApi } from 'src/transport/communities/communities.api';
import {
  CommunitiyCategoryDto,
  CreateCommunityDto,
} from 'src/transport/communities/communities.dto';
import { aliasValidation } from 'src/utils/aliasValidation.ts';
import { TreeSelect } from 'src/components/common/TreeSelect/TreeSelect';

import { AddSegmentsModal } from '../add-segments-community-modal/add-segments-modal';
import { ALIAS_FORM_ITEM_NAME, useAliasForm } from './__hooks/useAliasForm';

type CreateCommunityModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onCreate: (values: CreateCommunityDto) => void;
};

export const CreateCommunityModal = ({
  isOpen,
  isLoading = false,
  onClose,
  onCreate,
}: CreateCommunityModalProps) => {
  const [categories, setCategories] = useState<CommunitiyCategoryDto[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [tags, setTags] = useState<string[]>([]);

  const [form] = Form.useForm();
  const image = useWatch('imageFile', form);
  const isPublic = useWatch('isPublic', form);
  const isVisible = useWatch('isVisible', form);
  const startDate = useWatch('aliveStartDate', form);
  const endDate = useWatch('aliveEndDate', form);
  const segmentIds = useWatch('segmentIds', form);

  const { handleFormChange } = useAliasForm({
    form,
    isOpen,
  });

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

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    onCreate(values);
  };

  const onChangeImage: UploadProps['onChange'] = ({
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

  useEffect(() => {
    if (!isOpen) form.resetFields();
  }, [isOpen]);

  useEffect(() => {
    if (!isPublic) {
      form.setFieldValue('isAutoJoin', false);
    } else {
      form.setFieldValue('isVisible', true);
    }
  }, [isPublic]);

  const disablePastDates = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <Modal
      title="Create community"
      open={isOpen}
      style={{ top: 20 }}
      okText="Create"
      onOk={form.submit}
      onCancel={onClose}
      okButtonProps={{ loading: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
      transitionName="ant-fade"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
        scrollToFirstError
      >
        <Divider />

        <Form.Item
          name="name"
          label="Community Name"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: 'Please enter a community name' },
            { max: 150, message: 'Max length is 150 symbols' },
          ]}
        >
          <Input
            placeholder="Type community title"
            onBlur={() => form.validateFields([ALIAS_FORM_ITEM_NAME])}
          />
        </Form.Item>

        <Form.Item
          name="shortDescription"
          label="Short description"
          rules={[
            { required: true, message: 'Please enter a short description' },
            { max: 50, message: 'Max length is 50 symbols' },
          ]}
        >
          <Input placeholder="Type community title" />
        </Form.Item>

        <Form.Item
          name="imageFile"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
          rules={[{ required: true, message: 'Please upload an image' }]}
        >
          <ImgCrop>
            <Upload
              listType="picture-card"
              fileList={image ? [image] : []}
              beforeUpload={() => false}
              onChange={onChangeImage}
              onPreview={() => {}}
            >
              {(!image || image.length === 0) && 'Upload image'}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item
          name={ALIAS_FORM_ITEM_NAME}
          label="Alias"
          validateTrigger="onBlur"
          hasFeedback
          rules={[
            { required: true, message: 'Please enter a community alias' },
            { max: 150, message: 'Max length is 150 symbols' },
            { validator: (_, value) => aliasValidation(value) },
          ]}
        >
          <Input placeholder="Type alias" />
        </Form.Item>

        <Form.Item
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
        </Form.Item>

        <Form.Item label="Segments" name="segmentIds">
          <AddSegmentsModal
            segmentIds={segmentIds ?? []}
            onSetSegmentIds={(newSegmentIds) => {
              form.setFieldValue('segmentIds', newSegmentIds);
            }}
          />
        </Form.Item>
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
        <Form.Item
          label="Privacy"
          name="isPublic"
          rules={[
            { required: true, message: 'Please select a privacy option' },
          ]}
        >
          <Select
            placeholder="Define community privacy"
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
        </Form.Item>

        <Form.Item
          label="Visibility"
          name="isVisible"
          tooltip={
            isPublic
              ? 'The community is public and will always be visible.'
              : undefined
          }
          initialValue={true}
        >
          <Select
            options={[
              {
                value: true,
                label: 'Visible',
              },
              {
                value: false,
                label: 'Hidden',
              },
            ]}
            disabled={isPublic}
          />
        </Form.Item>

        <Form.Item name="aliveStartDate" label="Start date">
          <DatePicker maxDate={endDate} disabledDate={disablePastDates} />
        </Form.Item>

        <Form.Item name="aliveEndDate" label="End date">
          <DatePicker minDate={startDate} disabledDate={disablePastDates} />
        </Form.Item>

        <Form.Item name="archivedDate" label="Archived date">
          <DatePicker minDate={dayjs().add(1, 'day')} />
        </Form.Item>

        <Form.Item
          name="isRequirePostApproval"
          label="Require post approval?"
          initialValue={false}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          tooltip={
            isNotPublicOrVisible &&
            'This option is available only for public communities.'
          }
          name="isAutoJoin"
          label="Auto joined community"
          initialValue={false}
        >
          <Switch disabled={isNotPublicOrVisible} />
        </Form.Item>
        <Form.Item
          name="pushToWebsite"
          label="Push to website?"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
