import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^(\+234|0)[789]\d{9}$/, "Enter a valid Nigerian phone number")
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^(\+234|0)[789]\d{9}$/, "Enter a valid Nigerian phone number")
    .optional()
    .or(z.literal("")),
  bank_name: z.string().optional().or(z.literal("")),
  bank_account_number: z
    .string()
    .regex(/^\d{10}$/, "Account number must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
  bank_account_name: z.string().optional().or(z.literal("")),
});

export const savingsTargetSchema = z.object({
  name: z.string().min(2, "Target name must be at least 2 characters"),
  target_amount: z
    .number({ message: "Enter a valid amount" })
    .positive("Amount must be greater than zero"),
  deadline: z.string().optional().or(z.literal("")),
});

export const withdrawalSchema = z.object({
  amount: z
    .number({ message: "Enter a valid amount" })
    .positive("Amount must be greater than zero")
    .min(1000, "Minimum withdrawal is ₦1,000"),
  bank_name: z.string().min(2, "Bank name is required"),
  bank_account_number: z
    .string()
    .regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
  bank_account_name: z.string().min(2, "Account name is required"),
  reason: z.string().optional().or(z.literal("")),
});

export const balanceUpdateSchema = z.object({
  amount: z
    .number({ message: "Enter a valid amount" })
    .positive("Amount must be greater than zero"),
  description: z.string().optional().or(z.literal("")),
  reference: z.string().optional().or(z.literal("")),
  target_id: z.string().uuid().optional().or(z.literal("")),
});

export const withdrawalReviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  admin_note: z.string().optional().or(z.literal("")),
});

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().min(10, "Message must be at least 10 characters"),
});

export const depositAccountSchema = z.object({
  bank_name: z.string().min(2, "Bank name is required"),
  account_number: z
    .string()
    .regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
  account_name: z.string().min(2, "Account name is required"),
  additional_info: z.string().optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SavingsTargetInput = z.infer<typeof savingsTargetSchema>;
export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
export type BalanceUpdateInput = z.infer<typeof balanceUpdateSchema>;
export type WithdrawalReviewInput = z.infer<typeof withdrawalReviewSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type DepositAccountInput = z.infer<typeof depositAccountSchema>;
