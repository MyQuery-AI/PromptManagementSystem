import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Settings } from "lucide-react";
import { getPromptStats } from "@/actions/prompt-actions";

export async function PromptStatsCards() {
  const statsResult = await getPromptStats();

  if (!statsResult.success || !statsResult.data) {
    return (
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-destructive text-2xl">--</div>
            <p className="text-muted-foreground text-xs">
              Failed to load stats
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { total, active, inactive, latestVersion } = statsResult.data;

  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Prompts</CardTitle>
          <FileText className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{total}</div>
          <p className="text-muted-foreground text-xs">All prompts in system</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Active Prompts</CardTitle>
          <Badge className="bg-green-500 rounded-full w-4 h-4" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{active}</div>
          <p className="text-muted-foreground text-xs">Currently in use</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">
            Inactive Prompts
          </CardTitle>
          <Badge className="bg-gray-500 rounded-full w-4 h-4" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{inactive}</div>
          <p className="text-muted-foreground text-xs">Not currently used</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Latest Version</CardTitle>
          <Settings className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{latestVersion}</div>
          <p className="text-muted-foreground text-xs">Most recent update</p>
        </CardContent>
      </Card>
    </div>
  );
}
