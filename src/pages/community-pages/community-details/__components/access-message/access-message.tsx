import { Button, Result } from 'antd';
import { HttpStatusCode } from 'axios';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack } from 'src/components/common/Stack/Stack';
import { pagesMap } from 'src/pages/authorized/routes';

export const AccessMessage: FC<{ status: number }> = ({ status }) => {
  const navigate = useNavigate();
  return (
    <Result
      status={HttpStatusCode.BadRequest ? 404 : 403}
      title={
        status === HttpStatusCode.BadRequest
          ? 'Community not found.'
          : 'This community is private.'
      }
      subTitle={
        status === HttpStatusCode.BadRequest
          ? "This community doesn't exist or may have been removed."
          : 'You must be a member to view it.'
      }
      extra={
        <Stack alignment="center" distribution="center">
          <Button
            type="primary"
            onClick={() => navigate(pagesMap.exploreCommunities)}
          >
            Explore communities
          </Button>
        </Stack>
      }
    />
  );
};
