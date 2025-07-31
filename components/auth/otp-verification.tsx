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
import { verifyOTP, type OtpState } from "@/actions/auth/oauth-actions";
import { useActionState, useState } from "react";
import { Loader2, Mail } from "lucide-react";

interface OtpVerificationProps {
  email: string;
  onBack: () => void;
}

export function OtpVerification({ email, onBack }: OtpVerificationProps) {
  const initialState: OtpState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    verifyOTP,
    initialState
  );
  const [otp, setOtp] = useState("");

  return (
    <Card className="mt-8">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center bg-blue-100 mx-auto mb-4 rounded-full w-12 h-12">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="email" value={email} />

          {state.message && !state.success && (
            <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-600 text-sm">
              {state.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="Enter 6-digit code"
              className="w-full font-mono text-lg text-center tracking-widest"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value);
              }}
              required
              disabled={isPending}
            />
            {state.errors?.otp && (
              <p className="text-red-600 text-sm">{state.errors.otp[0]}</p>
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
                  Verifying...
                </>
              ) : (
                "Verify & Create Account"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onBack}
              disabled={isPending}
            >
              Back to Registration
            </Button>
          </div>

          <div className="text-gray-600 text-sm text-center">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              disabled={isPending}
            >
              Resend code
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
