/**
 * Validation schemas using Zod for form validation
 */

export const loginSchema = {
  email: (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Invalid email format";
    return true;
  },
  password: (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return true;
  },
};

export const registerSchema = {
  email: (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Invalid email format";
    return true;
  },
  password: (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return true;
  },
  confirmPassword: (value: string, formData: any) => {
    if (!value) return "Please confirm your password";
    if (value !== formData.password) return "Passwords do not match";
    return true;
  },
  firstName: (value: string) => {
    if (!value) return "First name is required";
    if (value.length < 2) return "First name must be at least 2 characters";
    return true;
  },
  lastName: (value: string) => {
    if (!value) return "Last name is required";
    if (value.length < 2) return "Last name must be at least 2 characters";
    return true;
  },
  username: (value: string) => {
    if (!value) return "Username is required";
    if (value.length < 3) return "Username must be at least 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return "Username can only contain letters, numbers, and underscores";
    return true;
  },
};

export const profileSchema = {
  firstName: (value: string) => {
    if (value && value.length < 2)
      return "First name must be at least 2 characters";
    return true;
  },
  lastName: (value: string) => {
    if (value && value.length < 2)
      return "Last name must be at least 2 characters";
    return true;
  },
  username: (value: string) => {
    if (value && value.length < 3)
      return "Username must be at least 3 characters";
    if (value && !/^[a-zA-Z0-9_]+$/.test(value))
      return "Username can only contain letters, numbers, and underscores";
    return true;
  },
  bio: (value: string) => {
    if (value && value.length > 150)
      return "Bio must be less than 150 characters";
    return true;
  },
};
