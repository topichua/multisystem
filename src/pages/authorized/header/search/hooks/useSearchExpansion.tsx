import { useBoolean } from 'ahooks';
import { InputRef } from 'antd';
import { useCallback, useRef, useState } from 'react';

export const useSearchExpansion = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [
    isAutoCompleteOpen,
    { setFalse: hideAutoComplete, setTrue: showAutoComplete },
  ] = useBoolean(true);

  const inputRef = useRef<InputRef>(null);

  const handleExpand = useCallback(() => {
    showAutoComplete();
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleCollapse = useCallback(() => {
    hideAutoComplete();
    setIsExpanded(false);
  }, []);

  return {
    isExpanded,
    inputRef,
    handleExpand,
    handleCollapse,
    isAutoCompleteOpen,
    showAutoComplete,
    hideAutoComplete,
  };
};
