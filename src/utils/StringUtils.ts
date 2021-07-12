export const regexEmail = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export enum EMAIL_VERIFY_STATUS {
  SUCCESS = "Email verified successfully!",
  IN_PROGRESS = "Verifying email address",
  FAILED = "Cannot verify Email",
  EMAIL_SENT = "Verify Email Address",
  ALREADY_SIGNED_UP = "Already Signed up"
}
