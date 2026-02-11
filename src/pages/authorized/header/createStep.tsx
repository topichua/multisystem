import { Typography } from 'antd';
import { TourStepProps } from 'antd/es/tour/interface';
import { Stack } from 'src/components/common/Stack/Stack';
import * as S from './header.styled.tsx';

const { Text } = Typography;

interface CreateStepProps {
  title: string;
  description: string;
  target?: HTMLElement | (() => HTMLElement) | (() => null) | null;
  setStep: (increment: number) => void;
  isFinalStep?: boolean;
}

const createStep = ({
  title,
  description,
  target,
  setStep,
  isFinalStep = false,
}: CreateStepProps): TourStepProps => ({
  title: (
    <S.TitleText>
      {title}
      <S.Hidder />
    </S.TitleText>
  ),
  description: (
    <S.Description>
      <S.DescriptionText level={5}>{description}</S.DescriptionText>
    </S.Description>
  ),
  target,
  nextButtonProps: {
    children: (
      <Stack alignment="center" spacing="extraTight">
        <Text style={{ color: 'white' }}>
          {isFinalStep ? 'Finish' : 'Next'}
        </Text>
        {!isFinalStep && <S.ArrowIcon />}
      </Stack>
    ),
    style: {
      width: isFinalStep ? 68 : 84,
      height: 36,
      borderRadius: 8,
      boxShadow: 'none',
    },
    onClick: () => setStep(1),
  },
  prevButtonProps: {
    onClick: () => setStep(-1),
    children: <Text>Previous</Text>,
    style: { width: 87, height: 36, borderRadius: 8 },
  },
  onClose: () => setStep(1),
});

export default createStep;
