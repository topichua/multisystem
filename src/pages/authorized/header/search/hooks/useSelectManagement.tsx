import { ChangeEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import * as T from '../types';

export const TAGDIVIDER = '%TAGDIVIDER%';

export const useSelectManagement = (
  handleInputChange: (event: ChangeEvent<HTMLInputElement> | string) => void,
  show: () => void,
  hide: () => void
) => {
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (value: string, option: T.OptionsType) => {
      if (option.type !== 'tag') {
        hide();
        navigate(value);
      } else {
        show();
        handleInputChange(value.split(TAGDIVIDER)[1]);
      }
    },
    [handleInputChange, hide, navigate, show]
  );

  return { handleSelect };
};
