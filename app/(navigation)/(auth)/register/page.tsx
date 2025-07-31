"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/google-signin";
import { GitHubSignInButton } from "@/components/auth/github-signin";
import {
  sendEmailOTP,
  type EmailRegistrationState,
} from "@/actions/auth/signup-actions";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Loader2, Mail, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const initialState: EmailRegistrationState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    sendEmailOTP,
    initialState
  );

  const [urlMessage, setUrlMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setUrlMessage(message);
      // Clear the message after 10 seconds
      const timer = setTimeout(() => setUrlMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getMessageContent = (messageType: string) => {
    switch (messageType) {
      case "already-confirmed":
        return {
          type: "info" as const,
          icon: CheckCircle,
          title: "Account Already Verified",
          description:
            "Your email is already verified. You can sign in directly.",
        };
      case "otp-expired":
        return {
          type: "warning" as const,
          icon: Clock,
          title: "Verification Code Expired",
          description:
            "Your verification code has expired. Please request a new one.",
        };
      case "invalid-link":
        return {
          type: "error" as const,
          icon: AlertCircle,
          title: "Invalid Verification Link",
          description:
            "The verification link is invalid or has been used. Please try again.",
        };
      default:
        return null;
    }
  };

  const messageContent = urlMessage ? getMessageContent(urlMessage) : null;

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center">
          <h2 className="mt-6 font-extrabold text-gray-900 text-3xl">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            Enter your email to get started
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              We'll send you a verification code to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL Message Display */}
            {messageContent && (
              <div
                className={`px-4 py-3 border rounded-md text-sm ${
                  messageContent.type === "error"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : messageContent.type === "warning"
                    ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
              >
                <div className="flex items-start">
                  <messageContent.icon className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5" />
                  <div>
                    <p className="font-medium">{messageContent.title}</p>
                    <p className="mt-1">{messageContent.description}</p>
                  </div>
                </div>
              </div>
            )}

            {state.success ? (
              <div className="space-y-4">
                <div className="bg-green-50 px-4 py-3 border border-green-200 rounded-md text-green-600 text-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Mail className="mt-0.5 w-5 h-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-green-800">
                        Email sent successfully!
                      </p>
                      <p className="mt-1">{state.message}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 border border-blue-200 rounded-md">
                  <h4 className="mb-2 font-medium text-blue-800">
                    Next steps:
                  </h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li className="flex items-center">
                      <span className="mr-2">📧</span>
                      Check your email inbox (and spam folder)
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🔗</span>
                      Click the verification link in the email
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🔐</span>
                      Complete your registration with your password
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full"
                  >
                    Send Another Email
                  </Button>
                </div>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                {state.message && !state.success && (
                  <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-600 text-sm">
                    {state.message}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full"
                    required
                    disabled={isPending}
                  />
                  {state.errors?.email && (
                    <p className="text-red-600 text-sm">
                      {state.errors.email[0]}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Sending verification code...
                    </>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-gray-600 text-sm text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="border-gray-300 border-t w-full" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="gap-3 grid grid-cols-2 mt-6">
            <GoogleSignInButton />
            <GitHubSignInButton />
          </div>
        </div>
      </div>
    </div>
  );
}
