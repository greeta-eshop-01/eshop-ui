import { AuthProviderProps } from 'oidc-react/build/src/AuthContextInterface';

export const oidcConfig: AuthProviderProps = {
  onSignIn: () => {
    window.location.replace('/');
  },
  authority: `${process.env.REACT_APP_AUTH_SERVER_URL}/realms/eshop-realm`,
  clientId: 'eshop-app',
  redirectUri: window.location.origin + '/',
  scope: '',
  responseType: 'code',
  autoSignIn: true,
  loadUserInfo: true,
  automaticSilentRenew: true
};
