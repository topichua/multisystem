import { useSize } from 'ahooks';
import noop from 'lodash/noop';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { MoreLessButton } from 'src/components/common/MoreLessButton/moreLessButton';
import { SafeHtml } from 'src/components/common/SafeHtml/safeHtml';
import { Stack } from 'src/components/common/Stack/Stack';

export const Container = styled.div`
  height: 100%;
  overflow: hidden;
`;

export const BlurLine = styled.div`
  background: white;
  height: 15px;
  width: 100%;
  bottom: 0;
  position: absolute;
`;

type ExpandableHtmlProps = {
  rawHtml: string;
  expanded?: boolean;
  fontSize?: number;
  maxHeight?: number;
  onExpandClick?: () => void;
  isPlainText?: boolean;
};

export function ExpandableHtml({
  rawHtml,
  maxHeight = 160,
  fontSize,
  expanded = false,
  onExpandClick = noop,
  isPlainText = false,
}: ExpandableHtmlProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const contentRef = useRef<HTMLDivElement>(null);

  const processedHtml = useMemo(() => {
    if (!isPlainText) '';
    const urlPattern = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+)/g;

    return rawHtml.replace(urlPattern, (url) => {
      const href = url.startsWith('www.') ? `http://${url}` : url;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }, [isPlainText, rawHtml]);

  const contentRefSize = useSize(contentRef);

  const showExpandedControls = useMemo(() => {
    return (contentRefSize?.height || 0) > maxHeight;
  }, [contentRefSize]);

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <Container
          style={{
            maxHeight: !isExpanded ? maxHeight : '100%',
          }}
        >
          <div ref={contentRef}>
            <SafeHtml
              fontSize={fontSize}
              rawHtml={isPlainText ? processedHtml : rawHtml}
            />
          </div>
        </Container>
        {showExpandedControls && !isExpanded && <BlurLine />}
      </div>
      {showExpandedControls && (
        <Stack>
          <MoreLessButton
            onClick={() => {
              onExpandClick();
              setIsExpanded(!isExpanded);
            }}
            isExpanded={isExpanded}
          />
        </Stack>
      )}
    </>
  );
}
