import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  notificationsSearchParam,
  NotificationsTabsEnum,
} from '../utils/notifications.types';

export const useDefaultActiveKey = (
  setActiveTabKey: Dispatch<SetStateAction<NotificationsTabsEnum>>,
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>,
  handleChangePopover: (open: boolean) => void
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const notificationSearchParam = useMemo(
    () =>
      searchParams.get(
        notificationsSearchParam
      ) as NotificationsTabsEnum | null,
    [searchParams]
  );

  const handleOpenPopoverInitial = useCallback(() => {
    if (notificationSearchParam === NotificationsTabsEnum.UNREAD) {
      setActiveTabKey(NotificationsTabsEnum.UNREAD);
      setIsPopoverOpen(true);
    }
  }, [notificationSearchParam, setActiveTabKey, setIsPopoverOpen]);

  const clearSearchParams = useCallback(() => {
    setSearchParams((prev) => {
      prev.delete(notificationsSearchParam);
      return prev;
    });
  }, [setSearchParams]);

  const _handleChangePopover = useCallback<typeof handleChangePopover>(
    (visible) => {
      if (!visible) {
        clearSearchParams();
      }
      handleChangePopover(visible);
    },
    [clearSearchParams, handleChangePopover]
  );

  useEffect(() => {
    handleOpenPopoverInitial();
  }, [handleOpenPopoverInitial]);

  return useMemo<[(open: boolean) => void, () => void]>(
    () => [_handleChangePopover, clearSearchParams],
    [_handleChangePopover, clearSearchParams]
  );
};
