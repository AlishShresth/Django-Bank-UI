export interface Profile {
  title: Salutation;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email?: string;
  gender: Gender;
  date_of_birth: string;
  country_of_birth: string;
  place_of_birth: string;
  marital_status: MaritalStatus;
  means_of_identification: IdentificationMeans;
  id_issue_date: string;
  id_expiry_date: string;
  passport_number?: string;
  nationality: string;
  phone_number: string;
  address: string;
  city: string;
  country: string;
  employment_status: EmploymentStatus;
  employer_name?: string;
  annual_income: number;
  date_of_employment?: string;
  employer_address?: string;
  employer_city?: string;
  employer_state?: string;
  account_currency?: string;
  account_type?: string;
  photo?: string;
  photo_url?: string;
  id_photo?: string;
  id_photo_url?: string;
  signature_photo?: string;
  signature_photo_url?: string;
  is_complete_with_next_of_kin(): boolean;
  created_at: string;
  next_of_kin?: NextOfKin[];
}

export interface NextOfKin {
  id: string | null;
  profile: Profile;
  title: Salutation;
  first_name: string;
  last_name: string;
  other_names?: string;
  date_of_birth: string;
  gender: Gender;
  relationship: string;
  email_address?: string;
  phone_number: string;
  address: string;
  city: string;
  country: string;
  is_primary: boolean;
}

export type Salutation = 'mr' | 'mrs' | 'miss';

export type Gender = 'male' | 'female' | 'other';

export type MaritalStatus =
  | 'married'
  | 'single'
  | 'divorced'
  | 'widowed'
  | 'separated'
  | 'unknown';

export type IdentificationMeans =
  | 'drivers_license'
  | 'national_id'
  | 'passport'
  | 'citizenship';

export type EmploymentStatus =
  | 'self_employed'
  | 'employed'
  | 'unemployed'
  | 'retired'
  | 'student';

export interface ProfileState {
  profile: Profile | null;
  next_of_kin_list: NextOfKin[] | null;
  next_of_kin: NextOfKin | null;
  isLoading: boolean;
  error: Record<string, any> | null;
}

export interface ProfileData  {
  title: Salutation;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  gender: Gender;
  date_of_birth: string;
  country_of_birth: string;
  place_of_birth: string;
  marital_status: MaritalStatus;
  means_of_identification: IdentificationMeans;
  id_issue_date: string;
  id_expiry_date: string;
  passport_number?: string;
  nationality: string;
  phone_number: string;
  address: string;
  city: string;
  country: string;
  employment_status: EmploymentStatus;
  employer_name?: string;
  annual_income: number;
  date_of_employment?: string;
  employer_address?: string;
  employer_city?: string;
  employer_state?: string;
  account_currency: string;
  account_type: string;
  next_of_kin?: NextOfKin[];
};