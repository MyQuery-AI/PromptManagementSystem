"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getPromptTypeById } from "@/lib/prompt-types";
import { extractPromptVariables } from "@/lib/prompt-variables";
import type { PromptResponse } from "@/actions/prompt-actions/types";

interface ViewPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: PromptResponse | null;
}

export function ViewPromptDialog({
  open,
  onOpenChange,
  prompt,
}: ViewPromptDialogProps) {
  if (!prompt) return null;

  const promptType = getPromptTypeById(prompt.promptTypeId);
  const promptVariables = extractPromptVariables(prompt.content);

  // Check for problematic quotations and backticks at start/end
  const hasProblematicQuotes = (content: string) => {
    const trimmed = content.trim();
    return (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith("`") && trimmed.endsWith("`"))
    );
  };

  const getQuoteType = (content: string) => {
    const trimmed = content.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"'))
      return 'double quotes (")';
    if (trimmed.startsWith("'") && trimmed.endsWith("'"))
      return "single quotes (')";
    if (trimmed.startsWith("`") && trimmed.endsWith("`"))
      return "backticks (`)";
    return "";
  };

  const showQuoteWarning = hasProblematicQuotes(prompt.content);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>View Prompt #{prompt.id}</DialogTitle>
          <DialogDescription>
            Detailed view of the prompt configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="gap-2 grid">
            <Label className="font-medium text-sm">Prompt Type</Label>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`${promptType?.bgColor || "bg-gray-100"} ${promptType?.textColor || "text-gray-800"} border-0`}
              >
                {promptType?.icon} {promptType?.name || prompt.promptType?.name}
              </Badge>
              <span className="text-muted-foreground text-sm">
                {promptType?.usage || "General Use"}
              </span>
            </div>
            {promptType?.usage && (
              <div className="text-muted-foreground text-xs">
                {promptType.usage}
              </div>
            )}
          </div>

          {prompt.feature && (
            <div className="gap-2 grid">
              <Label className="font-medium text-sm">Feature Name</Label>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="bg-slate-100 border-slate-300 font-mono text-slate-800"
                >
                  {prompt.feature}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  System feature identifier
                </span>
              </div>
            </div>
          )}

          <div className="gap-4 grid grid-cols-2">
            <div className="gap-2 grid">
              <Label className="font-medium text-sm">Version</Label>
              <Badge variant="outline" className="w-fit">
                {prompt.version}
              </Badge>
            </div>

            <div className="gap-2 grid">
              <Label className="font-medium text-sm">Status</Label>
              <Badge
                variant={prompt.isActive ? "default" : "secondary"}
                className={`w-fit ${
                  prompt.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {prompt.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="gap-2 grid">
            <Label className="font-medium text-sm">Prompt Content</Label>
            <div className="bg-muted p-3 rounded max-h-48 overflow-y-auto text-sm whitespace-pre-wrap">
              {prompt.content}
            </div>

            {/* Show quote warning if detected */}
            {showQuoteWarning && (
              <div className="bg-amber-50 p-2 border border-amber-200 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">⚠️</span>
                  <p className="text-amber-700 text-xs">
                    <strong>Note:</strong> This prompt is wrapped in{" "}
                    {getQuoteType(prompt.content)}. This may interfere with
                    template variable functionality.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Display extracted variables if any */}
          {promptVariables.length > 0 && (
            <div className="gap-2 grid">
              <Label className="font-medium text-sm">
                Template Variables ({promptVariables.length})
              </Label>
              <div className="bg-blue-50 p-3 border border-blue-200 rounded">
                <div className="flex flex-wrap gap-1 mb-2">
                  {promptVariables.map((variable) => (
                    <Badge
                      key={variable}
                      variant="outline"
                      className="bg-white border-blue-300 font-mono text-blue-700 text-xs"
                    >
                      ${`{${variable}}`}
                    </Badge>
                  ))}
                </div>
                <p className="text-blue-600 text-xs">
                  This prompt contains template variables that need to be
                  replaced with actual values when used.
                </p>
              </div>
            </div>
          )}

          <div className="gap-4 grid grid-cols-2">
            <div className="gap-2 grid">
              <Label className="font-medium text-sm">Created By</Label>
              <div className="text-muted-foreground text-sm">
                {prompt.createdBy || "System"}
              </div>
            </div>

            <div className="gap-2 grid">
              <Label className="font-medium text-sm">Last Updated</Label>
              <div className="text-muted-foreground text-sm">
                {new Date(prompt.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="gap-2 grid">
            <Label className="font-medium text-sm">Created At</Label>
            <div className="text-muted-foreground text-sm">
              {new Date(prompt.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
