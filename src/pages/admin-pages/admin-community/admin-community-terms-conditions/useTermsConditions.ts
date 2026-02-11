import { useBoolean } from 'ahooks';
import { Form, notification } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useCommunityManagementStore } from 'src/pages/admin-pages/admin-community/admin-community.provider.tsx';
import { communityApi } from 'src/transport/communities/communities.api.ts';
import { EditCommunityDto } from 'src/transport/communities/communities.dto.ts';

export const useTermsConditions = () => {
  const { community, loadCommunity } = useCommunityManagementStore();
  const [content, setContent] = useState<string>('');
  const [initContent, setInitContent] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');
  const [form] = Form.useForm();

  const isRequireAgreement = useWatch('isRequireAgreement', form);
  const [
    isSaveLoading,
    { setTrue: startSaveLoading, setFalse: finishSaveLoading },
  ] = useBoolean(false);
  const [isCanceled, { setTrue: setCanceled, setFalse: setNotCanceled }] =
    useBoolean(false);

  useEffect(() => {
    setNotCanceled();
    setContent(initContent);
  }, [isCanceled]);

  useEffect(() => {
    if (!community?.id) return;
    communityApi
      .getCommunityAgreement(community.id)
      .then((res) => {
        setInitContent(res as any);
        setContent(res as any);
        setEditorContent(res as any);
      })
      .catch(() => notification.error({ message: 'Failed to load agreement' }));
  }, [community]);

  useEffect(() => {
    if (
      community &&
      isRequireAgreement != null &&
      community?.isRequireAgreement !== isRequireAgreement
    ) {
      startSaveLoading();
      const communityId = community?.id as string;

      communityApi
        .editCommunity({
          isRequireAgreement,
          id: communityId,
        } as EditCommunityDto)
        .then(() => {
          loadCommunity();
          notification.success({ message: 'Successfully saved!' });
        })
        .catch((e) => {
          notification.error({ message: (e as AxiosError).message });
        })
        .finally(finishSaveLoading);
    }
  }, [community?.isRequireAgreement, isRequireAgreement]);

  const isNewContent = useMemo(
    () => content !== initContent,
    [content, initContent]
  );

  const handleSave = () => {
    if (!editorContent.trim()) {
      notification.error({ message: 'Content cannot be empty.' });
      return;
    }

    if (community?.id) {
      startSaveLoading();
      communityApi
        .saveCommunityAgreement(community.id, editorContent)
        .then(() => {
          notification.success({ message: 'Agreement saved successfully.' });
          setInitContent(editorContent);
          setContent(editorContent);
        })
        .catch((error) => {
          notification.error({ message: `Failed to save agreement. ${error}` });
        })
        .finally(finishSaveLoading);
    }
  };

  return {
    form,
    content,
    editorContent,
    setEditorContent,
    initContent,
    isSaveLoading,
    isCanceled,
    setCanceled,
    isNewContent,
    handleSave,
    isRequireAgreement,
  };
};
