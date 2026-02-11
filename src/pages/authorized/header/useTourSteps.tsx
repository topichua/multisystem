import { TourProps } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import createStep from 'src/pages/authorized/header/createStep.tsx';
import * as S from './header.styled.tsx';

export const useTourSteps = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const refCommunity = useRef(null);
  const refEvents = useRef(null);
  const refNewsResources = useRef(null);
  const refAccount = useRef(null);

  const [open, setOpen] = useState<boolean>(false);

  const setStep = (increment: number) =>
    setCurrentStep((prev) => prev + increment);
  const steps: TourProps['steps'] = useMemo(
    () => [
      {
        renderPanel: () => (
          <S.StyledTour vertical spacing="loose">
            <Stack distribution="equalSpacing">
              <S.LogoTour />
              <S.CloseIcon onClick={() => setCurrentStep(currentStep + 1)} />
            </Stack>
            <Title style={{ fontSize: 18 }}>
              Welcome to your OTA member portal!
            </Title>
            <Title level={5} fontWeight={400}>
              Would you like a quick tour of your portal and its <br />{' '}
              features?
            </Title>
            <Stack vertical style={{ paddingTop: 10 }}>
              <Button
                size="large"
                block
                onClick={() => setCurrentStep(currentStep + 1)}
                type="primary"
              >
                Show me around!
              </Button>
              <Button size="large" block onClick={() => setOpen(false)}>
                Skip tour
              </Button>
            </Stack>
          </S.StyledTour>
        ),
        title: undefined,
      },
      createStep({
        title: 'Communities',
        description: 'Join a community, connect with peers and stay informed',
        target: () => refCommunity.current,
        setStep,
      }),
      createStep({
        title: 'Events',
        description: 'Search and view our latest CPD courses and major events',
        target: () => refEvents.current,
        setStep,
      }),
      createStep({
        title: 'What’s happening',
        description: 'Keep up to date with our latest news and resources',
        target: () => refNewsResources.current,
        setStep,
      }),
      createStep({
        title: 'Manage account',
        description:
          'Manage your details, preferences, notification settings and memberships here.',
        target: () => refAccount.current,
        setStep,
        isFinalStep: true,
      }),
    ],
    [currentStep, setOpen]
  );

  return useMemo(
    () => ({
      open,
      steps,
      refCommunity,
      refEvents,
      refNewsResources,
      refAccount,
      currentStep,
      setOpen,
    }),
    [currentStep, open, steps]
  );
};
