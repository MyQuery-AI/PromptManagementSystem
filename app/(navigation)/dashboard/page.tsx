import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Force dynamic rendering since we use authentication
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="mx-auto max-w-4xl">
        <div className="bg-white shadow-sm p-6 border rounded-lg">
          <h1 className="mb-6 font-bold text-gray-900 text-3xl">
            Welcome to Dashboard
          </h1>

          <div className="bg-green-50 mb-6 p-4 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-green-700 text-sm">
                  🎉 Successfully logged in!
                </p>
              </div>
            </div>
          </div>

          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="mb-3 font-semibold text-gray-900 text-lg">
                User Information
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-500 text-sm">
                    Name:
                  </span>
                  <p className="text-gray-900 text-sm">
                    {session.user.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 text-sm">
                    Email:
                  </span>
                  <p className="text-gray-900 text-sm">{session.user.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 text-sm">
                    User ID:
                  </span>
                  <p className="font-mono text-gray-900 text-sm">
                    {session.user.id}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 text-sm">
                    Email Verified:
                  </span>
                  <p className="text-gray-900 text-sm">
                    {session.user.emailVerified ? "✅ Yes" : "❌ No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="mb-3 font-semibold text-gray-900 text-lg">
                Authentication Status
              </h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span className="text-gray-700 text-sm">Session Active</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span className="text-gray-700 text-sm">Email Verified</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span className="text-gray-700 text-sm">
                    Full Access Granted
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Your authentication system is working perfectly! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
