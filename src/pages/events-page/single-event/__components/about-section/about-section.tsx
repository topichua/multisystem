import { FC, ReactNode } from 'react';
import { Stack } from 'src/components/common/Stack/Stack';
import {
  Briefcase01,
  LinkExternal01,
  MarkerPin04,
} from '@untitled-ui/icons-react';
import { components } from 'src/styled/definitions/colors';
import {
  ContentWrapper,
  SectionCard,
  SectionIconDetails,
} from '../../single-event.page.styled';
import Link from 'antd/es/typography/Link';

const sizeIconDetails = {
  height: 20,
  width: 20,
  color: components.colors.mono500,
};

type AboutSectionProps = {
  content: string;
  externalUrl?: string;
  type?: string;
  venue?: string;
};

export const AboutSection: FC<AboutSectionProps> = ({
  content,
  externalUrl,
  type,
  venue,
}) => {
  const ensureFullUrl = (url: string) => {
    // Check if the URL already has a protocol (http:// or https://)
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`; // Default to https://
    }
    return url;
  };

  const mapIconDetails: {
    icon: ReactNode;
    content?: ReactNode;
  }[] = [
    {
      icon: <LinkExternal01 {...sizeIconDetails} />,
      content: externalUrl ? (
        <Link
          href={ensureFullUrl(externalUrl)}
          target="_blank"
          className="external-link"
        >
          {externalUrl}
        </Link>
      ) : (
        <span className="sub-details-text">{'-'}</span>
      ),
    },
    {
      icon: <Briefcase01 {...sizeIconDetails} />,
      content: <span className="sub-details-text">{type ?? '-'}</span>,
    },
    {
      icon: <MarkerPin04 {...sizeIconDetails} />,
      content: (
        <span className={`sub-details-text ${!venue ? '' : 'venue'}`}>
          {venue ?? '-'}
        </span>
      ),
    },
  ];

  return (
    <SectionCard>
      <p>About</p>
      <ContentWrapper dangerouslySetInnerHTML={{ __html: content }} />

      <SectionIconDetails>
        {mapIconDetails.map((item) => (
          <Stack spacing="loose">
            {item.icon}
            {item.content}
          </Stack>
        ))}
      </SectionIconDetails>
    </SectionCard>
  );
};
