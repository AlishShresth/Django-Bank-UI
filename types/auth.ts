export interface User {
  id: string;
  username?: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  role: UserRole | null;
  id_no: number;
  security_question?: SecurityQuestions;
  security_answer?: string;
  account_status?: AccountStatus;
  failed_login_attempts?: number;
  last_failed_login?: string;
  otp?: string;
  otp_expiry_time?: string;
  full_name?: string;
  is_locked_out?: boolean;
  has_role(roleName: string): boolean;
}

export interface AuthState {
  user: User | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  re_password: string;
  id_no: number;
  first_name: string;
  last_name: string;
  security_question: string;
  security_answer: string;
}

export interface LoginResponse {
  success?: string;
  email?: string;
  error?: string;
}

export type UserRole =
  | 'customer'
  | 'business_client'
  | 'account_executive'
  | 'teller'
  | 'branch_manager';

export type AccountStatus = 'active' | 'locked';

export type SecurityQuestions =
  | 'maiden_name'
  | 'favorite_color'
  | 'birth_city'
  | 'childhood_friend';

export interface OTP {
  otp: string
}