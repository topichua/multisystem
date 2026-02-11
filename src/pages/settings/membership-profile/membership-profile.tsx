import { Download03, Scale01, Settings01 } from '@untitled-ui/icons-react';
import { Form, notification, Spin, Typography } from 'antd';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'src/components/common/Button/Button';
import { Divider } from 'src/components/common/Divider/Divider.tsx';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import Images from 'src/pages/settings/membership-profile/logos_docs_images/images.tsx';
import PdfViewer from 'src/pages/settings/membership-profile/logos_docs_images/pdf-viewer.tsx';
import { components } from 'src/styled/definitions/colors';
import { membershipProfileApi } from 'src/transport/membership/membership-profile';
import { MembershipProfile } from 'src/transport/membership/membership-profile.dto';
import { formatDate } from 'src/utils/date-time';
import styled from 'styled-components';

const FormStyled = styled(Form)`
  .ant-form-item-row {
    display: flex;
    align-items: center;
    max-width: 932px;
  }
`;

type MembershipLink = {
  label: string;
  url: string;
};

const { Text } = Typography;

export const MembershipProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [membershipProfile, setMembershipProfile] =
    useState<MembershipProfile>();
  const [membershipLink, setMembershipLink] = useState<MembershipLink | null>(
    null
  );

  const [previewUrl, setPreviewUrl] = useState('');
  const [previewUrlLoading, setPreviewUrlLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      membershipProfileApi.getMembershipProfile(),
      membershipProfileApi.getMembershipManageLink(),
    ])
      .then(([res, manageLink]) => {
        setMembershipProfile(res.data);
        setMembershipLink(manageLink.data);
      })
      .catch((e) => {
        notification.error({
          message: 'Error getting membership details. Try again later.',
          description: (e as AxiosError)?.message,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (membershipProfile?.id) {
      setPreviewUrlLoading(true);
      membershipProfileApi
        .getPreviewMembershipLink(membershipProfile?.id)
        .then((res) => setPreviewUrl(res.data.previewUrl))
        .finally(() => setPreviewUrlLoading(false));
    }
  }, [membershipProfile?.id]);

  const downloadPdf = () => {
    if (!membershipProfile?.id) {
      return;
    }

    setIsPdfDownloading(true);

    membershipProfileApi
      .downloadPdf(membershipProfile.id)
      .then((response) => {
        const url = window.URL.createObjectURL(response as any);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Certificate.pdf');
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        notification.error({
          message: 'Error during loading PDF',
          description: error.message || 'Failed to download PDF',
        });
      })
      .finally(() => setIsPdfDownloading(false));
  };

  return (
    <>
      <FixedContentHeader>
        <InnerPageHeader
          icon={<Settings01 color={components.colors.brandColor} />}
          title="Membership profile"
        >
          <Stack distribution="trailing">
            {membershipLink && (
              <Button
                type="primary"
                onClick={() => window.open(membershipLink.url, '_blank')}
              >
                {membershipLink.label}
              </Button>
            )}
          </Stack>
        </InnerPageHeader>
      </FixedContentHeader>
      <Page.Content>
        <Page.Wrapper>
          <Spin spinning={isLoading}>
            <FormStyled
              labelAlign={'left'}
              labelWrap={false}
              initialValues={{}}
              onFinish={() => {}}
              onFinishFailed={() => {}}
              requiredMark={false}
              colon={false}
              validateTrigger={'onSubmit'}
              size={'middle'}
              labelCol={{ span: 6 }}
              layout={'horizontal'}
            >
              <Stack vertical spacing="extraLoose">
                <Title level={3}>My membership profile</Title>
                <Stack vertical spacing="none">
                  <Form.Item label="Membership Number" name="memberNum">
                    <Text strong>{membershipProfile?.memberNum || '-'}</Text>
                  </Form.Item>
                  <Form.Item label="Membership Name" name="membershipName">
                    <Text strong>
                      {membershipProfile?.membershipName || '-'}
                    </Text>
                  </Form.Item>
                  <Form.Item label="Membership status" name="memberStatus">
                    <Text strong>{membershipProfile?.memberStatus || '-'}</Text>
                  </Form.Item>
                  <Form.Item label="Join date" name="joinDate">
                    <Text strong>{membershipProfile?.joinDate || '-'}</Text>
                  </Form.Item>
                  <Form.Item label="Renewed to date" name="renewedToDate">
                    <Text strong>
                      {membershipProfile?.renewedToDate
                        ? formatDate(membershipProfile?.renewedToDate)
                        : '-'}
                    </Text>
                  </Form.Item>
                  <Form.Item label="Termination date" name="terminationDate">
                    <Text strong>
                      {membershipProfile?.terminationDate
                        ? formatDate(membershipProfile.terminationDate)
                        : '-'}
                    </Text>
                  </Form.Item>
                  <Form.Item label="Certificate:" name="certificateUrl">
                    <Stack>
                      <Button
                        size="small"
                        type="primary"
                        loading={previewUrlLoading}
                        disabled={!previewUrl}
                        onClick={() => window.open(previewUrl, '_blank')}
                        icon={<Scale01 width={14} />}
                      >
                        Preview
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        disabled={!membershipProfile?.id}
                        loading={isPdfDownloading}
                        onClick={downloadPdf}
                        icon={<Download03 width={14} />}
                      >
                        Download
                      </Button>
                    </Stack>
                  </Form.Item>
                </Stack>
              </Stack>
            </FormStyled>
          </Spin>
          <PdfViewer />
          <Divider />
          <Images />
        </Page.Wrapper>
      </Page.Content>
    </>
  );
};
