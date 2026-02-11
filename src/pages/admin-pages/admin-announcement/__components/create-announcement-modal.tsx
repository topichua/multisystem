import { DatePicker, Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { Divider } from 'src/components/common/Divider/Divider';

import { Input } from 'src/components/common/Input/Input';
import { Modal } from 'src/components/common/Modal/Modal';
import { AddSegmentsModal } from 'src/pages/admin-pages/admin-communities-list/__components/add-segments-community-modal/add-segments-modal.tsx';
import { Announcement } from 'src/transport/announcement/announcement.dto';
import { URL_REGEX } from 'src/utils/text';

const { RangePicker } = DatePicker;

const getDateArrayFromAnnouncement = (startDate?: Date, endDate?: Date) => {
  if (!startDate && !endDate) return null;

  return [dayjs(startDate), dayjs(endDate)];
};

export type AnnouncementFormValues = {
  id?: string;
  isActive?: boolean;
  title: string;
  description: string;
  link: string;
  date: [Dayjs | null, Dayjs | null] | null;
  segmentIds: string[];
};

type CreateAnnouncementModalProps = {
  announcement: Partial<Announcement> | null;
  isLoading?: boolean;
  onConfirm: (values: AnnouncementFormValues) => void;
  onClose: () => void;
};

export const CreateAnnouncementModal = ({
  announcement,
  isLoading = false,
  onClose,
  onConfirm,
}: CreateAnnouncementModalProps) => {
  const [form] = Form.useForm<AnnouncementFormValues>();
  const segmentIds = useWatch('segmentIds', form);

  const isEditMode = !!announcement?.id;

  return (
    <Modal
      open={!!announcement}
      title={`${isEditMode ? 'Edit' : 'Create'} announcement`}
      style={{ top: 20 }}
      destroyOnClose
      okText={isEditMode ? 'Edit' : 'Create'}
      okButtonProps={{ loading: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
      onCancel={onClose}
      onOk={form.submit}
      centered
    >
      <Divider spacing="loose" />
      <Form
        form={form}
        initialValues={{
          id: announcement?.id,
          title: announcement?.title || '',
          description: announcement?.description || '',
          link: announcement?.link || '',
          date: getDateArrayFromAnnouncement(
            announcement?.startDate,
            announcement?.endDate
          ),
          segmentIds: announcement?.segmentIds || [],
        }}
        layout="vertical"
        clearOnDestroy
        onFinish={onConfirm}
      >
        <Form.Item name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: 'Please enter an announcement title' },
          ]}
        >
          <Input placeholder="Type announcement title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Please enter an announcement description',
            },
          ]}
        >
          <Input placeholder="Type announcement description" />
        </Form.Item>

        <Form.Item
          name="link"
          label="Link"
          rules={[
            {
              pattern: URL_REGEX,
              message: 'Please enter valid link',
            },
          ]}
        >
          <Input placeholder="Link" />
        </Form.Item>
        <Form.Item label="Segments" name="segmentIds">
          <AddSegmentsModal
            segmentIds={segmentIds || announcement?.segmentIds || []}
            onSetSegmentIds={(newSegmentIds) => {
              form.setFieldValue('segmentIds', newSegmentIds);
            }}
          />
        </Form.Item>
        <Form.Item
          name="date"
          label="Range"
          rules={[
            {
              required: true,
              message: 'Please set an announcement date range',
            },
          ]}
        >
          <RangePicker minDate={dayjs()} onChange={(res) => res} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
