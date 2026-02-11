import { Globe01, Lock01, Users01 } from '@untitled-ui/icons-react';
import { ReactNode } from 'react';
import { Badge } from 'src/components/common/Badge/Badge.tsx';
import { MEETING_VISIBILITY } from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/const.tsx';

export const downloadFile = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(`Error downloading ${fileName}:`, error);
  }
};

export const getMeetingBadge: Record<MEETING_VISIBILITY, ReactNode> = {
  [MEETING_VISIBILITY.PUBLIC]: (
    <Badge size="small">
      <Globe01 height={12} width={12} /> Public
    </Badge>
  ),
  [MEETING_VISIBILITY.COMMUNITY]: (
    <Badge size="small">
      <Users01 height={12} width={12} /> Community
    </Badge>
  ),
  [MEETING_VISIBILITY.PRIVATE]: (
    <Badge size="small">
      <Lock01 height={12} width={12} /> Private
    </Badge>
  ),
};
