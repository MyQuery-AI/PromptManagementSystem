"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createPrompt, updatePrompt } from "@/actions/prompt-actions";
import { PROMPT_TYPES, getPromptTypeById } from "@/lib/prompt-types";
import { extractPromptVariables } from "@/lib/prompt-variables";
import { toast } from "sonner";
import type {
  PromptResponse,
  CreatePromptInput,
  UpdatePromptInput,
} from "@/actions/prompt-actions/types";

// Helper function to increment version
function getNextVersion(currentVersion: string): string {
  const versionRegex = /^v(\d+)(?:\.(\d+))?$/;
  const match = currentVersion.match(versionRegex);

  if (!match) {
    return "v1";
  }

  const major = parseInt(match[1], 10);
  const minor = parseInt(match[2] || "0", 10);

  // Increment minor version, if minor reaches 9, increment major and reset minor
  if (minor < 9) {
    return minor === 0 ? `v${major}.1` : `v${major}.${minor + 1}`;
  } else {
    return `v${major + 1}`;
  }
}

interface PromptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt?: PromptResponse | null;
  mode: "create" | "edit";
}

export function PromptFormDialog({
  open,
  onOpenChange,
  prompt,
  mode,
}: PromptFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    feature: prompt?.feature || "",
    promptType: prompt?.promptType || "sql_generation",
    content: prompt?.content || "",
    isActive: prompt?.isActive ?? true,
  });

  // Calculate the display version based on mode
  const displayVersion =
    mode === "create" ? "v1" : getNextVersion(prompt?.version || "v1");

  // Extract variables from prompt content
  const promptVariables = extractPromptVariables(formData.content);

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

  const removeEncapsulatingQuotes = () => {
    const trimmed = formData.content.trim();
    let cleaned = trimmed;

    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith("`") && trimmed.endsWith("`"))
    ) {
      cleaned = trimmed.slice(1, -1);
    }

    setFormData({ ...formData, content: cleaned });
  };

  const [ignoreQuoteWarning, setIgnoreQuoteWarning] = useState(false);
  const showQuoteWarning =
    hasProblematicQuotes(formData.content) && !ignoreQuoteWarning;

  // Reset form when prompt changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        feature: prompt?.feature || "",
        promptType: prompt?.promptType || "sql_generation",
        content: prompt?.content || "",
        isActive: prompt?.isActive ?? true,
      });
      setIgnoreQuoteWarning(false); // Reset quote warning when dialog opens
    }
  }, [open, prompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "create") {
        const createData: CreatePromptInput = {
          feature: formData.feature,
          promptType: formData.promptType,
          version: "v1", // Always start with v1 for new prompts
          content: formData.content,
          isActive: formData.isActive,
          createdBy: "current-user@example.com", // This should come from auth
        };

        const result = await createPrompt(createData);
        if (result.success) {
          toast.success(result.message || "Prompt created successfully");
          onOpenChange(false);
          resetForm();
        } else {
          toast.error(result.error || "Failed to create prompt");
        }
      } else if (mode === "edit" && prompt) {
        const updateData: UpdatePromptInput = {
          id: prompt.id,
          feature: formData.feature,
          promptType: formData.promptType,
          version: displayVersion, // Use the auto-calculated next version
          content: formData.content,
          isActive: formData.isActive,
        };

        const result = await updatePrompt(updateData);
        if (result.success) {
          toast.success(result.message || "Prompt updated successfully");
          onOpenChange(false);
        } else {
          toast.error(result.error || "Failed to update prompt");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      feature: "",
      promptType: "sql_generation",
      content: "",
      isActive: true,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      if (mode === "create") {
        resetForm();
      }
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {mode === "create" ? "Create New Prompt" : "Edit Prompt"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new AI prompt for your application."
              : "Make changes to the prompt configuration."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="gap-4 grid py-4">
              <div className="gap-2 grid">
                <Label htmlFor="feature">Feature Name</Label>
                <Input
                  id="feature"
                  value={formData.feature}
                  onChange={(e) =>
                    setFormData({ ...formData, feature: e.target.value })
                  }
                  placeholder="e.g., generate_sql, explain_query"
                  required
                />
                <span className="text-muted-foreground text-xs">
                  Keep the name as close to the original prompt name as possible
                </span>
              </div>

              <div className="gap-2 grid">
                <Label htmlFor="promptType">Prompt Type</Label>
                <Select
                  value={formData.promptType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, promptType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select prompt type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROMPT_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center space-x-2">
                          <span>{type.icon}</span>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-muted-foreground text-xs">
                              {type.usage}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(() => {
                  const selectedType = getPromptTypeById(formData.promptType);
                  return selectedType ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`${selectedType.bgColor} ${selectedType.textColor} border-0`}
                      >
                        {selectedType.icon} {selectedType.name}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {selectedType.usage}
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="gap-2 grid">
                <Label htmlFor="version">Version</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="version"
                    value={displayVersion}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                  <Badge variant="secondary" className="text-xs">
                    {mode === "create" ? "Initial" : "Auto-increment"}
                  </Badge>
                </div>
                <span className="text-muted-foreground text-xs">
                  {mode === "create"
                    ? "New prompts start with version v1"
                    : "Version will be automatically incremented when saved"}
                </span>
              </div>

              <div className="gap-2 grid">
                <Label htmlFor="content">Prompt Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Enter the prompt content..."
                  rows={6}
                  required
                />

                {/* Show quote warning if detected */}
                {showQuoteWarning && (
                  <div className="bg-amber-50 mt-2 p-3 border border-amber-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-amber-600">⚠️</div>
                      <div className="flex-1">
                        <Label className="block mb-1 font-medium text-amber-800 text-sm">
                          Potential Template Issue Detected
                        </Label>
                        <p className="mb-3 text-amber-700 text-xs">
                          Your prompt is wrapped in{" "}
                          {getQuoteType(formData.content)}. This may interfere
                          with template variable functionality and cause parsing
                          errors.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="bg-white hover:bg-amber-50 border-amber-300 h-7 text-amber-700 text-xs"
                            onClick={removeEncapsulatingQuotes}
                          >
                            Remove Quotes
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="hover:bg-amber-100 h-7 text-amber-600 text-xs"
                            onClick={() => setIgnoreQuoteWarning(true)}
                          >
                            Keep Intentionally
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show usage message when no variables detected, otherwise show detected variables */}
                {promptVariables.length === 0 ? (
                  <div className="bg-blue-50 mt-2 p-3 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-blue-600">💡</div>
                      <div>
                        <Label className="block mb-1 font-medium text-blue-800 text-sm">
                          Template Variables
                        </Label>
                        <p className="mb-2 text-blue-700 text-xs">
                          Use template variables to make your prompts dynamic.
                          Wrap variable names in{" "}
                          <code className="bg-blue-100 px-1 rounded text-blue-800">
                            ${`{}`}
                          </code>
                        </p>
                        <div className="space-y-1 text-blue-600 text-xs">
                          <div>
                            <strong>Examples:</strong>
                          </div>
                          <div>
                            <code className="bg-blue-100 px-1 rounded">
                              ${`{dbConfig.dialectName}`}
                            </code>{" "}
                            - Database type
                          </div>
                          <div>
                            <code className="bg-blue-100 px-1 rounded">
                              ${`{user.name}`}
                            </code>{" "}
                            - User name
                          </div>
                          <div>
                            <code className="bg-blue-100 px-1 rounded">
                              ${`{settings.maxResults}`}
                            </code>{" "}
                            - Configuration value
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 mt-2 p-3 border rounded-md">
                    <Label className="block mb-2 font-medium text-sm">
                      Template Variables Found ({promptVariables.length})
                    </Label>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                      {promptVariables.map((variable, index) => (
                        <Badge
                          key={variable}
                          variant="outline"
                          className="bg-blue-50 border-blue-200 font-mono text-blue-700 text-xs"
                        >
                          ${`{${variable}}`}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs">
                      This prompt contains template variables. Make sure to
                      provide values for these variables when using the prompt
                      in your application.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit();
              }
            }}
          >
            {isLoading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
                ? "Create Prompt"
                : "Update Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
