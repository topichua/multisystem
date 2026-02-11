// import { LoginResponseDto } from 'src/transport/account/account.dto';

export const getReturnUrlOrNull = (path: string): string | null => {
  const determinator = '?returnUrl=';
  let returnUrl = null;
  if (path != null && path.includes(determinator)) {
    returnUrl = path.replace(determinator, '');
  }
  return returnUrl;
};

export const storeUserCredentialsInLocalStorage = (token: string) => {
  localStorage.setItem('authorization', token);
};

export function openLoginWithUserToken() {
  const baseUrl = import.meta.env.VITE_EXTERNAL_BASE_URL;
  window.open(
    `${baseUrl}/login?username=${localStorage.getItem(
      'userName'
    )}&userToken=${localStorage.getItem(
      'userToken'
    )}&path=updatemysubscription&startFromBeginning=true`,
    '_blank'
  );
}
