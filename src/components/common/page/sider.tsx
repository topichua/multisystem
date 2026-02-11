import * as React from 'react';
import styled from 'styled-components';
import { Layout, Drawer, Grid } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Title } from '../Typography/Title';
import { Button } from '../Button/Button';
import { HEADER_HEIGHT } from 'src/pages/authorized/header/header.styled';

const { Sider: AntdSider } = Layout;
const { useBreakpoint } = Grid;

export const StyledSider = styled(AntdSider)`
  padding: ${(props) => props.theme.spacing.extraLoose};
  padding-top: 0px;
  padding-bottom: 0px;
  border-right: 1px solid rgba(234, 236, 240, 1);
`;

export const StyledSiderMobile = styled(AntdSider)`
  padding: 0;
  border-right: none;
`;

export const Sider = (
  props: React.PropsWithChildren<{
    fixed?: boolean;
    sideBarWidth?: number;
    title?: string | React.ReactNode;
  }>
) => {
  const { fixed, sideBarWidth = 336, title } = props;
  const size = useBreakpoint();
  const [isOpen, setIsOpen] = React.useState(false);
  if (size.lg) {
    return (
      <StyledSider width={sideBarWidth}>
        <div
          style={{
            position: fixed ? 'sticky' : 'relative',
            top: fixed ? `${HEADER_HEIGHT}px` : 'auto',
            marginRight: '-24px',
            marginLeft: '-24px',
            paddingRight: '24px',
            maxHeight: fixed ? `calc(100vh - ${HEADER_HEIGHT}px)` : 'auto',
            overflowY: 'auto',
          }}
        >
          <div>
            {title && (
              <div
                style={{
                  boxSizing: 'border-box',
                  margin: '0 -24px 24px 0',
                  padding: '10px 24px',
                  minHeight: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                  borderBottom: '1px solid #EAECF0',
                }}
              >
                {typeof title === 'string' ? (
                  <Title level={4}>{title}</Title>
                ) : (
                  title
                )}
              </div>
            )}
            <div style={{ paddingLeft: 21 }}>{props.children}</div>
          </div>
        </div>
      </StyledSider>
    );
  } else {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          zIndex: 4,
        }}
      >
        {!isOpen && (
          <Button
            type={'primary'}
            style={{ position: 'fixed', left: 12, bottom: 48 }}
            size="large"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            icon={<UnorderedListOutlined />}
          />
        )}

        <Drawer
          placement="left"
          width={sideBarWidth}
          title={title}
          onClose={() => {
            setIsOpen(false);
          }}
          open={isOpen}
        >
          <StyledSiderMobile
            onClick={() => {
              setIsOpen(false);
            }}
            width={sideBarWidth - 50}
          >
            {props.children}
          </StyledSiderMobile>
        </Drawer>
      </div>
    );
  }
};

const SiderLock = (props: React.PropsWithChildren<unknown>) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {props.children}
    </div>
  );
};

Sider.Lock = SiderLock;
