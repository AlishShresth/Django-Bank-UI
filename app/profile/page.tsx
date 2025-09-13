'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User,
  Shield,
  Bell,
  Key,
  Smartphone,
  CheckCircle,
  CircleX,
  Plus,
  Trash2,
  Users,
  SquarePen,
  Check,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import type {
  Salutation,
  Gender,
  MaritalStatus,
  IdentificationMeans,
  EmploymentStatus,
  ProfileData,
  Profile,
  NextOfKin,
} from '@/types/profile';
import { useProfileStore } from '@/stores/profile-store';

const generateProfileData = (profile: Profile | null): ProfileData => ({
  title: profile?.title || ('mr' as Salutation),
  first_name: profile?.first_name || '',
  middle_name: profile?.middle_name || '',
  last_name: profile?.last_name || '',
  email: profile?.email || '',
  gender: profile?.gender || ('male' as Gender),
  date_of_birth: profile?.date_of_birth || '',
  country_of_birth: profile?.country_of_birth || '',
  place_of_birth: profile?.place_of_birth || '',
  marital_status: profile?.marital_status || ('single' as MaritalStatus),
  means_of_identification:
    profile?.means_of_identification || ('citizenship' as IdentificationMeans),
  id_issue_date: profile?.id_issue_date || '',
  id_expiry_date: profile?.id_expiry_date || '',
  passport_number: profile?.passport_number || '',
  nationality: profile?.nationality || '',
  phone_number: profile?.phone_number || '',
  address: profile?.address || '',
  city: profile?.city || '',
  country: profile?.country || '',
  employment_status:
    profile?.employment_status || ('employed' as EmploymentStatus),
  employer_name: profile?.employer_name || '',
  annual_income: profile?.annual_income || 0,
  date_of_employment: profile?.date_of_employment || null,
  employer_address: profile?.employer_address || '',
  employer_city: profile?.employer_city || '',
  employer_state: profile?.employer_state || '',
  account_currency: profile?.account_currency || 'nepalese_rupees',
  account_type: profile?.account_type || 'savings',
  next_of_kin: profile?.next_of_kin || ([] as NextOfKin[]),
});

const generateNewNextOfKin = (profile: Profile) => ({
  profile: profile!,
  id: null,
  title: 'mr' as Salutation,
  first_name: '',
  last_name: '',
  other_names: '',
  date_of_birth: '',
  gender: 'male' as Gender,
  relationship: '',
  email_address: '',
  phone_number: '',
  address: '',
  city: '',
  country: '',
  is_primary: false,
});

export default function ProfilePage() {
  const { user } = useAuthStore();
  const {
    profile,
    next_of_kin,
    updateProfile,
    setProfile,
    setNextOfKin,
    getNextOfKin,
    updateNextOfKin,
    deleteNextOfKin,
    next_of_kin_list,
    error,
    setError,
  } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorNotification, setErrorNotification] = useState<string | null>(
    null
  );
  const [profileData, setProfileData] = useState<ProfileData>(
    generateProfileData(profile)
  );
  
  const [isAddingNextOfKin, setIsAddingNextOfKin] = useState(false);
  const [isUpdatingNextOfKin, setIsUpdatingNextOfKin] = useState(false);
  const [newNextOfKin, setNewNextOfKin] = useState<Partial<NextOfKin>>(
    generateNewNextOfKin(profile!)
  );
  
  const [isConfirmingPrimary, setIsConfirmingPrimary] = useState(false);
  const [pendingNextOfKin, setPendingNextOfKin] =
  useState<Partial<NextOfKin> | null>(null);
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: true,
    loginAlerts: true,
    transactionAlerts: true,
  });
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || "profile";

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      setProfile(profileData);
      await updateProfile();
      setNotification('Profile updated successfully');
    } catch (error) {
      setErrorNotification('Failed to update profile');
    } finally {
      setTimeout(() => setNotification(null), 10000);
      setTimeout(() => setErrorNotification(null), 10000);
      setIsLoading(false);
    }
  };

  const proceedWithAddOrUpdateNextOfKin = async (
    kinToAdd: Partial<NextOfKin>
  ) => {
    try {
      if (isUpdatingNextOfKin) {
        await updateNextOfKin(kinToAdd as NextOfKin);
        setNotification('Next of kin updated successfully');
      } else {
        await setNextOfKin(kinToAdd as NextOfKin);
        setNotification('Next of kin added successfully');
      }
    } catch (error) {
      if (isUpdatingNextOfKin) {
        setErrorNotification('Failed to update next of kin');
      } else {
        setErrorNotification('Failed to add next of kin');
      }
    } finally {
      setTimeout(() => setNotification(null), 3000);
      setTimeout(() => setErrorNotification(null), 4000);
      setNewNextOfKin(generateNewNextOfKin(profile!));
      setIsAddingNextOfKin(false);
      setIsUpdatingNextOfKin(false);
      setIsConfirmingPrimary(false);
      setPendingNextOfKin(null);
    }
  };

  const handleConfirmPrimary = async () => {
    if (pendingNextOfKin) {
      await proceedWithAddOrUpdateNextOfKin(pendingNextOfKin);
    }
  };

  const handleAddNextOfKin = async (newNextOfKin: Partial<NextOfKin>) => {
    if (newNextOfKin.is_primary) {
      const primaryKin = next_of_kin_list!.find((kin) => kin.is_primary);
      if (primaryKin && primaryKin.id !== newNextOfKin.id) {
        setPendingNextOfKin(newNextOfKin);
        setIsConfirmingPrimary(true);
        setIsAddingNextOfKin(false); // Close the form dialog
        return;
      }
    }
    await proceedWithAddOrUpdateNextOfKin(newNextOfKin);
  };

  const handleRemoveNextOfKin = async (id: string) => {
    try {
      await deleteNextOfKin(id);
      setNotification('Next of kin removed');
    } catch (err: any) {
      setErrorNotification(err);
    } finally {
      setTimeout(() => setNotification(null), 3000);
      setTimeout(() => setErrorNotification(null), 5000);
    }
  };

  const handleSecurityUpdate = async (setting: string, value: boolean) => {
    setSecuritySettings({ ...securitySettings, [setting]: value });
    setNotification(`${setting} ${value ? 'enabled' : 'disabled'}`);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    setError(null);
    setProfileData(generateProfileData(profile));
  }, [profile]);

  // show instruction if directly redirected to profile after signup
  // useEffect(() => {
  //   if(!user && !profile) return;
    
  //   if ((user && user.last_login == null) || profile?.last_login==null) {
  //     setNotification(
  //       'Welcome to SecureBank. Please update the required profile information, add a primary next of kin then proceed to create a bank account.'
  //     );
  //     setTimeout(() => setNotification(null), 15000);
  //   }
  // }, [user, profile]);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Profile & Security
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and security settings
          </p>
        </div>

        {notification && (
          <Alert className="border-success bg-success/10 my-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              {notification}
            </AlertDescription>
          </Alert>
        )}
        {errorNotification && (
          <Alert className="border-destructive bg-destructive/10 my-2">
            <CircleX className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {errorNotification}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue={currentTab} className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 cursor-pointer"
            >
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="next-of-kin"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Users className="h-4 w-4" />
              Next of Kin
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium" htmlFor="title">
                        Title
                      </label>
                      <Select
                        value={profileData.title}
                        onValueChange={(value: Salutation) =>
                          setProfileData({ ...profileData, title: value })
                        }
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mr">Mr.</SelectItem>
                          <SelectItem value="mrs">Mrs.</SelectItem>
                          <SelectItem value="miss">Miss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="hidden md:block"></div>
                    <div className="hidden lg:block"></div>
                    <FormInput
                      id="first_name"
                      label="First Name"
                      value={profileData.first_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          first_name: e.target.value,
                        })
                      }
                      required
                      error={error?.profile?.first_name}
                    />
                    <FormInput
                      id="middle_name"
                      label="Middle Name"
                      value={profileData.middle_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          middle_name: e.target.value,
                        })
                      }
                    />
                    <FormInput
                      id="last_name"
                      label="Last Name"
                      value={profileData.last_name}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          last_name: e.target.value,
                        })
                      }
                      required
                      error={error?.profile?.last_name}
                    />
                    <FormInput
                      id="date_of_birth"
                      label="Date of Birth"
                      type="date"
                      value={profileData.date_of_birth}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          date_of_birth: e.target.value,
                        })
                      }
                      required
                      error={error?.profile?.date_of_birth}
                    />
                    <div>
                      <label className="text-sm font-medium" htmlFor="gender">
                        Gender<span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={profileData.gender}
                        onValueChange={(value: Gender) =>
                          setProfileData({ ...profileData, gender: value })
                        }
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="hidden lg:block"></div>
                    <FormInput
                      id="nationality"
                      label="Nationality"
                      value={profileData.nationality}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          nationality: e.target.value,
                        })
                      }
                      error={error?.profile?.nationality}
                      required
                    />
                    <FormInput
                      id="country_of_birth"
                      label="Country of Birth"
                      value={profileData.country_of_birth}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          country_of_birth: e.target.value,
                        })
                      }
                      error={error?.profile?.country_of_birth}
                      required
                    />
                    <FormInput
                      id="place_of_birth"
                      label="Place of Birth"
                      value={profileData.place_of_birth}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          place_of_birth: e.target.value,
                        })
                      }
                      error={error?.profile?.place_of_birth}
                      required
                    />
                    <div>
                      <label
                        className="text-sm font-medium"
                        htmlFor="marital_status"
                      >
                        Marital Status
                      </label>
                      <Select
                        value={profileData.marital_status}
                        onValueChange={(value: MaritalStatus) =>
                          setProfileData({
                            ...profileData,
                            marital_status: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="separated">Separated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Identification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="means_of_identification"
                          className="text-sm font-medium"
                        >
                          Means of Identification
                        </label>
                        <Select
                          value={profileData.means_of_identification}
                          onValueChange={(value: IdentificationMeans) =>
                            setProfileData({
                              ...profileData,
                              means_of_identification: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="citizenship">
                              Citizenship
                            </SelectItem>
                            <SelectItem value="drivers_license">
                              Driver's License
                            </SelectItem>
                            <SelectItem value="national_id">
                              National ID
                            </SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormInput
                        label="Identification Number"
                        value={profileData.passport_number}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            passport_number: e.target.value,
                          })
                        }
                        error={error?.profile?.passport_number}
                        required
                      />
                      <div className="hidden lg:block"></div>
                      <FormInput
                        label="ID Issue Date"
                        type="date"
                        value={profileData.id_issue_date}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            id_issue_date: e.target.value,
                          })
                        }
                        error={error?.profile?.id_issue_date}
                        required
                      />
                      <FormInput
                        label="ID Expiry Date"
                        type="date"
                        value={profileData.id_expiry_date}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            id_expiry_date: e.target.value,
                          })
                        }
                        error={error?.profile?.id_expiry_date}
                        required
                      />
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormInput
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        required
                        disabled
                      />
                      <FormInput
                        label="Phone Number"
                        type="tel"
                        value={profileData.phone_number}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone_number: e.target.value,
                          })
                        }
                        error={error?.profile?.phone_number}
                        required
                      />
                      <div className="hidden lg:block"></div>
                      <FormInput
                        label="Address"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                        error={error?.profile?.address}
                        required
                      />
                      <FormInput
                        label="City"
                        value={profileData.city}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            city: e.target.value,
                          })
                        }
                        error={error?.profile?.city}
                        required
                      />
                      <FormInput
                        label="Country"
                        value={profileData.country}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            country: e.target.value,
                          })
                        }
                        error={error?.profile?.country}
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Employment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          Employment Status
                        </label>
                        <Select
                          value={profileData.employment_status}
                          onValueChange={(value: EmploymentStatus) =>
                            setProfileData({
                              ...profileData,
                              employment_status: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employed">Employed</SelectItem>
                            <SelectItem value="self_employed">
                              Self Employed
                            </SelectItem>
                            <SelectItem value="unemployed">
                              Unemployed
                            </SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormInput
                        label="Annual Income"
                        type="number"
                        value={profileData.annual_income.toString()}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            annual_income: Number(e.target.value),
                          })
                        }
                        error={error?.profile?.annual_income}
                      />
                      {(profileData.employment_status === 'employed' ||
                        profileData.employment_status === 'self_employed') && (
                        <>
                          <FormInput
                            label="Employer Name"
                            value={profileData.employer_name}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                employer_name: e.target.value,
                              })
                            }
                            error={error?.profile?.employer_name}
                          />
                          <FormInput
                            label="Date of Employment"
                            type="date"
                            value={profileData.date_of_employment}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                date_of_employment: e.target.value,
                              })
                            }
                            error={error?.profile?.date_of_employment}
                          />
                          <FormInput
                            label="Employer Address"
                            value={profileData.employer_address}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                employer_address: e.target.value,
                              })
                            }
                            error={error?.profile?.employer_address}
                          />
                          <FormInput
                            label="Employer City"
                            value={profileData.employer_city}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                employer_city: e.target.value,
                              })
                            }
                            error={error?.profile?.employer_city}
                          />
                          <FormInput
                            label="Employer State"
                            value={profileData.employer_state}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                employer_state: e.target.value,
                              })
                            }
                            error={error?.profile?.employer_state}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Role: {user.role!.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      Member since: {new Date(user.date_joined).getFullYear()}
                    </Badge>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="next-of-kin">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Next of Kin</CardTitle>
                  <Dialog
                    open={isAddingNextOfKin}
                    onOpenChange={setIsAddingNextOfKin}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setIsUpdatingNextOfKin(false);
                          setNewNextOfKin(generateNewNextOfKin(profile!));
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Next of Kin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {isUpdatingNextOfKin
                            ? 'Update Next of Kin'
                            : 'Add Next of Kin'}
                        </DialogTitle>
                        <DialogDescription>
                          {isUpdatingNextOfKin
                            ? 'Update current next of kin in your profile'
                            : ' Add a new next of kin to your profile'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label
                              className="text-sm font-medium"
                              htmlFor="nok_title"
                            >
                              Title
                            </label>
                            <Select
                              value={newNextOfKin.title}
                              onValueChange={(value: Salutation) =>
                                setNewNextOfKin({
                                  ...newNextOfKin,
                                  title: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mr">Mr.</SelectItem>
                                <SelectItem value="mrs">Mrs.</SelectItem>
                                <SelectItem value="miss">Miss</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="hidden md:block"></div>
                          <div className="hidden lg:block"></div>
                          <FormInput
                            label="First Name"
                            id="nok_first_name"
                            value={newNextOfKin.first_name}
                            onChange={(e) =>
                              setNewNextOfKin({
                                ...newNextOfKin,
                                first_name: e.target.value,
                              })
                            }
                            error={error?.next_of_kin?.first_name || ''}
                            required
                          />
                          <FormInput
                            id="nok_middle_name"
                            label="Middle Name"
                            value={newNextOfKin.other_names}
                            onChange={(e) =>
                              setNewNextOfKin({
                                ...newNextOfKin,
                                other_names: e.target.value,
                              })
                            }
                            error={error?.next_of_kin?.middle_name || ''}
                          />
                          <FormInput
                            id="nok_last_name"
                            label="Last Name"
                            value={newNextOfKin.last_name}
                            onChange={(e) =>
                              setNewNextOfKin({
                                ...newNextOfKin,
                                last_name: e.target.value,
                              })
                            }
                            error={error?.next_of_kin?.last_name || ''}
                            required
                          />
                          <FormInput
                            id="nok_date_of_birth"
                            label="Date of Birth"
                            type="date"
                            value={newNextOfKin.date_of_birth}
                            onChange={(e) =>
                              setNewNextOfKin({
                                ...newNextOfKin,
                                date_of_birth: e.target.value,
                              })
                            }
                            error={error?.next_of_kin?.date_of_birth || ''}
                            className="lg:p-1"
                            required
                          />
                          <div>
                            <label
                              className="text-sm font-medium"
                              htmlFor="nok_gender"
                            >
                              Gender
                            </label>
                            <Select
                              value={newNextOfKin.gender}
                              onValueChange={(value: Gender) =>
                                setNewNextOfKin({
                                  ...newNextOfKin,
                                  gender: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            id="nok_relationship"
                            label="Relationship"
                            value={newNextOfKin.relationship}
                            onChange={(e) =>
                              setNewNextOfKin({
                                ...newNextOfKin,
                                relationship: e.target.value,
                              })
                            }
                            error={error?.next_of_kin?.relationship || ''}
                            placeholder="e.g., Spouse, Parent, Sibling"
                            required
                          />
                          <FormInput
                            id="nok_phone_number"
                            label="Phone Number"
                            type="tel"
                            value={newNextOfKin.phone_number}
                            onChange={(e) =>
                              setNewNextOfKin({
                                ...newNextOfKin,
                                phone_number: e.target.value,
                              })
                            }
                            error={error?.next_of_kin?.phone_number || ''}
                            required
                          />
                        </div>
                        <FormInput
                          id="nok_email_address"
                          label="Email Address"
                          type="email"
                          value={newNextOfKin.email_address}
                          onChange={(e) =>
                            setNewNextOfKin({
                              ...newNextOfKin,
                              email_address: e.target.value,
                            })
                          }
                          error={error?.next_of_kin?.email_address || ''}
                        />
                        <FormInput
                          id="nok_address"
                          label="Address"
                          value={newNextOfKin.address}
                          onChange={(e) =>
                            setNewNextOfKin({
                              ...newNextOfKin,
                              address: e.target.value,
                            })
                          }
                          error={error?.next_of_kin?.address || ''}
                          required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            id="nok_city"
                            label="City"
                            value={newNextOfKin.city}
                            onChange={(e) =>
                              setNewNextOfKin({
                                ...newNextOfKin,
                                city: e.target.value,
                              })
                            }
                            required
                          />
                          <FormInput
                            id="nok_country"
                            label="Country"
                            value={newNextOfKin.country}
                            onChange={(e) =>
                              setNewNextOfKin({
                                ...newNextOfKin,
                                country: e.target.value,
                              })
                            }
                            error={error?.next_of_kin?.country || ''}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="nok_is_primary"
                            checked={newNextOfKin.is_primary}
                            onChange={(e) =>
                              setNewNextOfKin({
                                ...newNextOfKin,
                                is_primary: e.target.checked,
                              })
                            }
                            className="rounded border-gray-300 cursor-pointer"
                          />
                          <label
                            htmlFor="nok_is_primary"
                            className="text-sm font-medium cursor-pointer"
                          >
                            Set as primary next of kin
                          </label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingNextOfKin(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleAddNextOfKin(newNextOfKin)}
                        >
                          {isUpdatingNextOfKin
                            ? 'Update Next of Kin'
                            : 'Add Next of Kin'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {next_of_kin_list?.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No next of kin added yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add your emergency contacts and beneficiaries
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {next_of_kin_list?.map((kin) => (
                      <div key={kin.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {kin.title[0].toUpperCase() +
                                  kin.title.slice(1)}
                                . {kin.first_name} {kin.last_name}
                              </h3>
                              {kin.is_primary && (
                                <Badge variant="default">Primary</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {kin.relationship} • {kin.phone_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {kin.address}, {kin.city}, {kin.country}
                            </p>
                            {kin.email_address && (
                              <p className="text-sm text-muted-foreground">
                                {kin.email_address}
                              </p>
                            )}
                          </div>
                          <div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setNewNextOfKin(kin);
                                setIsUpdatingNextOfKin(true);
                                setIsAddingNextOfKin(true);
                              }}
                              className="text-primary hover:text-primary"
                            >
                              <SquarePen className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveNextOfKin(kin.id!)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Password & Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">
                        Update your account password
                      </p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) =>
                          handleSecurityUpdate('twoFactorEnabled', checked)
                        }
                      />
                      {securitySettings.twoFactorEnabled && (
                        <Smartphone className="h-4 w-4 text-success" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        device: 'Chrome on Windows',
                        location: 'New York, NY',
                        time: '2 hours ago',
                        current: true,
                      },
                      {
                        device: 'Mobile App',
                        location: 'New York, NY',
                        time: '1 day ago',
                        current: false,
                      },
                      {
                        device: 'Safari on macOS',
                        location: 'Boston, MA',
                        time: '3 days ago',
                        current: false,
                      },
                    ].map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {session.device}
                            {session.current && (
                              <Badge variant="outline">Current</Badge>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {session.location} • {session.time}
                          </p>
                        </div>
                        {!session.current && (
                          <Button variant="outline" size="sm">
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSecurityUpdate('emailNotifications', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via text message
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleSecurityUpdate('smsNotifications', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) =>
                      handleSecurityUpdate('loginAlerts', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transaction Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified of account transactions
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.transactionAlerts}
                    onCheckedChange={(checked) =>
                      handleSecurityUpdate('transactionAlerts', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Dialog
          open={isConfirmingPrimary}
          onOpenChange={setIsConfirmingPrimary}
        >
          <DialogContent className="sm:max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-500 mr-2" />
                <DialogTitle className="text-xl font-semibold">
                  Confirm Primary Next of Kin
                </DialogTitle>
              </div>

              <DialogDescription className="mb-6 space-y-3">
                <span>
                  You're about to designate a new primary contact person.
                </span>
                <br />

                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <span className="text-sm font-medium">What this means:</span>
                  <br />
                  <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                    <li>
                      This contact will be prioritized for emergency
                      notifications
                    </li>
                    <li>The previous primary contact will become secondary</li>
                    <li>
                      You can change this at any time in your profile settings
                    </li>
                  </ul>
                </div>

                {pendingNextOfKin && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-blue-100">
                    <span className="font-medium text-blue-600">
                      Selected Contact:
                    </span>
                    <br />
                    <span className="ml-2">
                      {pendingNextOfKin.first_name} {pendingNextOfKin.last_name}
                    </span>
                    <br />
                    <span className=" text-sm ml-2">
                      {pendingNextOfKin.relationship}
                    </span>
                  </div>
                )}
              </DialogDescription>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsConfirmingPrimary(false);
                    setPendingNextOfKin(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>

                <Button variant="default" onClick={handleConfirmPrimary}>
                  <Check className="h-4 w-4" /> Confirm Primary
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
