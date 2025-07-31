import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol");

export const emailRegistrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const passwordSetupSchema = z
  .object({
    otpId: z.string(),
    otp: z
      .string()
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d+$/, "OTP must contain only numbers"),
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.string().refine((val) => val === "on", {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const otpVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.string().optional(),
});

export type EmailRegistrationData = z.infer<typeof emailRegistrationSchema>;
export type PasswordSetupData = z.infer<typeof passwordSetupSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpVerificationData = z.infer<typeof otpVerificationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
