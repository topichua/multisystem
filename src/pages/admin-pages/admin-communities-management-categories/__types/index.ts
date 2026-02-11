import { FormInstance } from 'antd';

import { CommunitiyCategoryDto } from 'src/transport/communities/communities.dto';

import { CategoryFormValues } from '../__components/create-category-modal/create-category-modal';

export type CategoryData = Partial<CommunitiyCategoryDto> | null;

export interface UseCategorizationModalProps {
  category?: CategoryData;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  form: FormInstance<CategoryFormValues>;
}

export const MODAL_STATES = {
  EDIT_SUBCATEGORY: 'EDIT_SUBCATEGORY',
  CREATE_SUBCATEGORY: 'CREATE_SUBCATEGORY',
  EDIT_CATEGORY: 'EDIT_CATEGORY',
  CREATE_CATEGORY: 'CREATE_CATEGORY',
} as const;

export type ModalState = (typeof MODAL_STATES)[keyof typeof MODAL_STATES];

export type ModalTitles = {
  [K in ModalState]: (category?: CategoryData) => string;
};

export type ModalActions = {
  [K in ModalState]: (category?: CategoryData) => string;
};
