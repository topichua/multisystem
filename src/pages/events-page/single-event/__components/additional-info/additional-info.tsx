import { FC } from 'react';
import {
  AdditionalInfoContents,
  SectionCard,
  StyledParagraph,
} from '../../single-event.page.styled';
import { Stack } from 'src/components/common/Stack/Stack';

type AdditionalInfoProps = {
  reasoningContent?: string;
  accessContent?: string;
};
export const AdditionalInfo: FC<AdditionalInfoProps> = ({
  reasoningContent,
  accessContent,
}) => {
  const additionalInfoContents: Array<{
    contentHeader: string;
    contentText: string;
  }> = [
    {
      contentHeader:
        'How will this webinar enable participants to work occupationally with clients/patients?',
      contentText: reasoningContent ?? '-',
    },
    {
      contentHeader: 'Access',
      contentText: accessContent ?? '-',
    },
  ];
  return (
    <SectionCard titleHasBottomMargin>
      <p>Additional info</p>

      {additionalInfoContents.map((item) => (
        <AdditionalInfoContents vertical spacing="loose">
          <Stack vertical spacing="extraTight">
            <span className="content-header">{item.contentHeader}</span>

            <StyledParagraph>{item.contentText}</StyledParagraph>
          </Stack>
        </AdditionalInfoContents>
      ))}
    </SectionCard>
  );
};
