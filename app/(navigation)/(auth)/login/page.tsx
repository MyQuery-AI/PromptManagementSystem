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
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { LoginState, loginUser } from "@/actions/auth/login-actions";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const initialState: LoginState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );

  const [urlMessage, setUrlMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message === "already-confirmed") {
      setUrlMessage(message);
      // Clear the message after 10 seconds
      const timer = setTimeout(() => setUrlMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center">
          <h2 className="mt-6 font-extrabold text-gray-900 text-3xl">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600 text-sm">Sign in to your account</p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL Message Display */}
            {urlMessage === "already-confirmed" && (
              <div className="bg-green-50 px-4 py-3 border border-green-200 rounded-md text-green-700 text-sm">
                <div className="flex items-start">
                  <CheckCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5" />
                  <div>
                    <p className="font-medium">Account Already Verified</p>
                    <p className="mt-1">
                      Your email is already verified. Please sign in below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              {state.message && !state.success && (
                <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-600 text-sm">
                  {state.message}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full"
                  required
                  disabled={isPending}
                />
                {state.errors?.password && (
                  <p className="text-red-600 text-sm">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
              <div className="flex justify-end items-center">
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
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
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-gray-600 text-sm text-center">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
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
