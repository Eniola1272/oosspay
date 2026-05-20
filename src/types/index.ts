export type UserRole = "user" | "admin" | "super_admin";

export type TransactionType = "deposit" | "withdrawal";
export type TransactionStatus = "pending" | "completed" | "failed";

export type WithdrawalStatus =
  | "pending"
  | "approved"
  | "processing"
  | "completed"
  | "rejected";

export type SavingsTargetStatus = "active" | "completed" | "cancelled";

export type NotificationType = "info" | "deposit" | "withdrawal" | "announcement" | "target";

// ─── Database Row Types ───────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  role: UserRole;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  reference: string | null;
  receipt_url: string | null;
  deposit_request_date: string | null;
  admin_note: string | null;
  status: TransactionStatus;
  recorded_by: string | null;
  created_at: string;
}

export interface SavingsTarget {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  status: SavingsTargetStatus;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  reason: string | null;
  status: WithdrawalStatus;
  admin_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  // Savings cycle penalty fields
  is_penalized: boolean;
  penalty_rate: number;
  penalty_amount: number;
  payout_amount: number | null; // null means full amount is paid out
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface PlatformSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_by: string | null;
  updated_at: string;
}

// ─── Supabase Database Type Map ───────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & Partial<Pick<Profile, "created_at" | "updated_at">>;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
        Relationships: [];
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "created_at"> & Partial<Pick<Transaction, "id" | "created_at">>;
        Update: Partial<Omit<Transaction, "id" | "created_at">>;
        Relationships: [];
      };
      savings_targets: {
        Row: SavingsTarget;
        Insert: Omit<SavingsTarget, "id" | "current_amount" | "created_at" | "updated_at"> &
          Partial<Pick<SavingsTarget, "id" | "current_amount" | "created_at" | "updated_at">>;
        Update: Partial<Omit<SavingsTarget, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      withdrawal_requests: {
        Row: WithdrawalRequest;
        Insert: Omit<WithdrawalRequest, "id" | "status" | "admin_note" | "reviewed_by" | "reviewed_at" | "created_at"> &
          Partial<Pick<WithdrawalRequest, "id" | "status" | "admin_note" | "reviewed_by" | "reviewed_at" | "created_at">>;
        Update: Partial<Omit<WithdrawalRequest, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
      notifications: {
        Row: AppNotification;
        Insert: Omit<AppNotification, "id" | "is_read" | "created_at"> &
          Partial<Pick<AppNotification, "id" | "is_read" | "created_at">>;
        Update: Partial<Pick<AppNotification, "is_read">>;
        Relationships: [];
      };
      platform_settings: {
        Row: PlatformSetting;
        Insert: Omit<PlatformSetting, "id" | "updated_at"> & Partial<Pick<PlatformSetting, "id" | "updated_at">>;
        Update: Partial<Omit<PlatformSetting, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_balance: {
        Args: { p_user_id: string };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// ─── Utility / UI Types ───────────────────────────────────────────────────────

export interface DepositAccountDetails {
  bank_name: string;
  account_number: string;
  account_name: string;
  additional_info?: string;
}

export interface Announcement {
  title: string;
  body: string;
  created_at: string;
}

// For admin balance update form
export interface BalanceUpdatePayload {
  user_id: string;
  amount: number;
  description?: string;
  reference?: string;
  target_id?: string;
}
