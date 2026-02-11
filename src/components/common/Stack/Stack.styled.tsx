import * as React from 'react';
import styled from 'styled-components';
import { Alignment, Distribution, StackProps } from './Stack';
import { spacingDefinition } from 'src/styled/definitions/spacing';

export interface StackItemProps {
  fill?: boolean;
  ellipsis?: boolean;
  children?: React.ReactNode;
}

const flexAlignment: { [key in Alignment]: string } = {
  leading: 'flex-start',
  trailing: 'flex-end',
  center: 'center',
  fill: 'stretch',
  baseline: 'baseline',
};

const flexDistribution: { [key in Distribution]: string } = {
  equalSpacing: 'space-between',
  leading: 'flex-start',
  trailing: 'flex-end',
  center: 'center',
};

export const Item = styled(({ fill, ellipsis, ...props }: StackItemProps) => (
  <div {...props} />
  //@ts-ignore
)).attrs((props) => ({
  className: props.fill ? 'fill' : '',
}))`
  ${(props) =>
    props.ellipsis &&
    `
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	`}
`;

function flexDirection(vertical?: boolean, reverse?: boolean) {
  const reverseSuffix = reverse ? '-reverse' : '';
  return vertical ? `column${reverseSuffix}` : `row${reverseSuffix}`;
}

function buildGapValue(
  spacing:
    | keyof typeof spacingDefinition
    | [keyof typeof spacingDefinition, keyof typeof spacingDefinition]
) {
  if (Array.isArray(spacing)) {
    return `${spacingDefinition[spacing[0]]} ${spacingDefinition[spacing[1]]}`;
  }
  return spacingDefinition[spacing];
}

export const Stack = styled(
  ({
    wrap,
    fill,
    vertical,
    reverse,
    innerRef,
    ...props
  }: StackProps & { innerRef?: React.ForwardedRef<HTMLDivElement> }) => {
    return <div ref={innerRef} {...props} />;
  }
)`
  display: flex;
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'nowrap')};
  flex-direction: ${(props) => flexDirection(props.vertical, props.reverse)};
  justify-content: ${(props) => flexDistribution[props.distribution!]};
  align-items: ${(props) => flexAlignment[props.alignment!]};
  gap: ${(props) => buildGapValue(props.spacing!)};

  > ${Item} {
    flex: ${(props) => (props.fill ? '1 1 auto' : '0 1 auto')};
    max-width: ${(props) =>
      props.vertical ? '100%' : 'auto'}; /* make ellipsis work */
  }

  ${Item}.fill {
    flex: 1 1 auto;
    overflow: hidden;
  }
`;

Stack.defaultProps = {
  wrap: true,
  vertical: false,
  reverse: false,
  fill: false,
  spacing: 'normal',
  alignment: 'fill',
  distribution: 'leading',
} as Partial<StackProps>;
