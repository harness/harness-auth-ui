import { regexEmail } from "utils/StringUtils";

export function validateEmail(email: string): string | undefined {
  if (!email) {
    return "An email is required";
  }

  if (!regexEmail.test(email)) {
    return "This email is not valid";
  }
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return "A password is required";
  }

  if (password.length < 8 || password.length > 64) {
    return "The password must be between 8 and 64 characters long";
  }
}
