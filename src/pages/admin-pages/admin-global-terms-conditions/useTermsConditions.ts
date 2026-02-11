import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { serverValueApi } from 'src/transport/serverValues/serverValues.api.ts';
import { ServerValueDTO } from 'src/transport/serverValues/serverValues.dto.ts';

export const useTermsConditions = () => {
  const [serverValue, setServerValue] = useState<ServerValueDTO | null>(null);
  const [content, setContent] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');

  const [
    isSaveLoading,
    { setTrue: startSaveLoading, setFalse: finishSaveLoading },
  ] = useBoolean(false);
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);
  const [isCanceled, { setTrue: setCanceled, setFalse: setNotCanceled }] =
    useBoolean(false);

  useEffect(() => {
    setNotCanceled();
    setContent(serverValue?.value ?? '');
  }, [serverValue, isCanceled, setNotCanceled]);

  useEffect(() => {
    if (serverValue == null) {
      startLoading();
      serverValueApi
        .getGlobalAgreement()
        .then((res) => {
          setServerValue(res.terms);
          setContent(res.terms?.value || '');
          setEditorContent(res.terms?.value || '');
        })
        .catch(() => {
          notification.error({ message: 'Failed to load agreement' });
        })
        .finally(finishLoading);
    }
  }, [serverValue, startLoading, finishLoading]);

  const isNewContent = useMemo(
    () => content !== serverValue?.value,
    [content, serverValue]
  );

  const handleSave = () => {
    if (!editorContent.trim()) {
      notification.error({ message: 'Content cannot be empty.' });
      return;
    }

    debugger;

    if (serverValue?.id) {
      startSaveLoading();
      serverValueApi
        .updateServerValue(serverValue.id, editorContent)
        .then(() => {
          notification.success({ message: 'Agreement saved successfully.' });
          serverValue.value = editorContent;
          setContent(editorContent);
        })
        .catch((error) => {
          notification.error({ message: `Failed to save agreement. ${error}` });
        })
        .finally(finishSaveLoading);
    } else {
      startSaveLoading();
      serverValueApi
        .createServerValue('DefaultTerms', editorContent)
        .then(() => {
          notification.success({ message: "Agreement saved successfully." });
          //  serverValue.value = editorContent;
          setContent(editorContent);
        })
        .catch((error) => {
          notification.error({ message: `Failed to save agreement. ${error}` });
        })
        .finally(finishSaveLoading);
    }
  };

  return {
    content,
    editorContent,
    setEditorContent,
    initContent: serverValue?.value ?? '',
    isSaveLoading,
    isLoading,
    isCanceled,
    setCanceled,
    isNewContent,
    handleSave,
  };
};
