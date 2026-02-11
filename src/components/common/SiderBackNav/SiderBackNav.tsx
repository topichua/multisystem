import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from '../Stack/Stack';
import { Button } from '../Button/Button';
import { ChevronLeft } from '@untitled-ui/icons-react';
import { pagesMap } from 'src/pages/authorized/routes';
import { Title } from '../Typography/Title';

type SiderBackNavProps = {
  textLabel: string;
  pathToNavigateBackTo: string;
  handleClick?: () => void;
};
export const SiderBackNav: FC<SiderBackNavProps> = ({
  textLabel,
  pathToNavigateBackTo,
  handleClick,
}) => {
  const navigate = useNavigate();

  const handleBackNavClick = () => {
    if (handleClick && typeof handleClick === 'function') {
      handleClick();
    }
    navigate(pathToNavigateBackTo ?? pagesMap.home);
  };

  return (
    <Stack alignment="center">
      <Button type="link" icon={<ChevronLeft />} onClick={handleBackNavClick} />
      <Title level={4}>{textLabel ?? ''}</Title>
    </Stack>
  );
};
