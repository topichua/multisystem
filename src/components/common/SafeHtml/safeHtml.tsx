import { Typography } from 'antd';
import { useSafeHtml } from 'src/utils/useHtmlUtils';
import * as S from './safeHtml.styled';

const { Text } = Typography;

type SafeHtmlProps = {
  rawHtml: string;
  fontSize?: number;
};

export function SafeHtml({
  rawHtml,
  fontSize,
  ...textProps
}: SafeHtmlProps & {
  [x: string]: any; // to allow passing props like onClick, style etc.
}) {
  const safeHtml = useSafeHtml(rawHtml);

  return (
    <Text style={{ fontSize }} {...textProps}>
      <S.HtmlContainer
        className="html-container"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </Text>
  );
}
