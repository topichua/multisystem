import {
  FileAttachment02,
  FilterFunnel01,
  Image01,
  LayoutGrid02,
  Play,
  PresentationChart01,
  VideoRecorder,
} from '@untitled-ui/icons-react';
import { Select } from 'antd';
import omit from 'lodash/omit';
import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { GetItemsParams } from 'src/transport/resources/resources.dto';
import * as S from './styled.tsx';

const { Option } = Select;

const getFileIcon = (fileType: string) => {
  const iconMap: Record<string, React.ElementType> = {
    image: Image01,
    video: VideoRecorder,
    audio: Play,
    'application/pdf': FileAttachment02,
    text: FileAttachment02,
    'application/msword': FileAttachment02,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      FileAttachment02,
    'application/vnd.ms-excel': LayoutGrid02,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      LayoutGrid02,
    'application/vnd.ms-powerpoint': PresentationChart01,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      PresentationChart01,
  };

  return iconMap[fileType] || FileAttachment02;
};

const fileTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'application/pdf', label: 'PDF' },
  { value: 'text', label: 'Text' },
  { value: 'application/msword', label: 'Word' },
  { value: 'application/vnd.ms-excel', label: 'Excel' },
  { value: 'application/vnd.ms-powerpoint', label: 'PowerPoint' },
];

interface FileTypeFilterProps {
  setRequestParams: Dispatch<SetStateAction<GetItemsParams>>;
}

export const FileTypeFilter: React.FC<FileTypeFilterProps> = ({
  setRequestParams,
}) => {
  const handleSortChange = useCallback(
    (value: string) => {
      if (value !== 'all') {
        setRequestParams((oldValue) => ({
          ...oldValue,
          filter: {
            assets: {
              asset_id: {
                file: {
                  type: {
                    _starts_with: value,
                  },
                },
              },
            },
          },
        }));
      } else {
        setRequestParams((oldValue) => {
          return omit(oldValue, 'filter');
        });
      }
    },
    [setRequestParams]
  );

  return (
    <Select
      style={{ width: 180, height: 32 }}
      onChange={handleSortChange}
      defaultValue="all"
      suffixIcon={null}
      placeholder="Type"
    >
      {fileTypes.map((type) => {
        const Icon =
          type.value === 'all' ? FilterFunnel01 : getFileIcon(type.value);
        return (
          <Option key={type.value} value={type.value}>
            <S.StyledFilter align="center" justify="space-between">
              {type.label}
              <Icon height={16} width={16} style={{ marginRight: 8 }} />
            </S.StyledFilter>
          </Option>
        );
      })}
    </Select>
  );
};
