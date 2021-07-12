import React from "react";
import { Route, HashRouter, Redirect, Switch } from "react-router-dom";
import { RestfulProvider } from "restful-react";
import { Toaster } from "react-hot-toast";

import routes from "./RouteDefinitions";
import SignUp from "./pages/SignUp/Signup";
import SignIn from "./pages/SignIn/SignIn";
import LocalLogin from "./pages/LocalLogin/LocalLogin";
import SSOSignIn from "./pages/SSOSignIn/SSOSignIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import TwoFactorAuth from "./pages/TwoFactorAuth/TwoFactorAuth";
import AcceptInvite from "./pages/AcceptInvite/AcceptInvite";
import VerifyEmailPage from "./pages/VerifyEmail/VerifyEmailPage";
import CompleteInvitePage from "./pages/CompleteInvite/CompleteInvitePage";
import AppErrorBoundary from "AppErrorBoundary/AppErrorBoundary";

export function App() {
  if (window.bugsnagToken && typeof Bugsnag !== "undefined" && Bugsnag.start) {
    window.bugsnagClient = Bugsnag.start({
      apiKey: window.bugsnagToken,
      appVersion: __BUGSNAG_RELEASE_VERSION__,
      releaseStage: `ng-auth-ui-${window.location.hostname.split(".")[0]}`
    });
  }
  return (
    <RestfulProvider base="/">
      <AppErrorBoundary>
        <Toaster />
        <HashRouter>
          <Switch>
            <Route path={routes.toSignIn()} component={SignIn} />
            <Route path={routes.toLocalLogin()} component={LocalLogin} />
            <Route path={routes.toSignUp()} component={SignUp} />
            <Route
              path={routes.toForgotPassword()}
              component={ForgotPassword}
            />
            <Route path={routes.toResetPassword()} component={ResetPassword} />
            <Route path={routes.toSSOSignIn()} component={SSOSignIn} />
            <Route path={routes.toTwoFactorAuth()} component={TwoFactorAuth} />
            <Route path={routes.toAcceptInvite()} component={AcceptInvite} />
            <Route path="/" exact>
              <Redirect to={routes.toSignIn()} />
            </Route>
            <Route
              path={routes.toEmailVerification()}
              component={VerifyEmailPage}
            />
            <Route
              path={routes.toCompleteInvite()}
              component={CompleteInvitePage}
            />
          </Switch>
        </HashRouter>
      </AppErrorBoundary>
    </RestfulProvider>
  );
}
