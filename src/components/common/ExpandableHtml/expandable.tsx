import { useSize } from 'ahooks';
import noop from 'lodash/noop';
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

// import { Container } from './expandableHtml';
import { ChevronDown } from '@untitled-ui/icons-react';
import { Button } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';

type ExpandableProps = {
  render: ReactNode;
  expanded?: boolean;
  maxHeight?: number;
  onExpandClick?: () => void;
};

export const Expandable: FC<ExpandableProps> = ({
  maxHeight = 160,
  expanded = false,
  onExpandClick = noop,
  render,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentRefSize = useSize(contentRef);
  const [isExpanded, setIsExpanded] = useState(expanded);

  const showExpandedControls = useMemo(() => {
    return (contentRefSize?.height || 0) > maxHeight;
  }, [contentRefSize?.height, maxHeight]);

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <AnimatePresence initial={false}>
          <motion.div
            animate={{
              height: isExpanded ? 'auto' : maxHeight,
            }}
            initial={false}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            style={{
              overflow: 'hidden',
            }}
          >
            <div ref={contentRef}>{render}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {showExpandedControls && (
        <Button
          block
          type="link"
          size="small"
          onClick={onExpandClick}
          icon={
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ChevronDown height={20} width={20} />
            </motion.div>
          }
        />
      )}
    </div>
  );
};
