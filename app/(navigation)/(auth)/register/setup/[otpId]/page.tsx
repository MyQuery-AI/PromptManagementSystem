import { checkOtpValidityAndRedirect } from "@/actions/auth/auth-verifications";
import PasswordSetupForm from "./password-setup-form";

interface PasswordSetupPageProps {
  params: Promise<{
    otpId: string;
  }>;
}

export default async function PasswordSetupPage({
  params,
}: PasswordSetupPageProps) {
  const { otpId } = await params;

  // Validate OTP and redirect if invalid (this will throw if invalid)
  const user = await checkOtpValidityAndRedirect(otpId);

  // If we reach here, the OTP is valid
  return <PasswordSetupForm otpId={otpId} userEmail={user?.email || ""} />;
}
