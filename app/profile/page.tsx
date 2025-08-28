"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/ui/form-input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, Shield, Bell, Key, Smartphone, CheckCircle, Plus, Trash2, Users } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import type { Salutation, Gender, MaritalStatus, IdentificationMeans, EmploymentStatus } from "@/types/profile"
import { useProfileStore } from "@/stores/profile-store"
import { apiClient } from "@/lib/axios"

interface NextOfKinData {
  id: string
  title: Salutation
  first_name: string
  last_name: string
  other_names?: string
  date_of_birth: string
  gender: Gender
  relationship: string
  email_address?: string
  phone_number: string
  address: string
  city: string
  country: string
  is_primary: boolean
}

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { profile, next_of_kin, getProfile } = useProfileStore()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const [profileData, setProfileData] = useState({
    title: profile?.title || "mr" as Salutation,
    firstName: user?.first_name || "",
    middleName: user?.middle_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    gender: profile?.gender || "male" as Gender,
    date_of_birth: profile?.date_of_birth || "",
    country_of_birth: profile?.country_of_birth || "",
    place_of_birth: profile?.place_of_birth || "",
    marital_status: profile?.marital_status || "single" as MaritalStatus,
    means_of_identification: profile?.means_of_identification || "citizenship" as IdentificationMeans,
    id_issue_date: profile?.id_issue_date || "",
    id_expiry_date: profile?.id_expiry_date || "",
    passport_number: profile?.passport_number || "",
    nationality: profile?.nationality || "",
    phone_number: profile?.phone_number || "",
    address: profile?.address || "",
    city: profile?.city || "",
    country: profile?.country || "",
    employment_status: profile?.employment_status || "employed" as EmploymentStatus,
    employer_name: profile?.employer_name || "",
    annual_income: profile?.annual_income || 0,
    date_of_employment: profile?.date_of_employment || "",
    employer_address: profile?.employer_address || "",
    employer_city: profile?.employer_city || "",
    employer_state: profile?.employer_state || "",
    account_currency: profile?.account_currency || "nepalese_rupees",
    account_type: profile?.account_type || "savings",
  })

  const [nextOfKinList, setNextOfKinList] = useState<NextOfKinData[]>([])
  const [isAddingNextOfKin, setIsAddingNextOfKin] = useState(false)
  const [newNextOfKin, setNewNextOfKin] = useState<Omit<NextOfKinData, "id">>({
    title: "mr",
    first_name: "",
    last_name: "",
    other_names: "",
    date_of_birth: "",
    gender: "male",
    relationship: "",
    email_address: "",
    phone_number: "",
    address: "",
    city: "",
    country: "",
    is_primary: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: true,
    loginAlerts: true,
    transactionAlerts: true,
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setNotification("Profile updated successfully")
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      setNotification("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNextOfKin = () => {
    const id = Date.now().toString()
    setNextOfKinList([...nextOfKinList, { ...newNextOfKin, id }])
    setNewNextOfKin({
      title: "mr",
      first_name: "",
      last_name: "",
      other_names: "",
      date_of_birth: "",
      gender: "male",
      relationship: "",
      email_address: "",
      phone_number: "",
      address: "",
      city: "",
      country: "",
      is_primary: false,
    })
    setIsAddingNextOfKin(false)
    setNotification("Next of kin added successfully")
    setTimeout(() => setNotification(null), 3000)
  }

  const handleRemoveNextOfKin = (id: string) => {
    setNextOfKinList(nextOfKinList.filter((kin) => kin.id !== id))
    setNotification("Next of kin removed")
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSecurityUpdate = async (setting: string, value: boolean) => {
    setSecuritySettings({ ...securitySettings, [setting]: value })
    setNotification(`${setting} ${value ? "enabled" : "disabled"}`)
    setTimeout(() => setNotification(null), 3000)
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  useEffect(() => {
    setProfileData({
      title: profile?.title || "mr" as Salutation,
      firstName: user?.first_name || "",
      middleName: user?.middle_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      gender: profile?.gender || "male" as Gender,
      date_of_birth: profile?.date_of_birth || "",
      country_of_birth: profile?.country_of_birth || "",
      place_of_birth: profile?.place_of_birth || "",
      marital_status: profile?.marital_status || "single" as MaritalStatus,
      means_of_identification: profile?.means_of_identification || "citizenship" as IdentificationMeans,
      id_issue_date: profile?.id_issue_date || "",
      id_expiry_date: profile?.id_expiry_date || "",
      passport_number: profile?.passport_number || "",
      nationality: profile?.nationality || "",
      phone_number: profile?.phone_number || "",
      address: profile?.address || "",
      city: profile?.city || "",
      country: profile?.country || "",
      employment_status: profile?.employment_status || "employed" as EmploymentStatus,
      employer_name: profile?.employer_name || "",
      annual_income: profile?.annual_income || 0,
      date_of_employment: profile?.date_of_employment || "",
      employer_address: profile?.employer_address || "",
      employer_city: profile?.employer_city || "",
      employer_state: profile?.employer_state || "",
      account_currency: profile?.account_currency || "nepalese_rupees",
      account_type: profile?.account_type || "savings"
    })
  }, [profile])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile & Security</h1>
          <p className="text-muted-foreground">Manage your account information and security settings</p>
        </div>

        {notification && (
          <Alert className="border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">{notification}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="next-of-kin" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Next of Kin
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
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
                      <label className="text-sm font-medium">Title</label>
                      <Select
                        value={profileData.title}
                        onValueChange={(value: Salutation) => setProfileData({ ...profileData, title: value })}
                      >
                        <SelectTrigger className="w-full">
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
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Middle Name"
                      value={profileData.middleName}
                      onChange={(e) => setProfileData({ ...profileData, middleName: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Last Name"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Date of Birth"
                      type="date"
                      value={profileData.date_of_birth}
                      onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
                      required
                    />
                    <div>
                      <label className="text-sm font-medium">Gender</label>
                      <Select
                        value={profileData.gender}
                        onValueChange={(value: Gender) => setProfileData({ ...profileData, gender: value })}
                      >
                        <SelectTrigger className="w-full">
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
                      label="Nationality"
                      value={profileData.nationality}
                      onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Country of Birth"
                      value={profileData.country_of_birth}
                      onChange={(e) => setProfileData({ ...profileData, country_of_birth: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Place of Birth"
                      value={profileData.place_of_birth}
                      onChange={(e) => setProfileData({ ...profileData, place_of_birth: e.target.value })}
                      required
                    />
                    <div>
                      <label className="text-sm font-medium">Marital Status</label>
                      <Select
                        value={profileData.marital_status}
                        onValueChange={(value: MaritalStatus) =>
                          setProfileData({ ...profileData, marital_status: value })
                        }
                      >
                        <SelectTrigger className="w-full">
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
                    <h3 className="text-lg font-semibold mb-4">Identification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Means of Identification</label>
                        <Select
                          value={profileData.means_of_identification}
                          onValueChange={(value: IdentificationMeans) =>
                            setProfileData({ ...profileData, means_of_identification: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="citizenship">Citizenship</SelectItem>
                            <SelectItem value="drivers_license">Driver's License</SelectItem>
                            <SelectItem value="national_id">National ID</SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormInput
                        label="Identification Number"
                        value={profileData.passport_number}
                        onChange={(e) => setProfileData({ ...profileData, passport_number: e.target.value })}
                      />
                      <div className="hidden lg:block"></div>
                      <FormInput
                        label="ID Issue Date"
                        type="date"
                        value={profileData.id_issue_date}
                        onChange={(e) => setProfileData({ ...profileData, id_issue_date: e.target.value })}
                        required
                      />
                      <FormInput
                        label="ID Expiry Date"
                        type="date"
                        value={profileData.id_expiry_date}
                        onChange={(e) => setProfileData({ ...profileData, id_expiry_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormInput
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                      />
                      <FormInput
                        label="Phone Number"
                        type="tel"
                        value={profileData.phone_number}
                        onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                        required
                      />
                      <div className="hidden lg:block"></div>
                      <FormInput
                        label="Address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        required
                      />
                      <FormInput
                        label="City"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        required
                      />
                      <FormInput
                        label="Country"
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Employment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Employment Status</label>
                        <Select
                          value={profileData.employment_status}
                          onValueChange={(value: EmploymentStatus) =>
                            setProfileData({ ...profileData, employment_status: value })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employed">Employed</SelectItem>
                            <SelectItem value="self_employed">Self Employed</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormInput
                        label="Annual Income"
                        type="number"
                        value={profileData.annual_income.toString()}
                        onChange={(e) => setProfileData({ ...profileData, annual_income: Number(e.target.value) })}
                      />
                      {(profileData.employment_status === "employed" ||
                        profileData.employment_status === "self_employed") && (
                          <>
                            <FormInput
                              label="Employer Name"
                              value={profileData.employer_name}
                              onChange={(e) => setProfileData({ ...profileData, employer_name: e.target.value })}
                            />
                            <FormInput
                              label="Date of Employment"
                              type="date"
                              value={profileData.date_of_employment}
                              onChange={(e) => setProfileData({ ...profileData, date_of_employment: e.target.value })}
                            />
                            <FormInput
                              label="Employer Address"
                              value={profileData.employer_address}
                              onChange={(e) => setProfileData({ ...profileData, employer_address: e.target.value })}
                            />
                            <FormInput
                              label="Employer City"
                              value={profileData.employer_city}
                              onChange={(e) => setProfileData({ ...profileData, employer_city: e.target.value })}
                            />
                            <FormInput
                              label="Employer State"
                              value={profileData.employer_state}
                              onChange={(e) => setProfileData({ ...profileData, employer_state: e.target.value })}
                            />
                          </>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Role: {user.role!.replace("_", " ")}</Badge>
                    <Badge variant="outline">Member since: {new Date(user.date_joined).getFullYear()}</Badge>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Profile"}
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
                  <Dialog open={isAddingNextOfKin} onOpenChange={setIsAddingNextOfKin}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Next of Kin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Next of Kin</DialogTitle>
                        <DialogDescription>Add a new next of kin to your profile</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Select
                              value={newNextOfKin.title}
                              onValueChange={(value: Salutation) => setNewNextOfKin({ ...newNextOfKin, title: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mr">Mr.</SelectItem>
                                <SelectItem value="mrs">Mrs.</SelectItem>
                                <SelectItem value="miss">Miss</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormInput
                            label="First Name"
                            value={newNextOfKin.first_name}
                            onChange={(e) => setNewNextOfKin({ ...newNextOfKin, first_name: e.target.value })}
                            required
                          />
                          <FormInput
                            label="Last Name"
                            value={newNextOfKin.last_name}
                            onChange={(e) => setNewNextOfKin({ ...newNextOfKin, last_name: e.target.value })}
                            required
                          />
                        </div>
                        <FormInput
                          label="Other Names (Optional)"
                          value={newNextOfKin.other_names}
                          onChange={(e) => setNewNextOfKin({ ...newNextOfKin, other_names: e.target.value })}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            label="Date of Birth"
                            type="date"
                            value={newNextOfKin.date_of_birth}
                            onChange={(e) => setNewNextOfKin({ ...newNextOfKin, date_of_birth: e.target.value })}
                            required
                          />
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Gender</label>
                            <Select
                              value={newNextOfKin.gender}
                              onValueChange={(value: Gender) => setNewNextOfKin({ ...newNextOfKin, gender: value })}
                            >
                              <SelectTrigger>
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
                            label="Relationship"
                            value={newNextOfKin.relationship}
                            onChange={(e) => setNewNextOfKin({ ...newNextOfKin, relationship: e.target.value })}
                            placeholder="e.g., Spouse, Parent, Sibling"
                            required
                          />
                          <FormInput
                            label="Phone Number"
                            type="tel"
                            value={newNextOfKin.phone_number}
                            onChange={(e) => setNewNextOfKin({ ...newNextOfKin, phone_number: e.target.value })}
                            required
                          />
                        </div>
                        <FormInput
                          label="Email Address (Optional)"
                          type="email"
                          value={newNextOfKin.email_address}
                          onChange={(e) => setNewNextOfKin({ ...newNextOfKin, email_address: e.target.value })}
                        />
                        <FormInput
                          label="Address"
                          value={newNextOfKin.address}
                          onChange={(e) => setNewNextOfKin({ ...newNextOfKin, address: e.target.value })}
                          required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormInput
                            label="City"
                            value={newNextOfKin.city}
                            onChange={(e) => setNewNextOfKin({ ...newNextOfKin, city: e.target.value })}
                            required
                          />
                          <FormInput
                            label="Country"
                            value={newNextOfKin.country}
                            onChange={(e) => setNewNextOfKin({ ...newNextOfKin, country: e.target.value })}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_primary"
                            checked={newNextOfKin.is_primary}
                            onChange={(e) => setNewNextOfKin({ ...newNextOfKin, is_primary: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="is_primary" className="text-sm font-medium">
                            Set as primary next of kin
                          </label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingNextOfKin(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddNextOfKin}>Add Next of Kin</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {nextOfKinList.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No next of kin added yet</p>
                    <p className="text-sm text-muted-foreground">Add your emergency contacts and beneficiaries</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {nextOfKinList.map((kin) => (
                      <div key={kin.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {kin.title}. {kin.first_name} {kin.last_name}
                              </h3>
                              {kin.is_primary && <Badge variant="default">Primary</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {kin.relationship} • {kin.phone_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {kin.address}, {kin.city}, {kin.country}
                            </p>
                            {kin.email_address && <p className="text-sm text-muted-foreground">{kin.email_address}</p>}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveNextOfKin(kin.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) => handleSecurityUpdate("twoFactorEnabled", checked)}
                      />
                      {securitySettings.twoFactorEnabled && <Smartphone className="h-4 w-4 text-success" />}
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
                      { device: "Chrome on Windows", location: "New York, NY", time: "2 hours ago", current: true },
                      { device: "Mobile App", location: "New York, NY", time: "1 day ago", current: false },
                      { device: "Safari on macOS", location: "Boston, MA", time: "3 days ago", current: false },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {session.device}
                            {session.current && <Badge variant="outline">Current</Badge>}
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
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={securitySettings.emailNotifications}
                    onCheckedChange={(checked) => handleSecurityUpdate("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                  </div>
                  <Switch
                    checked={securitySettings.smsNotifications}
                    onCheckedChange={(checked) => handleSecurityUpdate("smsNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) => handleSecurityUpdate("loginAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transaction Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of account transactions</p>
                  </div>
                  <Switch
                    checked={securitySettings.transactionAlerts}
                    onCheckedChange={(checked) => handleSecurityUpdate("transactionAlerts", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
