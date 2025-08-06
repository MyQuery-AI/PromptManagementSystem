"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleSignInButton } from "@/components/auth/google-signin";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

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
          <p className="mt-2 text-gray-600 text-sm">
            Sign in with your Google account
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader className="text-center">
            <CardTitle>Sign in with Google</CardTitle>
            <CardDescription>
              Use your Google account to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* Google Sign In */}
            <div className="w-full">
              <GoogleSignInButton />
            </div>
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
      </div>
    </div>
  );
}
