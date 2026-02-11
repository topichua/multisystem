import SkeletonButton from 'antd/es/skeleton/Button';
import { ItemType } from 'antd/es/menu/interface';

export const SKELETON_KEY = '$SKELETON';

export const createMenuSkeletonItems = (length: number): ItemType[] => {
  const widths = [140, 160, 180, 190];

  return Array.from({ length }, (_, index) => ({
    key: `${SKELETON_KEY}_${index + 1}`,
    label: null,
    icon: (
      <SkeletonButton
        active
        style={{
          height: 18,
          width: widths[Math.floor(Math.random() * widths.length)],
        }}
      />
    ),
  }));
};
