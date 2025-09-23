'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Eye, EyeOff, Mail, CheckCircle } from 'lucide-react';
import type { SecurityQuestions } from '@/types/auth';
import { security_questions } from '@/lib/security_questions';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    re_password: '',
    first_name: '',
    last_name: '',
    security_question: 'birth_city' as SecurityQuestions,
    security_answer: '',
    id_no: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { register, isLoading, resendActivation } = useAuthStore();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.id_no) {
      newErrors.id_no = 'ID Number is required';
    } else if (formData.id_no <= 0) {
      newErrors.id_no = 'ID Number must be a valid positive number';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.security_question) {
      newErrors.security_question = 'Security Question is required';
    } else if (
      ![
        'birth_city',
        'maiden_name',
        'favorite_color',
        'childhood_friend',
      ].includes(formData.security_question)
    ) {
      newErrors.security_question = 'Select a valid security question';
    }

    if (!formData.security_answer.trim()) {
      newErrors.security_answer = 'Security Answer is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.re_password) {
      newErrors.re_password = 'Please confirm your password';
    } else if (formData.password !== formData.re_password) {
      newErrors.re_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('form submit');
    if (!validateForm()) return;

    try {
      await register({
        email: formData.email,
        password: formData.password,
        re_password: formData.re_password,
        id_no: formData.id_no as number,
        first_name: formData.first_name,
        last_name: formData.last_name,
        security_question: formData.security_question,
        security_answer: formData.security_answer,
      });
      setRegistrationSuccess(true);
    } catch (error: any) {
      setErrors({
        general:
          error.response?.data?.error ||
          'Registration failed. Please try again.',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-gray-600">
                We've sent an activation link to your email address
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium">{formData.email}</span>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800">
                    <strong>
                      You're receiving this email because you need to finish
                      activation process on SecureBank.
                    </strong>
                    <br />
                    <br />
                    Please go to the activation link in your email to activate
                    your account.
                    <br />
                    <br />
                    Thanks for using our site!
                    <br />
                    The SecureBank team
                  </AlertDescription>
                </Alert>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Didn't receive the email? Check your spam folder or
                </p>
                <Button
                  variant="ghost"
                  onClick={() => resendActivation}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Resend Activation Email
                </Button>
                <div className="pt-4">
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full lg:max-w-lg max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SecureBank</h1>
          <p className="text-gray-600 mt-2">
            Join thousands of satisfied customers
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              Create your account
            </CardTitle>
            <CardDescription className="text-center">
              Get started with secure banking today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  id="first_name"
                  label="First Name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange('first_name', e.target.value)
                  }
                  error={errors.first_name}
                  placeholder="John"
                  autoComplete="given-name"
                  required
                />
                <FormInput
                  id="last_name"
                  label="Last Name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange('last_name', e.target.value)
                  }
                  error={errors.last_name}
                  placeholder="Doe"
                  autoComplete="family-name"
                  required
                />
                <FormInput
                  id="id_no"
                  label="ID Number"
                  type="number"
                  min="0"
                  value={formData.id_no as number}
                  onChange={(e) => handleInputChange('id_no', e.target.value)}
                  error={errors.id_no}
                  placeholder="7583734"
                  autoComplete="id_no"
                  required
                />
              </div>

              <FormInput
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="john.doe@example.com"
                autoComplete="email"
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Security Question <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.security_question}
                  onValueChange={(value: SecurityQuestions) =>
                    handleInputChange('security_question', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Security Question" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(security_questions).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                    {/* <SelectItem value="birth_city">
                      What is the city where you were born?
                    </SelectItem>
                    <SelectItem value="maiden_name">
                      What is your mother's maiden name?
                    </SelectItem>
                    <SelectItem value="favorite_color">
                      What is your favorite color?
                    </SelectItem>
                    <SelectItem value="childhood_friend">
                      What is the name of your childhood best friend?
                    </SelectItem> */}
                  </SelectContent>
                </Select>
                {errors.security_question && (
                  <span>{errors.security_question}</span>
                )}
              </div>

              <FormInput
                id="security_answer"
                label="Security answer"
                type="text"
                value={formData.security_answer}
                onChange={(e) =>
                  handleInputChange('security_answer', e.target.value)
                }
                error={errors.security_answer}
                placeholder="Kathmandu"
                required
              />

              <div className="relative">
                <FormInput
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  error={errors.password}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <FormInput
                  id="re_password"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.re_password}
                  onChange={(e) =>
                    handleInputChange('re_password', e.target.value)
                  }
                  error={errors.re_password}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Your data is protected by bank-level security
          </p>
        </div>
      </div>
    </div>
  );
}
