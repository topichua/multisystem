import { Empty } from 'antd';
import { FC } from 'react';

type EmptyUserListProps = {
  keyword: string;
  usersCount: number;
};

export const EmptyUserList: FC<EmptyUserListProps> = ({
  keyword,
  usersCount,
}) => {
  return (
    <>
      {keyword.trim().length < 3 && (
        <Empty description="Please enter at least 3 letters" />
      )}

      {keyword.trim().length > 2 && usersCount === 0 && (
        <Empty description="Not found users" />
      )}
    </>
  );
};
