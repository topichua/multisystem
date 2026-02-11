import { ChevronDown } from '@untitled-ui/icons-react';
import { Dropdown, MenuProps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import * as S from './styled.tsx';

interface ResponsiveTagListProps {
  tags: string[];
  containerWidth?: number;
  buttonStyle?: React.CSSProperties;
  compactButtonText?: string;
  horizontalPadding?: number;
}

export const ResponsiveTagList: React.FC<ResponsiveTagListProps> = ({
  tags,
  containerWidth: propContainerWidth,
  buttonStyle,
  compactButtonText = '+{count}',
  horizontalPadding = 16,
}) => {
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [hiddenTags, setHiddenTags] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibleTags = () => {
      if (!containerRef.current) return;

      const containerWidth =
        propContainerWidth || containerRef.current.offsetWidth;

      const tempButton = document.createElement('button');

      tempButton.style.cssText =
        'position: absolute; visibility: hidden; padding-left: 7px; padding-right: 7px';
      tempButton.textContent = compactButtonText.replace(
        '{count}',
        tags.length.toString()
      );
      document.body.appendChild(tempButton);
      const buttonWidth = tempButton.offsetWidth + horizontalPadding;

      document.body.removeChild(tempButton);

      if (containerWidth <= buttonWidth + horizontalPadding) {
        setVisibleTags([]);
        setHiddenTags(tags);
      } else {
        let currentWidth = 0;
        const newVisibleTags: string[] = [];
        const newHiddenTags: string[] = [];

        const measureTagWidth = (tag: string): number => {
          const tempTag = document.createElement('span');
          tempTag.innerHTML = `<span class='ant-tag' style='visibility: hidden; position: absolute;'>${tag}</span>`;
          document.body.appendChild(tempTag);
          const width =
            (tempTag.firstChild as HTMLElement)?.getBoundingClientRect()
              .width ?? 0;
          document.body.removeChild(tempTag);
          return width;
        };

        for (const tag of tags) {
          const tagWidth = measureTagWidth(tag);
          if (
            currentWidth + tagWidth + 4 <=
            containerWidth - buttonWidth - horizontalPadding * 2
          ) {
            newVisibleTags.push(tag);
            currentWidth += tagWidth + 4;
          } else {
            newHiddenTags.push(tag);
          }
        }

        setVisibleTags(newVisibleTags);
        setHiddenTags(newHiddenTags);
      }
    };

    updateVisibleTags();
    window.addEventListener('resize', updateVisibleTags);

    return () => {
      window.removeEventListener('resize', updateVisibleTags);
    };
  }, [tags, propContainerWidth, compactButtonText, horizontalPadding]);

  const dropdownItems: MenuProps['items'] = tags.map((tag) => ({
    key: tag,
    label: tag,
  }));

  const buttonText =
    hiddenTags.length === tags.length
      ? compactButtonText.replace('{count}', tags.length.toString())
      : `+${hiddenTags.length}`;

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        width: propContainerWidth,
        padding: `0px ${0}px 2px 0px`,
      }}
      onClick={(e) => {
        e?.stopPropagation();
      }}
    >
      {visibleTags.map((tag) => (
        <S.StyledTagLabel
          key={tag}
          style={{
            marginRight: 4,
            fontSize: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          {tag}
        </S.StyledTagLabel>
      ))}
      {hiddenTags.length > 0 && (
        <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
          <S.TagButton
            size="small"
            style={{
              marginLeft: 0,
              fontSize: '12px',
              flexShrink: 0,
              ...buttonStyle,
            }}
          >
            {buttonText} <ChevronDown height={12} width={12} />
          </S.TagButton>
        </Dropdown>
      )}
    </div>
  );
};
