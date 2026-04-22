export type AuthMode = "login" | "signup";

export interface AuthFormValues {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8)
    return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
    return "Password must contain at least one special character.";
  return null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required.";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";
  return null;
}
