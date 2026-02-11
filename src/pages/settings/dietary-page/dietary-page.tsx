import { PieChart01 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Form, Select, Spin, Input, notification } from 'antd';
import { useEffect, useState } from 'react';
import { Button } from 'src/components/common/Button/Button';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { components } from 'src/styled/definitions/colors';
import { settingsAPI } from 'src/transport/settings/setting.api';

export const SettingsDietaryPage = () => {
  const [form] = Form.useForm();
  const [dietaryOptions, setDietaryOptions] = useState<
    { label: string; value: string }[] | undefined
  >(undefined);
  const [loading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const [isEditMode, { setTrue: enableEditMode, setFalse: disableEditMode }] =
    useBoolean(false);

  const loadData = () => {
    startLoading();
    Promise.all([
      settingsAPI.getDietaryRequirements(),
      settingsAPI.getDietaryRequirementOptions(),
    ])
      .then(([requirementsRes, optionsRes]) => {
        const selectedRequirements = (
          requirementsRes.data.dietaryRequirements || []
        ).map((item: any) => item.toLowerCase());

        const options = Object.entries(optionsRes.data).map(
          ([value, label]) => ({
            value: value.toLowerCase(),
            label,
          })
        );
        setDietaryOptions(options as any);

        if (requirementsRes.data) {
          form.setFieldsValue({
            dietaryRequirements: selectedRequirements,
            otherDietaryRequirement:
              requirementsRes.data.otherDietaryRequirement,
            accessibilityRequirement:
              requirementsRes.data.accessibilityRequirement,
          });
        }
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

  const onFinish = async (values: any) => {
    startLoading();
    disableEditMode();

    await settingsAPI
      .saveDietaryRequirements(values)
      .then(() => {
        notification.success({
          message: 'Dietary requirements saved successfully',
        });
        loadData();
      })
      .catch(() =>
        notification.error({
          message: `Failed to save dietary requirements.`,
        })
      )
      .finally(finishLoading);
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<PieChart01 color={components.colors.brandColor} />}
          title="Dietary & special requirements"
        >
          <Stack distribution="trailing">
            {isEditMode ? (
              <Stack>
                <Button onClick={disableEditMode} block type="text">
                  Cancel
                </Button>
                <Button block type="primary" onClick={form.submit}>
                  Save
                </Button>
              </Stack>
            ) : (
              <Button disabled={false} onClick={enableEditMode}>
                Edit
              </Button>
            )}
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>
      <Page.Content
        style={{
          maxWidth: 1064,
          width: '100%',
          minHeight: 500,
          margin: '0 auto',
        }}
      >
        <Spin spinning={loading}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item label="Dietary Requirements" name="dietaryRequirements">
              <Select
                mode="multiple"
                placeholder="Please select"
                disabled={!isEditMode}
                options={dietaryOptions}
              />
            </Form.Item>
            <Form.Item
              label="Accessibility Requirements"
              name="accessibilityRequirement"
            >
              <Input
                disabled={!isEditMode}
                placeholder="Type accessibility requirement"
              />
            </Form.Item>
          </Form>
        </Spin>
      </Page.Content>
    </>
  );
};
