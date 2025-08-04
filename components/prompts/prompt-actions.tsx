"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Download,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deletePrompt,
  duplicatePrompt,
  togglePromptStatus,
} from "@/actions/prompt-actions/prompt-actions";
import { toast } from "sonner";
import type { PromptResponse } from "@/actions/prompt-actions/types";

interface PromptActionsProps {
  prompt: PromptResponse;
  userRole: string;
  onView?: (prompt: PromptResponse) => void;
  onEdit?: (prompt: PromptResponse) => void;
}

export function PromptActions({
  prompt,
  userRole,
  onView,
  onEdit,
}: PromptActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isOwner = userRole === "Owner";
  const hasEditPermission = isOwner; // Add more permission logic here

  const handleView = () => {
    onView?.(prompt);
  };

  const handleEdit = () => {
    onEdit?.(prompt);
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(prompt.id.toString());
      toast.success("Prompt ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy ID");
    }
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      const result = await duplicatePrompt(prompt.id);
      if (result.success) {
        toast.success(result.message || "Prompt duplicated successfully");
      } else {
        toast.error(result.error || "Failed to duplicate prompt");
      }
    } catch (error) {
      toast.error("Failed to duplicate prompt");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      const result = await togglePromptStatus(prompt.id);
      if (result.success) {
        toast.success(result.message || "Prompt status updated");
      } else {
        toast.error(result.error || "Failed to update prompt status");
      }
    } catch (error) {
      toast.error("Failed to update prompt status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this prompt? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deletePrompt(prompt.id);
      if (result.success) {
        toast.success(result.message || "Prompt deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete prompt");
      }
    } catch (error) {
      toast.error("Failed to delete prompt");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      id: prompt.id,
      version: prompt.version,
      content: prompt.content,
      isActive: prompt.isActive,
      createdBy: prompt.createdBy,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-${prompt.promptType}-${prompt.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Prompt exported successfully");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 w-8 h-8" disabled={isLoading}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 w-4 h-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyId}>
          <Copy className="mr-2 w-4 h-4" />
          Copy ID
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleExport}>
          <Download className="mr-2 w-4 h-4" />
          Export
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {hasEditPermission && (
          <>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 w-4 h-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 w-4 h-4" />
              Duplicate
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleToggleStatus}>
              {prompt.isActive ? (
                <ToggleLeft className="mr-2 w-4 h-4" />
              ) : (
                <ToggleRight className="mr-2 w-4 h-4" />
              )}
              {prompt.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
