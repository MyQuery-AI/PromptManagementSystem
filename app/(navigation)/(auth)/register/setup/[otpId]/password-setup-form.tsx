"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordStrength } from "@/components/auth/password-strength";

import { useActionState, useState } from "react";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  PasswordSetupState,
  setupPassword,
  ResendOTPState,
  resendOTP,
} from "@/actions/auth/signup-actions";

interface PasswordSetupFormProps {
  otpId: string;
  userEmail: string;
}

export default function PasswordSetupForm({
  otpId,
  userEmail,
}: PasswordSetupFormProps) {
  const initialState: PasswordSetupState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    setupPassword,
    initialState
  );

  const initialResendState: ResendOTPState = {
    success: false,
    message: "",
  };

  const [resendState, resendAction, isResending] = useActionState(
    resendOTP,
    initialResendState
  );

  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center items-center bg-blue-100 mx-auto mb-4 rounded-full w-12 h-12">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="mt-6 font-extrabold text-gray-900 text-3xl">
            Complete Your Registration
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            Enter the verification code sent to <strong>{userEmail}</strong>
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Verify & Set Password</CardTitle>
            <CardDescription>
              Enter your verification code and create a secure password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="otpId" value={otpId} />

              {state.message && !state.success && (
                <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-600 text-sm">
                  {state.message}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full font-mono text-lg text-center tracking-widest"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  disabled={isPending}
                />
                {state.errors?.otp && (
                  <p className="text-red-600 text-sm">{state.errors.otp[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full"
                  required
                  disabled={isPending}
                />
                {state.errors?.name && (
                  <p className="text-red-600 text-sm">{state.errors.name[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isPending}
                />
                {state.errors?.password && (
                  <p className="text-red-600 text-sm">
                    {state.errors.password[0]}
                  </p>
                )}
                <PasswordStrength password={password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full"
                  required
                  disabled={isPending}
                />
                {state.errors?.confirmPassword && (
                  <p className="text-red-600 text-sm">
                    {state.errors.confirmPassword[0]}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPending || otp.length !== 6}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                  disabled={isPending}
                >
                  <Link href="/register">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to email entry
                  </Link>
                </Button>
              </div>
            </form>

            <div className="text-gray-600 text-sm text-center">
              {resendState.message && (
                <div
                  className={`mb-3 px-3 py-2 rounded-md text-sm ${
                    resendState.success
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {resendState.message}
                </div>
              )}
              Didn't receive the code?{" "}
              <form action={resendAction} className="inline">
                <input type="hidden" name="otpId" value={otpId} />
                <button
                  type="submit"
                  className="disabled:opacity-50 font-medium text-blue-600 hover:text-blue-500"
                  disabled={isPending || isResending}
                >
                  {isResending ? "Sending..." : "Resend code"}
                </button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
