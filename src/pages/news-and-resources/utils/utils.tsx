import { Skeleton } from 'antd';
import { ItemType } from 'antd/es/menu/interface';

export const ALL_CATEGORIES_PARAM = 'all_categories';

export const SKELETON_KEY = '$SKELETON';

export const skeletonItems: ItemType[] = [
  {
    key: `${SKELETON_KEY}_1`,
    label: null,
    icon: <Skeleton.Button active style={{ height: 18, width: 180 }} />,
  },
  {
    key: `${SKELETON_KEY}_2`,
    label: null,
    icon: <Skeleton.Button active style={{ height: 18, width: 140 }} />,
  },
  {
    key: `${SKELETON_KEY}_3`,
    label: null,
    icon: <Skeleton.Button active style={{ height: 18, width: 160 }} />,
  },
];
