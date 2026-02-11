import { Link01 } from '@untitled-ui/icons-react';
import { useDebounce } from 'ahooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FaviconComponentProps {
  url: string;
}

const IconContainer = styled.span`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FaviconImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const StyledLinkOutlined = styled(Link01)`
  font-size: ${(props) => props.theme.fontSize.large};
`;

export const FaviconComponent: React.FC<FaviconComponentProps> = ({ url }) => {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [faviconLoaded, setFaviconLoaded] = useState(false);

  const debouncedUrl = useDebounce(url, { wait: 400 });

  const getFaviconUrl = useCallback((url: string) => {
    try {
      const parsedUrl = new URL(url);
      return `${parsedUrl.protocol}//${parsedUrl.hostname}/favicon.ico`;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const newFaviconUrl = getFaviconUrl(debouncedUrl);
    setFaviconUrl(newFaviconUrl);
    setFaviconLoaded(false);
  }, [debouncedUrl, getFaviconUrl]);

  const loadFavicon = useCallback((faviconUrl: string) => {
    const img = new Image();
    img.onload = () => setFaviconLoaded(true);
    img.onerror = () => setFaviconLoaded(false);
    img.src = faviconUrl;
  }, []);

  useEffect(() => {
    if (faviconUrl) {
      loadFavicon(faviconUrl);
    }
  }, [faviconUrl, loadFavicon]);

  const faviconContent = useMemo(() => {
    if (faviconUrl && faviconLoaded) {
      return <FaviconImage src={faviconUrl} alt="Favicon" />;
    }
    return <StyledLinkOutlined />;
  }, [faviconUrl, faviconLoaded]);

  return <IconContainer>{faviconContent}</IconContainer>;
};
