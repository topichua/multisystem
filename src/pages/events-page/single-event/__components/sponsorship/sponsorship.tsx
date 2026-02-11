import { FC } from 'react';
import { ContentWrapper, SectionCard } from '../../single-event.page.styled';

type SponsorshipProps = {
  sponsorContent: string;
};
export const Sponsorship: FC<SponsorshipProps> = ({ sponsorContent }) => {
  return (
    <SectionCard titleHasBottomMargin>
      <p>Sponsorship</p>
      <ContentWrapper dangerouslySetInnerHTML={{ __html: sponsorContent }} />
    </SectionCard>
  );
};
