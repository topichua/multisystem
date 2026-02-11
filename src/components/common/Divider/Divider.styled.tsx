import styled from 'styled-components';
import { Divider as AntdDivider, DividerProps as AntdDividerProps } from 'antd';
import { spacingDefinition } from 'src/styled/definitions/spacing';

export type DividerProps = {
  spacing?: keyof typeof spacingDefinition;
} & AntdDividerProps;

export const Divider = styled(
  ({ spacing = spacingDefinition.extraLoose, ...props }) => {
    return <AntdDivider {...props} />;
  }
)<DividerProps>`
  ${(props) =>
    props.spacing && `margin: ${props.theme.spacing[props.spacing]} 0;`}
`;
