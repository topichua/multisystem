import { Pencil01, Plus, Trash01 } from '@untitled-ui/icons-react';
import { Popover, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { Title } from 'src/components/common/Typography/Title';
// import { useCurrentUserStore } from 'src/pages/authorized/authorized.layout';
// import { UserRole } from 'src/transport/account/account.dto';
import { useOnClickOutside } from './hooks/useOnClickOutside';
import { Button } from 'src/components/common/Button/Button';
import { iconSizes } from './assets.utils';

const { Text } = Typography;

type AssetLabelProps = {
  title: string;
  description: string;
  itemCount: number;
  loading: boolean;
  onAddFile: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onRename: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onDelete: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  isUserModerator: boolean;
  showActions?: boolean;
};

export const AssetLabel: React.FC<AssetLabelProps> = ({
  title,
  description,
  itemCount,
  loading,
  onAddFile,
  onRename,
  onDelete,
  showActions = true,
}) => {
  const [visible, setVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverRef, () => setVisible(false));

  const stopPropagation = (event: React.MouseEvent<HTMLElement, MouseEvent>) =>
    event.stopPropagation();

  return (
    <Stack alignment="center" distribution="equalSpacing">
      <Stack spacing="extraTight" vertical>
        <Stack>
          <Title level={4}>{title}</Title>
          <Tag color="purple" size="small">
            {`${itemCount} file${itemCount !== 1 ? 's' : ''}`}
          </Tag>
        </Stack>
        {description?.length && <Text>{description}</Text>}
      </Stack>
      {showActions && (
        <Stack alignment="center">
          <Button
            size="small"
            type="link"
            icon={<Plus {...iconSizes} />}
            onClick={(e) => {
              stopPropagation(e);
              onAddFile(e);
            }}
          />
          <Button
            size="small"
            type="link"
            icon={<Pencil01 {...iconSizes} />}
            onClick={(e) => {
              stopPropagation(e);
              onRename(e);
            }}
          />
          <Popover
            open={visible}
            content={
              <div ref={popoverRef}>
                <Stack vertical>
                  <Text>Are you sure you want to delete this folder?</Text>
                  <Stack>
                    <Button
                      danger
                      size="small"
                      type="primary"
                      loading={loading}
                      onClick={(e) => {
                        stopPropagation(e);
                        onDelete(e);
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      disabled={loading}
                      onClick={(e) => {
                        stopPropagation(e);
                        setVisible(false);
                      }}
                    >
                      No
                    </Button>
                  </Stack>
                </Stack>
              </div>
            }
            title="Confirm Deletion"
            trigger="click"
          >
            <Button
              size="small"
              type="link"
              danger
              icon={<Trash01 {...iconSizes} />}
              onClick={(e) => {
                setVisible(true);
                stopPropagation(e);
              }}
              style={{ top: -1 }}
            />
          </Popover>
        </Stack>
      )}
    </Stack>
  );
};
