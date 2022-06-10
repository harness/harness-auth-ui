/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

export enum EVENT {
  SIGNUP_SUBMIT = "Signup submitted",
  SIGNIN_SUBMIT = "Signin submitted",
  EMAIL_INPUT = "Email inputted",
  RESEND_VERIFY_EMAIL = "Verify email resent",
  OAUTH_CLICKED = "Oauth clicked"
}

export enum CATEGORY {
  SIGNUP = "Signup",
  SIGNIN = "Signin"
}

export enum PAGE {
  SIGNUP_PAGE = "Signup"
}
