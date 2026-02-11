import * as React from 'react';
import * as S from './Link.styled';

type LinkProps = {
  href: string;
  icon?: React.ReactNode;
  rightIcon?: boolean;
};

export const ExternalLink = ({
  href,
  icon = false,
  rightIcon = false,
  children,
}: React.PropsWithChildren<LinkProps>) => {
  return (
    <S.ExternalLink
      to={href}
      rightIcon={rightIcon}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
      {children}
    </S.ExternalLink>
  );
};

export const InternalLink = ({
  href,
  icon = false,
  rightIcon = false,
  children,
}: React.PropsWithChildren<LinkProps>) => {
  return (
    <S.InternalLink to={href} rightIcon={rightIcon}>
      {icon}
      {children}
    </S.InternalLink>
  );
};
