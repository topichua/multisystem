import { UserProfileDto, UserRole } from 'src/transport/account/account.dto';

export const isUserAdmin = (user?: UserProfileDto | null) => {
  return (
    user?.role === UserRole.Admin ||
    user?.role === UserRole.WorkSpaceOwner ||
    user?.role === UserRole.Manager
  );
};
