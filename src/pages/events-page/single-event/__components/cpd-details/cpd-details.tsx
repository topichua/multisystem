import { FC } from 'react';
import { CpdDetailsType } from 'src/transport/events/events.dto';
import {
  AdditionalInfoContents,
  SectionCard,
  StyledParagraph,
} from '../../single-event.page.styled';
import { Stack } from 'src/components/common/Stack/Stack';

type CpdDetailsProps = {
  cpdDetails: CpdDetailsType;
};
export const CpdDetails: FC<CpdDetailsProps> = ({ cpdDetails }) => {
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
  };

  return (
    <SectionCard titleHasBottomMargin>
      <p>CPD Details</p>

      {Object.entries(cpdDetails).map(([headerText, content]) => (
        <AdditionalInfoContents vertical spacing="normal">
          <Stack vertical spacing="none">
            <span className="content-header" style={{ fontSize: '16px' }}>
              {capitalizeFirstLetter(headerText)}
            </span>

            <StyledParagraph>{content ?? '-'}</StyledParagraph>
          </Stack>
        </AdditionalInfoContents>
      ))}
    </SectionCard>
  );
};
