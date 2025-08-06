"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PromptsTable } from "./prompts-table";
import { PromptSearchAndFilters } from "./prompt-search-and-filters";
import { PromptFormDialog } from "./prompt-form-dialog";
import { ViewPromptDialog } from "./view-prompt-dialog";
import { getAllPromptTypes } from "@/actions/prompt-type-actions";
import type {
  PromptResponse,
  PromptFilters,
} from "@/actions/prompt-actions/types";
import type { PromptTypeResponse } from "@/actions/prompt-type-actions/types";

interface PromptsContainerProps {
  initialPrompts: PromptResponse[];
  userRole: string;
}

export function PromptsContainer({
  initialPrompts,
  userRole,
}: PromptsContainerProps) {
  const [prompts, setPrompts] = useState<PromptResponse[]>(initialPrompts);
  const [filters, setFilters] = useState<PromptFilters>({});
  const [promptTypes, setPromptTypes] = useState<PromptTypeResponse[]>([]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptResponse | null>(
    null
  );

  // Fetch prompt types on mount
  useEffect(() => {
    const fetchPromptTypes = async () => {
      const result = await getAllPromptTypes();
      if (result.success && result.data) {
        setPromptTypes(result.data);
      }
    };
    fetchPromptTypes();
  }, []);

  // Filter prompts based on current filters
  const filteredPrompts = prompts.filter((prompt) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!prompt.feature) return false;
      const matchesSearch = prompt.feature.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    if (
      filters.isActive !== undefined &&
      prompt.isActive !== filters.isActive
    ) {
      return false;
    }

    if (filters.promptTypeId && prompt.promptTypeId !== filters.promptTypeId) {
      return false;
    }

    if (filters.feature && prompt.feature !== filters.feature) {
      return false;
    }

    if (filters.createdBy && prompt.createdBy !== filters.createdBy) {
      return false;
    }

    return true;
  });

  // Update prompts when initialPrompts change (after server actions)
  useEffect(() => {
    setPrompts(initialPrompts);
  }, [initialPrompts]);

  const handleCreateNew = () => {
    setCreateDialogOpen(true);
  };

  const handleView = (prompt: PromptResponse) => {
    setSelectedPrompt(prompt);
    setViewDialogOpen(true);
  };

  const handleEdit = (prompt: PromptResponse) => {
    setSelectedPrompt(prompt);
    setEditDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Prompts Management</CardTitle>
              <CardDescription>
                Manage and configure AI prompts for your application
              </CardDescription>
            </div>
          </div>

          <PromptSearchAndFilters
            filters={filters}
            onFiltersChange={setFilters}
            onCreateNew={handleCreateNew}
            userRole={userRole}
            promptTypes={promptTypes}
          />
        </CardHeader>

        <CardContent>
          <PromptsTable
            prompts={filteredPrompts}
            userRole={userRole}
            onView={handleView}
            onEdit={handleEdit}
          />

          {filteredPrompts.length > 0 && (
            <div className="flex justify-between items-center space-x-2 py-4">
              <div className="text-muted-foreground text-sm">
                Showing {filteredPrompts.length} of {prompts.length} prompt(s)
              </div>
              <div className="flex items-center space-x-2">
                {/* Pagination would go here if needed */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PromptFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
      />

      <PromptFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        prompt={selectedPrompt}
        mode="edit"
      />

      <ViewPromptDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        prompt={selectedPrompt}
      />
    </>
  );
}
