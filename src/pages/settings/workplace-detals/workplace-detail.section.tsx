import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {
  Form,
  notification,
  Spin,
  Input,
  Select,
  DatePicker,
  Button,
} from 'antd';
import { useBoolean } from 'ahooks';

import { LayersThree02 } from '@untitled-ui/icons-react';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { components } from 'src/styled/definitions/colors';
import { Page } from 'src/components/common/page/page';
import { settingsAPI } from 'src/transport/settings/setting.api';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { Divider } from 'src/components/common/Divider/Divider';

interface OrganisationOption {
  value: string;
  label: string;
}

interface WorkplaceDetails {
  organisation: {
    name: string;
    id: string;
  };
  role: string;
  startDate: string | null;
}

const FormStyled = styled(Form)`
  .ant-form-item-row {
    display: flex;
    align-items: center;
    max-width: 932px;
  }
`;

export const SettingsWorkplaceDetailsPage: React.FC = () => {
  const [form] = Form.useForm<any>();

  const [organisationOptions, setOrganisationOptions] = useState<
    OrganisationOption[]
  >([]);
  const [filteredOptions, setFilteredOptions] = useState<OrganisationOption[]>(
    []
  );

  const [loading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(true);

  const [isEditable, setIsEditable] = useState<boolean>(false);

  const fetchInitialData = async () => {
    startLoading();
    try {
      const [workplaceDetailsRes, organisationsRes] = await Promise.all([
        settingsAPI.getWorkplaceDetails(),
        settingsAPI.searchOrganisations(''),
      ]);

      const organisations: OrganisationOption[] = Object.entries<string>(
        organisationsRes.data
      ).map(([id, name]) => ({
        value: id,
        label: name,
      }));

      setOrganisationOptions(organisations);
      setFilteredOptions(organisations);

      const organisationData: WorkplaceDetails | undefined =
        workplaceDetailsRes?.data;

      console.log(organisationData);
      if (organisationData) {
        form.setFieldsValue({
          organisationName: organisationData.organisation.id,
          role: organisationData.role || '',
          dateStarted: organisationData.startDate
            ? dayjs(organisationData.startDate)
            : null,
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error fetching data',
        description: error?.response?.data?.message || 'Unknown error',
      });
    } finally {
      finishLoading();
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSaveChanges = async (values: any) => {
    try {
      const dateStartedStr = values.dateStarted
        ? dayjs(values.dateStarted).format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ')
        : null;

      const selectedOrg = organisationOptions.find(
        (o) => o.value === values.organisationName
      );

      const updatedDetails = {
        organisation: {
          id: values.organisationName,
          name: selectedOrg?.label || '',
        },
        role: values.role,
        startDate: dateStartedStr,
      };

      const response = await settingsAPI.updateWorkplaceDetails(updatedDetails);

      const updatedData = response;

      form.setFieldsValue({
        organisationName: updatedData.organisation.id,
        role: updatedData.role,
        dateStarted: updatedData.startDate
          ? dayjs(updatedData.startDate)
          : null,
      });

      notification.success({
        message: 'Workplace details updated successfully',
      });

      setIsEditable(false);
    } catch (error: any) {
      notification.error({
        message: 'Failed to update workplace details',
        description: error?.response?.data?.message || 'Unknown error occurred',
      });
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<LayersThree02 color={components.colors.brandColor} />}
          title="Organisation details"
        >
          <Stack distribution="trailing">
            <Stack spacing="tight">
              {isEditable ? (
                <Stack>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={form.submit}
                    disabled={!isEditable}
                  >
                    Save changes
                  </Button>
                  <Button onClick={() => setIsEditable(false)}>Cancel</Button>
                </Stack>
              ) : (
                <Button type="primary" onClick={handleEditClick}>
                  Edit
                </Button>
              )}
            </Stack>
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
          {!loading && (
            <FormStyled
              form={form}
              labelAlign="left"
              size="middle"
              labelCol={{ span: 6 }}
              layout="horizontal"
              onFinish={handleSaveChanges}
            >
              <Stack vertical spacing="extraLoose">
                <Title level={3}>My Organisation details</Title>
                <Stack vertical spacing="none">
                  <Form.Item
                    label="Organisation name"
                    name="organisationName"
                    rules={[
                      {
                        required: true,
                        message: 'Please select your organisation',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Search organisation"
                      filterOption={(input, option) =>
                        (option?.label ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={filteredOptions}
                      disabled={!isEditable}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Contact's role"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your role',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your role"
                      disabled={!isEditable}
                    />
                  </Form.Item>

                  <Form.Item label="Date started" name="dateStarted">
                    <DatePicker
                      placeholder="Select start date"
                      disabled={!isEditable}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Stack>
              </Stack>
              <Divider />
            </FormStyled>
          )}
        </Spin>
      </Page.Content>
    </>
  );
};
