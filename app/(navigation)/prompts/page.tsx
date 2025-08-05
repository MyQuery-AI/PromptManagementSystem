import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptStatsCards, PromptsContainer } from "@/components/prompts";
import { getPrompts } from "@/actions/prompt-actions";

// Force dynamic rendering since we use authentication
export const dynamic = "force-dynamic";

// Mock user role - replace with actual auth logic
async function getUserRole(): Promise<string> {
  // This should come from your auth system
  return "Owner";
}

async function PromptsPageContent() {
  const [promptsResult, userRole] = await Promise.all([
    getPrompts(),
    getUserRole(),
  ]);

  const prompts = promptsResult.success ? promptsResult.data || [] : [];

  if (!promptsResult.success) {
    // Check if it's a permission error
    const isPermissionError =
      promptsResult.error?.includes("permission") ||
      promptsResult.error?.includes("contact");

    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex justify-between items-center space-y-2">
          <h2 className="font-bold text-3xl tracking-tight">Prompts</h2>
        </div>
        <div
          className={`p-6 border rounded-lg text-center ${isPermissionError ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="space-y-4">
            {isPermissionError ? (
              <>
                <div className="text-amber-600 text-4xl">🔒</div>
                <h3 className="font-semibold text-amber-800 text-xl">
                  Access Restricted
                </h3>
                <div className="space-y-2 mx-auto max-w-md">
                  <p className="text-amber-700">
                    You don't currently have permission to view prompts.
                  </p>
                  <p className="text-amber-600 text-sm">
                    Contact your system administrator or an Owner to request
                    "View Prompts" permission.
                  </p>
                </div>
                <div className="pt-2">
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800"
                  >
                    Permission Required: View Prompts
                  </Badge>
                </div>
              </>
            ) : (
              <>
                <div className="text-red-600 text-4xl">⚠️</div>
                <h3 className="font-semibold text-red-800 text-xl">
                  Error Loading Prompts
                </h3>
                <p className="text-red-700">{promptsResult.error}</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center space-y-2">
        <h2 className="font-bold text-3xl tracking-tight">Prompts</h2>
        <div className="flex items-center space-x-2">
          {userRole === "Owner" && (
            <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-800">
              Owner Access
            </Badge>
          )}
        </div>
      </div>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <PromptStatsCards />
      </Suspense>

      <PromptsContainer initialPrompts={prompts} userRole={userRole} />
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2 p-6 border rounded-lg">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-12 h-8" />
          <Skeleton className="w-20 h-3" />
        </div>
      ))}
    </div>
  );
}

export default function PromptsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex justify-between items-center space-y-2">
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-24 h-6" />
          </div>
          <StatsCardsSkeleton />
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-full h-64" />
          </div>
        </div>
      }
    >
      <PromptsPageContent />
    </Suspense>
  );
}
