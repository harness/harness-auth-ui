export default {
  toSignIn: () => `/signin`,
  toLocalLogin: () => `/local-login`,
  toSSOSignIn: () => `/sso`,
  toForgotPassword: () => `/forgot-password`,
  toResetPassword: () => `/reset-password/:token`,
  toTwoFactorAuth: () => `/two-factor-auth`,
  toSignUp: () => `/signup`,
  toAcceptInvite: () => `/accept-invite`,
  toEmailVerification: () => `/email-verification`,
  toCompleteInvite: () => `/register/verify/:token`
};
