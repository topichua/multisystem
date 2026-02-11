import {
  AlertSquare,
  Award02,
  Lightbulb02,
  Users01,
} from '@untitled-ui/icons-react';
import { components } from 'src/styled/definitions/colors';
import {
  PostLabelEnum,
  PostReportTypeEnum,
} from 'src/transport/posts/posts.dto';

export const postReportSelectOptions: Array<{ label: string; value: number }> =
  [
    {
      label: 'Inappropriate content',
      value: PostReportTypeEnum.InappropriateContent,
    },
    {
      label: 'Privacy concerns',
      value: PostReportTypeEnum.PrivacyContent,
    },
    {
      label: 'Share post in other groups',
      value: PostReportTypeEnum.SharePostInOtherGroups,
    },
    {
      label:
        'Remove post from group (specify group/s. Can’t remove from ‘originally posted in’ group)',
      value: PostReportTypeEnum.RemovePost,
    },
  ];

export const iconProps = {
  width: 14,
  height: 14,
};

export const postLabels = {
  [PostLabelEnum.Urgent]: {
    text: 'Urgent help sought',
    icon: <AlertSquare {...iconProps} color="#F16522" />,
    color: '#F16522',
    background: '#fde8de',
  },
  [PostLabelEnum.OpportunityCollaborate]: {
    text: 'Opportunity to collaborate',
    icon: <Users01 {...iconProps} color={components.colors.brandColor} />,
    color: components.colors.brandColor,
    background: '#e7e3fa',
  },
  [PostLabelEnum.OpportunityContinue]: {
    text: 'Opportunity to contribute',
    icon: <Award02 {...iconProps} color="#DAA520" />,
    color: '#DAA520',
    background: '#f9f1de',
  },
  [PostLabelEnum.Knowledge]: {
    text: 'Knowledge sharing',
    icon: <Lightbulb02 {...iconProps} color="#4B90A7" />,
    color: '#4B90A7',
    background: '#e4eef2',
  },
};
