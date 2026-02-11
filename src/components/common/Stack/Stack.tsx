import * as React from 'react';
import { spacingDefinition } from '../../../styled/definitions/spacing';
import { elementChildren, wrapWithComponent } from '../../../utils/components';
import { Item } from './components/Item';
import * as S from './Stack.styled';

export type Alignment = 'leading' | 'trailing' | 'center' | 'fill' | 'baseline';

export type Distribution = 'equalSpacing' | 'leading' | 'trailing' | 'center';

export interface StackProps {
  /** Elements to display inside stack */
  children?: React.ReactNode;
  /** Wrap stack elements to additional rows as needed on small screens (Defaults to true) */
  wrap?: boolean;
  /** Stack the elements vertically */
  vertical?: boolean;
  /** Adjust spacing between elements */
  spacing?:
    | keyof typeof spacingDefinition
    | [keyof typeof spacingDefinition, keyof typeof spacingDefinition];
  /** Adjust vertical alignment of elements */
  alignment?: Alignment;
  /** Adjust horizontal alignment of elements */
  distribution?: Distribution;
  /** Adjust horizontal alignment for equal width of elements */
  fill?: boolean;
  /** Insert an element between each Stack node **/
  split?: React.ReactNode | string;
  /** Stack the elements in reverse **/
  reverse?: boolean;
  /** All css properties **/
  style?: React.CSSProperties;
}

export const StackComponent = React.forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    const { children, split, ...rest } = props;
    let processedChildren;
    // const { vertical, spacing, distribution, alignment, wrap } = rest;

    if (split) {
      const SplitComponent =
        typeof split === 'string' ? <span>{split}</span> : split;
      processedChildren = React.Children.toArray(children).flatMap(
        (child, index) => (index === 0 ? [child] : [SplitComponent, child])
      );
    } else {
      processedChildren = children;
    }

    const itemMarkup = elementChildren(processedChildren).map(
      (child, index) => {
        const props = { key: index };
        return wrapWithComponent(child, Item, props as any);
      }
    );

    return (
      <S.Stack innerRef={ref} {...rest}>
        {itemMarkup}
      </S.Stack>
    );
  }
);

StackComponent.displayName = 'Stack';
export const Stack = Object.assign(StackComponent, { Item });
