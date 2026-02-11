import { ClockCheck } from '@untitled-ui/icons-react';
import {
  DatePicker,
  Form,
  Input as AntdInput,
  Spin,
  TimePicker,
  Tooltip,
  Upload,
  UploadProps,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { useWatch } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Divider } from 'src/components/common/Divider/Divider';
import { Input } from 'src/components/common/Input/Input';
import { useAssets } from 'src/components/common/MeetingCard/useAssets.ts';
import { Modal } from 'src/components/common/Modal/Modal';
import { UploadAttachment } from 'src/components/common/UploadAttachments/upload-attachments-type.ts';
import { UploadMeetingAttachments } from 'src/components/common/UploadAttachments/UploadMeetingAttachments.tsx';
import { MeetingPrivacyOptions } from 'src/pages/admin-pages/admin-community/__components/manage_meeting_modal/MeetingPrivacyOptions.tsx';
import { CreateMeetingForm } from 'src/pages/admin-pages/admin-community/admin-community-meetings/types';
import { CommunityMeeting } from 'src/transport/communities/communities.dto';
import { combineDateAndTime, convertDurationToDate } from 'src/utils/time';
import * as S from './ManageMeetingModal.styled';
import {
  disablePastDates,
  TIME_FORMAT,
  validateEndTimes,
  validateMeetingLink,
  validatePastTimes,
  validateRsvpDateTime,
} from './validation.ts';

const { TextArea } = AntdInput;

type ManageMeetingModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  meeting: CommunityMeeting | null;
  onClose: () => void;
  onCreate: (values: CreateMeetingForm) => void;
  communityId?: string;
};

export const ManageMeetingModal = ({
  isOpen,
  isLoading = false,
  onClose,
  onCreate,
  meeting,
  communityId,
}: ManageMeetingModalProps) => {
  const [form] = Form.useForm();

  const startDate = useWatch('startDate', form);
  const rsvpDate = useWatch('rsvpDate', form);
  const startTime = useWatch('startDateFrom', form);
  const image = useWatch('imageFile', form);

  const [assets, setAssets] = useState<UploadAttachment[]>([]);

  const handleSubmit = async () => {
    form.setFieldValue('assets', assets);
    const values = form.getFieldsValue();
    onCreate(values);
  };

  const {
    meetingAssets,
    isLoading: isAttachmentsLoading,
    setMeetingAssets,
  } = useAssets(meeting || null, communityId || '', isOpen);

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setMeetingAssets([]);
    }
  }, [isOpen, form, setMeetingAssets]);

  useEffect(() => {
    if (meeting) {
      const {
        name,
        description,
        meetingLink,
        meetingId,
        meetingPassword,
        startDate,
        rsvpDate,
        duration,
        visible,
        imageUrl,
      } = meeting;

      const endDate = convertDurationToDate(duration, startDate);

      form.setFieldsValue({
        name,
        description,
        meetingLink,
        meetingId,
        meetingPassword,
        startDate: dayjs(startDate).startOf('day'),
        startDateFrom: dayjs(startDate),
        startDateTo: dayjs(endDate),
        rsvpDate: rsvpDate ? dayjs(rsvpDate) : null,
        visible: visible.toString(),
        imageFile: imageUrl ? { url: imageUrl } : null,
      });
    }
  }, [meeting, form]);

  useEffect(() => {
    if (meetingAssets.length) {
      setAssets(meetingAssets.map((a) => ({ ...a, url: a.path })));
    } else {
      setAssets([]);
    }
  }, [meetingAssets]);

  useEffect(() => {
    if (startDate && form.isFieldTouched('startDateFrom')) {
      form.validateFields(['startDateFrom', 'startDateTo']);
    }
  }, [form, startDate]);

  useEffect(() => {
    if (startDate && form.isFieldTouched('startDateTo')) {
      form.validateFields(['startDateTo']);
    }
  }, [form, startTime]);

  const onChangeImage: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    const [newFile] = newFileList;
    form.setFieldValue('imageFile', newFile);
  };

  useEffect(() => {
    if (rsvpDate && form.isFieldTouched('rsvpDate')) {
      form.validateFields(['rsvpDate']);
    }
  }, [form, rsvpDate, startTime, startDate]);

  const setStartDateAsRSVP = useCallback(() => {
    form.setFieldValue(
      'rsvpDate',
      dayjs(combineDateAndTime(startDate, startTime))
    );
  }, [form, startDate, startTime]);

  return (
    <>
      <Modal
        title={`${meeting ? 'Edit' : 'Create'} meeting`}
        open={isOpen}
        style={{ top: 20 }}
        okText={`${meeting ? 'Save' : 'Create'}`}
        onOk={form.submit}
        onCancel={onClose}
        width={600}
        okButtonProps={{ loading: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
      >
        <Form
          form={form}
          // requiredMark={false}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Divider />
          <Form.Item name="imageFile" label="Image">
            <ImgCrop rotationSlider aspect={3}>
              <Upload
                listType="picture-card"
                fileList={image ? [image] : []}
                customRequest={(obj) => {
                  if (obj.onSuccess) obj.onSuccess({});
                }}
                onChange={onChangeImage}
              >
                {(!image || image.length === 0) && 'Add cover image'}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            name="name"
            label="Meeting title"
            rules={[
              {
                max: 300,
                message: 'Meeting title must be at most 300 characters',
              },
              {
                required: true,
                whitespace: true,
                message: 'Please enter a Meeting title',
              },
              // { validator: validateEmpty('Please enter a Meeting title') },
            ]}
          >
            <Input maxLength={301} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Meeting description"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please enter a meeting description',
              },
              {
                max: 2000,
                message: 'Meeting description must be at most 2000 characters',
              },
            ]}
          >
            <TextArea
              placeholder="Enter a description..."
              autoSize={{ minRows: 5, maxRows: 5 }}
              maxLength={2001}
            />
          </Form.Item>
          <S.StyledTime
            distribution="equalSpacing"
            spacing="tight"
            wrap={false}
          >
            <Form.Item
              name="startDate"
              label="Date"
              rules={[{ required: true }]}
            >
              <DatePicker disabledDate={disablePastDates} />
            </Form.Item>
            <Form.Item
              name="startDateFrom"
              label="From"
              rules={[
                { required: true },
                { validator: validatePastTimes(startDate) },
              ]}
            >
              <TimePicker format={TIME_FORMAT} />
            </Form.Item>
            <Form.Item
              name="startDateTo"
              label="To"
              rules={[
                { required: true },
                { validator: validateEndTimes(startTime) },
              ]}
            >
              <TimePicker format={TIME_FORMAT} />
            </Form.Item>
          </S.StyledTime>
          <S.RSVPContainer
            distribution="equalSpacing"
            alignment="center"
            spacing="tight"
            wrap={false}
          >
            <Form.Item
              name="rsvpDate"
              label="RSVP Date"
              rules={[
                {
                  validator: validateRsvpDateTime(
                    startDate,
                    startTime,
                    rsvpDate
                  ),
                },
              ]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>
            <Tooltip title="Set start date as RSVP">
              <Button
                onClick={setStartDateAsRSVP}
                disabled={!startTime || !startDate}
              >
                <ClockCheck height={18} width={18} />
              </Button>
            </Tooltip>
          </S.RSVPContainer>
          <Form.Item
            name="meetingLink"
            label="Meeting link"
            rules={[
              { required: true, message: 'Please enter a meeting link' },
              { validator: validateMeetingLink },
            ]}
          >
            <Input />
          </Form.Item>
          <MeetingPrivacyOptions meeting={meeting} />
          <Form.Item name="meetingId" label="Meeting ID (optional)">
            <Input />
          </Form.Item>
          <Form.Item name="assets">
            <Spin spinning={isAttachmentsLoading}>
              <UploadMeetingAttachments
                label="Assets (optional)"
                files={assets}
                maxFileLength={5}
                onChange={(newAssets) => {
                  if (!Array.isArray(newAssets)) {
                    return;
                  }
                  setAssets(newAssets);
                }}
              />
            </Spin>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
