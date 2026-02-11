import { useEffect, useState } from 'react';
import { Form, Input, ModalProps, Select, notification } from 'antd';
import { useBoolean } from 'ahooks';

import { settingsAPI } from 'src/transport/settings/setting.api';
import { Modal } from 'src/components/common/Modal/Modal';
import { Ticket } from 'src/transport/events/events.dto';

export type EventDietaryValue = {
  dietaryRequirements: string[] | null;
  otherDietaryRequirement: string | null;
  accessibilityRequirement: string | '';
};

type EventDietaryModalProps = ModalProps & {
  ticket: Ticket | null;
  isLoading?: boolean;
  onChange: (data: EventDietaryValue) => void;
};

export const EventDietaryModal = ({
  isLoading = false,
  ticket,
  onChange,
  ...rest
}: EventDietaryModalProps) => {
  const [form] = Form.useForm();

  const [dietaryOptions, setDietaryOptions] = useState<
    { label: string; value: string }[] | undefined
  >(undefined);
  const [loading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const loadData = () => {
    startLoading();
    settingsAPI
      .getDietaryRequirementOptions()
      .then((optionsRes) => {
        const options = Object.entries(optionsRes.data).map(
          ([value, label]) => ({
            value: value.toLowerCase(),
            label,
          })
        );

        setDietaryOptions(options as any);
      })
      .catch((error) =>
        notification.error({
          message: `Something went wrong. ${error.message}`,
        })
      )
      .finally(finishLoading);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async (values: EventDietaryValue) => {
    onChange({
      ...values,
      dietaryRequirements:
        values.dietaryRequirements?.length === 0
          ? null
          : values.dietaryRequirements,
    });
  };

  return (
    <Modal
      {...rest}
      style={{ top: 20 }}
      title="Dietary & special requirements"
      okText="Save"
      okButtonProps={{ loading: isLoading, disabled: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
      destroyOnClose
      onOk={form.submit}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          dietaryRequirements: ticket?.dietaryRequirements ?? [],
          otherDietaryRequirement: ticket?.otherDietaryRequirement ?? '',
          accessibilityRequirement: ticket?.accessibilityRequirement ?? '',
        }}
        clearOnDestroy
      >
        <Form.Item label="Dietary Requirements" name="dietaryRequirements">
          <Select
            mode="multiple"
            placeholder="Please select"
            loading={loading}
            options={dietaryOptions}
          />
        </Form.Item>

        <Form.Item
          label="Other Dietary Requirements"
          name="otherDietaryRequirement"
        >
          <Input placeholder="Type other dietary requirements" />
        </Form.Item>

        <Form.Item
          label="Accessibility Requirement"
          name="accessibilityRequirement"
        >
          <Input placeholder="Type accessibility requirement" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
