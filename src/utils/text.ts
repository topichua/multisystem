import deburr from 'lodash/deburr';
import kebabCase from 'lodash/kebabCase';

import { CountLabels, formatOptionsMap } from './text-consts';

export const formatSingular = (
  count: number,
  labelOrSingular: CountLabels | string,
  plural?: string,
  empty?: string
) => {
  const formatOptions = Object.values(CountLabels).includes(
    labelOrSingular as CountLabels
  )
    ? formatOptionsMap[labelOrSingular as CountLabels]
    : undefined;

  const singular = formatOptions?.singular || (labelOrSingular as string);
  const pluralText = formatOptions?.plural || plural || `${singular}s`;
  const emptyText = formatOptions?.empty || empty;

  if (count === 0) {
    return emptyText || `No ${pluralText} yet`;
  }

  return `${count} ${count === 1 ? singular : pluralText}`;
};

export const formatPrice = (value: number): string => {
  return value.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });
};

export const removeHtmlTags = (str: string): string => {
  return str.replace(/<\/?[^>]+(>|$)/g, '');
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const URL_REGEX =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;

export const convertToUrlFriendlySlug = (input: string | undefined) =>
  kebabCase(deburr((input || '')?.toLowerCase()));

export const formatMemberText = (
  count: number,
  prefix: 'removed' | 'blacklisted' | 'community' | string = '',
  suffix: string = 'member'
): string => {
  const memberText = prefix ? `${prefix} ${suffix}` : suffix;
  return formatSingular(count, memberText, `${memberText}s`);
};
