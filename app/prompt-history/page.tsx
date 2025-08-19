"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, History, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ActionResponse,
  getAllPromptHistory,
  PromptHistoryResponse,
} from "@/actions/prompt-history-actions";
import { setActivePromptHistory } from "@/actions/prompt-history-actions/prompt-history-actions";

interface PromptHistoryWithContent extends PromptHistoryResponse {
  id: number; // ✅ include id
  content: string;
}

interface UniquePrompt {
  id: number;
  feature: string;
  currentVersion: string;
  versions: Array<{ version: string; content: string }>;
  selectedVersion: string;
}

export default function PromptHistoryPage() {
  const [promptHistory, setPromptHistory] = useState<
    PromptHistoryWithContent[]
  >([]);
  const [uniquePrompts, setUniquePrompts] = useState<UniquePrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPromptHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ActionResponse<PromptHistoryWithContent[]> =
        await getAllPromptHistory();

      if (response.success && response.data) {
        setPromptHistory(response.data);
        processPromptData(response.data);
      } else {
        setError(response.error || "Failed to fetch prompt history");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching prompt history:", err);
    } finally {
      setLoading(false);
    }
  };

  const parseVersion = (version: string): number =>
    parseFloat(version.replace("v", "")) || 0;

  const processPromptData = (data: PromptHistoryWithContent[]) => {
    const featureMap = new Map<
      string,
      {
        id: number;
        versions: Array<{ version: string; content: string }>;
        currentVersion: string;
      }
    >();

    data.forEach((item) => {
      if (!featureMap.has(item.feature)) {
        featureMap.set(item.feature, {
          id: item.id,
          versions: [],
          currentVersion: item.currentVersion,
        });
      }
      const entry = featureMap.get(item.feature)!;
      const versionExists = entry.versions.some(
        (v) => v.version === item.version
      );
      if (!versionExists) {
        entry.versions.push({ version: item.version, content: item.content });
      }
    });

    const processed: UniquePrompt[] = Array.from(featureMap.entries()).map(
      ([feature, { id, versions, currentVersion }]) => {
        const sortedVersions = versions.sort(
          (a, b) => parseVersion(b.version) - parseVersion(a.version)
        );
        return {
          id,
          feature,
          versions: sortedVersions,

          selectedVersion:
            currentVersion &&
            sortedVersions.some((v) => v.version === currentVersion)
              ? currentVersion
              : sortedVersions[0]?.version || "",
          currentVersion,
        };
      }
    );

    setUniquePrompts(processed);
  };

  const handleVersionChange = (featureIndex: number, version: string) => {
    setUniquePrompts((prev) =>
      prev.map((prompt, index) =>
        index === featureIndex
          ? { ...prompt, selectedVersion: version }
          : prompt
      )
    );
  };

  const getSelectedContent = (prompt: UniquePrompt): string => {
    const selectedVersionData = prompt.versions.find(
      (v) => v.version === prompt.selectedVersion
    );
    return selectedVersionData?.content || "No content found for this version";
  };

  const handleMakeActive = async (
    id: number,
    version: string,
    content: string
  ) => {
    try {
      console.log(`Setting prompt ${id} as active`);

      await setActivePromptHistory(id, version, content);

      // Update the correct prompt in local state
      setUniquePrompts((prev) =>
        prev.map((prompt) =>
          prompt.id === id
            ? {
                ...prompt,
                currentVersion: version, // ✅ mark this as active
                selectedVersion: version, // ✅ also keep dropdown in sync
              }
            : prompt
        )
      );
    } catch (error) {
      console.error("Error setting active prompt history:", error);
      setError("Failed to set active prompt history");
    }
  };

  const getVersionBadgeVariant = (version: string) => {
    const numericVersion = parseVersion(version);
    if (numericVersion === 1) return "default";
    if (numericVersion <= 5) return "secondary";
    return "destructive";
  };

  useEffect(() => {
    fetchPromptHistory();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="w-[200px] h-6" />
            <Skeleton className="w-[300px] h-4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="w-[150px] h-10" />
            <Skeleton className="w-full h-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="mx-auto px-4 py-8 container">
        <div className="mx-auto max-w-4xl">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={fetchPromptHistory}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-3xl tracking-tight">
                Prompt History
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage and view different versions of your prompts
              </p>
            </div>
          </div>
          <Button
            onClick={fetchPromptHistory}
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Row */}
        <div className="flex md:flex-row flex-col gap-4 mb-8">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                Total Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {loading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  uniquePrompts.length
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                Total Versions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {loading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  uniquePrompts.reduce(
                    (acc, prompt) => acc + prompt.versions.length,
                    0
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-muted-foreground text-sm">
                Avg Versions/Feature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {loading ? (
                  <Skeleton className="w-16 h-8" />
                ) : uniquePrompts.length > 0 ? (
                  Math.round(
                    (uniquePrompts.reduce(
                      (acc, prompt) => acc + prompt.versions.length,
                      0
                    ) /
                      uniquePrompts.length) *
                      10
                  ) / 10
                ) : (
                  0
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prompt Cards */}
        {loading ? (
          <LoadingSkeleton />
        ) : uniquePrompts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <History className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">No Prompts Found</h3>
              <p className="text-muted-foreground">
                No prompt history has been recorded yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 pr-2 max-h-[75vh] overflow-y-auto">
            {uniquePrompts.map((prompt, index) => (
              <Card
                key={prompt.id} // ✅ use prompt.id instead of feature-index combo
                className="border-l-4 border-l-primary"
              >
                <CardHeader>
                  <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-3">
                    <div>
                      <CardTitle className="text-xl">
                        {prompt.feature}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {prompt.versions.length} version
                        {prompt.versions.length !== 1 ? "s" : ""} available
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {prompt.versions.map(({ version }) => (
                        <Badge
                          key={version}
                          variant={
                            version === prompt.selectedVersion
                              ? "default"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {version}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex md:flex-row flex-col gap-6">
                    {/* Version Selector */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="min-w-fit font-medium text-sm">
                          Select Version:
                        </label>
                        <Select
                          value={prompt.selectedVersion}
                          onValueChange={(version) =>
                            handleVersionChange(index, version)
                          }
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {prompt.versions.map(({ version }) => (
                              <SelectItem key={version} value={version}>
                                <Badge
                                  variant={getVersionBadgeVariant(version)}
                                  className="text-xs"
                                >
                                  {version}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Badge variant="secondary">
                        Currently viewing: {prompt.selectedVersion}
                      </Badge>
                    </div>

                    {/* Expandable Textarea */}
                    <div className="flex-[2] space-y-2">
                      <label className="font-medium text-sm">
                        Prompt Content ({prompt.selectedVersion}):
                      </label>
                      <Textarea
                        value={getSelectedContent(prompt)}
                        readOnly
                        className="bg-muted/50 hover:shadow-lg min-h-[120px] hover:min-h-[300px] max-h-[400px] overflow-y-auto font-mono text-sm transition-all duration-300 ease-in-out"
                        placeholder="No content available for this version"
                      />
                    </div>
                  </div>

                  {/* Version Info */}
                  <div className="flex justify-between items-center bg-muted/30 mt-4 p-3 rounded-lg text-muted-foreground text-sm">
                    <div className="flex items-center gap-4">
                      <span>
                        <strong>Total Versions:</strong>{" "}
                        {prompt.versions.length}
                      </span>
                      <span>
                        <strong>Latest:</strong> {prompt.versions[0]?.version}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="">
                        {prompt.currentVersion === prompt.selectedVersion ? (
                          <div className="font-medium text-green-500">
                            Active Version
                          </div>
                        ) : (
                          <Button
                            onClick={() =>
                              handleMakeActive(
                                prompt.id,
                                prompt.selectedVersion,
                                getSelectedContent(prompt)
                              )
                            }
                          >
                            Set Active
                          </Button>
                        )}
                      </div>
                      <div className="bg-green-500 rounded-full w-2 h-2"></div>
                      <span>Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
