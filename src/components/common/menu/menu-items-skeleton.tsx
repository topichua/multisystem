import { FC } from 'react';
import { Stack } from 'src/components/common/Stack/Stack';
import { SKELETON_KEY } from 'src/utils/skeleton-utils';
import SkeletonButton from 'antd/es/skeleton/Button';

export const MenuItemsSkeleton: FC<{ length?: number }> = ({ length = 18 }) => {
  const widths = [140, 160, 180, 190];

  return (
    <Stack
      vertical
      spacing="extraLoose"
      distribution="equalSpacing"
      style={{ marginTop: '69px' }}
    >
      {Array.from({ length }, (_, index) => (
        <SkeletonButton
          active
          key={`${SKELETON_KEY}_${index + 1}`}
          style={{
            height: 18,
            width: widths[Math.floor(Math.random() * widths.length)],
          }}
        />
      ))}
    </Stack>
  );
};
