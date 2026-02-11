import { AutoComplete } from 'antd';
import styled, { css } from 'styled-components';

import * as T from './types';

export const SearchContainer = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const mobileExpandedCss = css`
  top: 35px;
  left: 10px;
  right: 10px;
`;

export const SearchWrapper = styled.div<{ $isExpanded: boolean }>`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  width: ${(props) => (props.$isExpanded ? '500px' : '40px')};
  height: 40px;
  transition: width 0.3s ease-in-out;
  background-color: transparent;
  z-index: 1001;

  @media (max-width: 768px) {
    width: ${(props) => (props.$isExpanded ? 'calc(100vw - 20px)' : '40px')};
    right: ${(props) => (props.$isExpanded ? '40px' : '0')};
    position: ${(props) => (props.$isExpanded ? 'fixed' : 'absolute')};
    ${({ $isExpanded }) => ($isExpanded ? mobileExpandedCss : '')}
  }
`;

export const StyledAutoComplete = styled(AutoComplete<string, T.OptionsType>)`
  width: 100%;
  .ant-select-selector {
    border: none !important;
    box-shadow: none !important;
  }
`;

export const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

export const Mask = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  visibility: ${(props) => (props.$isVisible ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
`;
