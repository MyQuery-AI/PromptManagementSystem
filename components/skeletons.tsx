import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function UserStatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-4 h-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 w-16 h-8" />
        <Skeleton className="w-24 h-3" />
      </CardContent>
    </Card>
  );
}

export function UserTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <Skeleton className="rounded-full w-10 h-10" />
            <div className="space-y-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="w-16 h-6" />
            <Skeleton className="w-8 h-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RoleCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Skeleton className="mr-2 w-5 h-5" />
          <Skeleton className="w-16 h-6" />
        </div>
        <Skeleton className="w-full h-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-4" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
