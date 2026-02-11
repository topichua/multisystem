import { Compass03, LinkExternal01 } from '@untitled-ui/icons-react';
import {
  Avatar,
  ButtonProps,
  Card,
  Dropdown,
  DropdownProps,
  Flex,
  Tooltip,
} from 'antd';
import noop from 'lodash/noop';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import { components } from 'src/styled/definitions/colors';
import { CommunitiyDto } from 'src/transport/communities/communities.dto';

import * as S from './SharedCommunitiesDropdown.styled';

const DEFAULT_COMMUNITY_LOGO_SRC =
  'https://shpadevstorage.blob.core.windows.net/images/community/ae5d71fd-f2ab-411b-9170-cf71eb1afdc1';

interface SharedCommunitiesDropdownProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  data?: CommunitiyDto[];
  secondaryCommunitiesLength?: number;
  onOpenChange?: DropdownProps['onOpenChange'];
  buttonProps?: ButtonProps;
  iconProps?: React.SVGProps<SVGSVGElement>;
}

export const SharedCommunitiesDropdown: FC<SharedCommunitiesDropdownProps> = ({
  data,
  isLoading,
  isDisabled,
  onOpenChange = noop,
  secondaryCommunitiesLength,
  buttonProps = {},
  iconProps = {},
}) => {
  return (
    <Dropdown
      onOpenChange={onOpenChange}
      disabled={isDisabled}
      trigger={['click']}
      dropdownRender={() => (
        <Card
          size="small"
          style={{
            width: 'auto',
            maxWidth: 300,
            minWidth: 250,
            boxShadow:
              '0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)',
          }}
          title={`Shared communities (${secondaryCommunitiesLength})`}
        >
          <S.StyledSkeleton
            round
            active
            title={false}
            loading={isLoading}
            paragraph={{ rows: secondaryCommunitiesLength, width: '100%' }}
          >
            <Flex vertical gap={10}>
              {data?.length &&
                data?.map((community) => {
                  return (
                    <Link
                      key={community?.id}
                      to={`/community/${community?.id}`}
                      target="_blank"
                    >
                      <Flex align="center" gap={10}>
                        <Avatar
                          size={24}
                          style={{ minWidth: 24 }}
                          alt={community?.name}
                          shape="square"
                          src={
                            community?.imageUrl || DEFAULT_COMMUNITY_LOGO_SRC
                          }
                        />

                        <S.StyledLinkText strong ellipsis={{ tooltip: true }}>
                          {community?.name}
                        </S.StyledLinkText>
                        <Tooltip title="Open in new tab">
                          <LinkExternal01
                            width={14}
                            height={14}
                            color={components.colors.linkColor}
                          />
                        </Tooltip>
                      </Flex>
                    </Link>
                  );
                })}
            </Flex>
          </S.StyledSkeleton>
        </Card>
      )}
    >
      <Tooltip title={`Shared communities (${secondaryCommunitiesLength})`}>
        <S.StyledButton
          type="link"
          disabled={isDisabled}
          icon={<Compass03 {...iconProps} />}
          {...buttonProps}
        />
      </Tooltip>
    </Dropdown>
  );
};
