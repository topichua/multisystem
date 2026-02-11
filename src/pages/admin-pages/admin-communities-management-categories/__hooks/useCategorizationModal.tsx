import { isEmpty } from 'lodash';
import { useCallback, useMemo } from 'react';

import * as T from '../__types';

const modalTitles: T.ModalTitles = {
  [T.MODAL_STATES.EDIT_SUBCATEGORY]: (category) =>
    `Edit Subcategory: ${category?.name}`,
  [T.MODAL_STATES.CREATE_SUBCATEGORY]: () => `New Subcategory`,
  [T.MODAL_STATES.EDIT_CATEGORY]: (category) =>
    `Edit Category: ${category?.name}`,
  [T.MODAL_STATES.CREATE_CATEGORY]: () => 'New Category',
};

const modalActions: T.ModalActions = {
  [T.MODAL_STATES.EDIT_SUBCATEGORY]: () => 'Save Changes',
  [T.MODAL_STATES.CREATE_SUBCATEGORY]: () => `Create`,
  [T.MODAL_STATES.EDIT_CATEGORY]: () => 'Save Changes',
  [T.MODAL_STATES.CREATE_CATEGORY]: () => 'Create',
};

export const useCategorizationModal = ({
  category,
  isLoading,
  isOpen,
  onClose,
  form,
}: T.UseCategorizationModalProps) => {
  const modalState = useMemo((): T.ModalState => {
    switch (true) {
      case !!category?.parentCategoryId && !!category?.id:
        return T.MODAL_STATES.EDIT_SUBCATEGORY;
      case !!category?.parentCategoryId && !category?.id:
        return T.MODAL_STATES.CREATE_SUBCATEGORY;
      case !isEmpty(category):
        return T.MODAL_STATES.EDIT_CATEGORY;
      default:
        return T.MODAL_STATES.CREATE_CATEGORY;
    }
  }, [category]);

  const getModalTitle = useCallback((): string => {
    return modalTitles[modalState](category);
  }, [modalState, category]);

  const getActionButtonText = useCallback((): string => {
    return modalActions[modalState](category);
  }, [modalState, category]);

  const modalProps = useMemo(
    () => ({
      title: getModalTitle(),
      open: isOpen,
      okButtonProps: { loading: isLoading },
      cancelButtonProps: { disabled: isLoading },
      okText: getActionButtonText(),
      onOk: form.submit,
      onCancel: onClose,
    }),
    [
      getModalTitle,
      getActionButtonText,
      isOpen,
      isLoading,
      form.submit,
      onClose,
    ]
  );

  return {
    modalProps,
    modalState,
  };
};
