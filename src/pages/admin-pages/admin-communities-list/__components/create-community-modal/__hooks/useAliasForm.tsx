import { FormInstance, useWatch } from 'antd/es/form/Form';
import { useCallback, useEffect } from 'react';

import { useBoolean, useThrottleEffect } from 'ahooks';
import { convertToUrlFriendlySlug } from 'src/utils/text';

export const ALIAS_FORM_ITEM_NAME = 'alias';

interface UseAliasFormProps {
  form: FormInstance<Record<string, string>>;
  isOpen: boolean;
}

/**
 * A hook that handles the behavior of the "alias" field in the "Create community" modal.
 * It makes sure that the "alias" field is updated with a URL-friendly slug when the user
 * types in the "name" field, unless the user manually edits the "alias" field.
 *
 * @param {{ form: FormInstance<Record<string, string>>, isOpen: boolean }} props
 * @returns {{ handleFormChange: (newValue: Record<string, string>) => void }}
 */
export const useAliasForm = ({ form, isOpen }: UseAliasFormProps) => {
  const name = useWatch('name', form);

  const [
    isAliasManuallyEdited,
    { setTrue: setAliasManuallyEdited, setFalse: resetAliasManuallyEdited },
  ] = useBoolean(false);

  useEffect(() => {
    if (!isOpen) resetAliasManuallyEdited();
  }, [isOpen, resetAliasManuallyEdited]);

  const handleFormChange = useCallback(
    (newValue: Record<string, string>) => {
      if (newValue?.[ALIAS_FORM_ITEM_NAME]) {
        setAliasManuallyEdited();
      }
    },
    [setAliasManuallyEdited]
  );

  useThrottleEffect(
    () => {
      const urlFriendlySlug = convertToUrlFriendlySlug(name);
      if (!isAliasManuallyEdited) {
        form.setFieldValue('alias', urlFriendlySlug);
      }
    },
    [name],
    {
      wait: 30,
    }
  );

  return {
    handleFormChange,
  };
};
