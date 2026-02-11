import styled from 'styled-components';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';

type ExpandButtonProps = {
  onClick: () => void;
  isExpanded: boolean;
  text?: string;
};

const ColoredLinkButton = styled(Button)`
  color: ${(props) =>
    props.theme.colors.components.colors.brandColor} !important;
  font-size: 16px;
  font-weight: 500;
`;

export const MoreLessButton = ({
  onClick,
  isExpanded,
  text = 'See more',
}: ExpandButtonProps) => (
  <Button type="link" size="small" onClick={onClick}>
    {isExpanded ? (
      ''
    ) : (
      <Stack alignment="center" distribution="center" spacing="extraTight">
        <ColoredLinkButton block type="link" shape="default">
          {text}
        </ColoredLinkButton>
      </Stack>
    )}
  </Button>
);
