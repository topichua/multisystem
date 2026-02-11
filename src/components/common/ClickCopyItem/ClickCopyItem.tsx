import { Typography } from 'antd';
import { copyToClipboard } from 'src/utils/copyToClipboard.ts';
import * as S from './ClickCopyItem.styles';

const { Text } = Typography;

type ClickCopyItemProps = {
  text: string;
  color?: string;
};

const ClickCopyItem = ({ text, color }: ClickCopyItemProps) => {
  return (
    <S.StyledStack $color={color} spacing="extraTight" alignment="center">
      <Text strong>{text}</Text>
      <S.CopyButton height={20} onClick={() => copyToClipboard(text)} />
    </S.StyledStack>
  );
};

export default ClickCopyItem;
