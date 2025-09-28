/**
 * Reusable form components with React Hook Form integration
 */

import React from "react";
import { useForm, UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./spinner";

interface FormProps<T extends FieldValues> {
  onSubmit: (data: T) => void | Promise<void>;
  children: (form: UseFormReturn<T>) => React.ReactNode;
  className?: string;
  defaultValues?: Partial<T>;
  validationSchema?: any;
}

export function Form<T extends FieldValues>({
  onSubmit,
  children,
  className,
  defaultValues,
  validationSchema,
}: FormProps<T>) {
  const form = useForm<T>({
    defaultValues,
    mode: "onChange", // Validate on change for better UX
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  });

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      {children(form)}
    </form>
  );
}

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  type?: "text" | "email" | "password" | "textarea";
  placeholder?: string;
  className?: string;
  validation?: (value: any, formData?: T) => string | true;
  showPasswordToggle?: boolean;
  disabled?: boolean;
}

export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  type = "text",
  placeholder,
  className,
  validation,
  showPasswordToggle = false,
  disabled = false,
}: FormFieldProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    formState: { errors },
  } = form;

  const fieldError = errors[name];
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const validate = (value: any) => {
    if (validation) {
      return validation(value, form.getValues());
    }
    return true;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            {...register(name, { validate })}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500",
              fieldError &&
                "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            rows={4}
          />
        ) : (
          <input
            {...register(name, { validate })}
            type={inputType}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:bg-gray-50 disabled:text-gray-500",
              fieldError &&
                "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
          />
        )}
        {showPasswordToggle && isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {fieldError && (
        <p className="text-sm text-red-600">{fieldError.message as string}</p>
      )}
    </div>
  );
}

interface FormButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function FormButton({
  isLoading = false,
  children,
  className,
  disabled = false,
  type = "submit",
  onClick,
}: FormButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn("w-full", className)}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <LoadingSpinner type="simple" size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
