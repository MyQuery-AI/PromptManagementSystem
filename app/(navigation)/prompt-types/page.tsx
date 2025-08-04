"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  getAllPromptTypes,
  deletePromptType,
} from "@/actions/prompt-type-actions";
import type { PromptTypeResponse } from "@/actions/prompt-type-actions";
import { toast } from "sonner";
import { PromptTypeFormDialog } from "@/components/prompt-types/prompt-type-form-dialog";

export default function PromptTypesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromptType, setEditingPromptType] =
    useState<PromptTypeResponse | null>(null);
  const [promptTypes, setPromptTypes] = useState<PromptTypeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPromptTypes = async () => {
    setIsLoading(true);
    try {
      const result = await getAllPromptTypes();
      if (result.success && result.data) {
        setPromptTypes(result.data);
      } else {
        toast.error(result.error || "Failed to fetch prompt types");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromptTypes();
  }, []);

  const handleEdit = (promptType: PromptTypeResponse) => {
    setEditingPromptType(promptType);
    setIsDialogOpen(true);
  };

  const handleDelete = async (promptType: PromptTypeResponse) => {
    if (
      window.confirm(`Are you sure you want to delete "${promptType.name}"?`)
    ) {
      try {
        const result = await deletePromptType(promptType.id);
        if (result.success) {
          toast.success(result.message || "Prompt type deleted successfully");
          fetchPromptTypes(); // Refresh the list
        } else {
          toast.error(result.error || "Failed to delete prompt type");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPromptType(null);
    fetchPromptTypes(); // Refresh the list when dialog closes
  };

  const handleCreateNew = () => {
    setEditingPromptType(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-bold text-3xl text-gray-900">Prompt Types</h1>
            <p className="mt-2 text-gray-600">
              Manage the different types of prompts available in your system.
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 w-4 h-4" />
            New Prompt Type
          </Button>
        </div>

        <div className="bg-white shadow-sm border rounded-lg">
          {isLoading ? (
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-2xl mb-4">Loading...</div>
              </div>
            </div>
          ) : promptTypes.length === 0 ? (
            <div className="p-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="mb-2 font-medium text-gray-900 text-lg">
                  No prompt types yet
                </h3>
                <p className="mb-6 text-gray-500">
                  Create your first prompt type to get started.
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="mr-2 w-4 h-4" />
                  Create Prompt Type
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {promptTypes.map((promptType) => (
                <div
                  key={promptType.id}
                  className="flex justify-between items-center p-6"
                >
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant="outline"
                      className={`${promptType.bgColor} ${promptType.textColor} border-0`}
                    >
                      <span className="mr-1">{promptType.icon}</span>
                      {promptType.name}
                    </Badge>
                    <div>
                      <p className="text-gray-600 text-sm">
                        {promptType.usage}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Created {promptType.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(promptType)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(promptType)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <PromptTypeFormDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          promptType={editingPromptType}
          mode={editingPromptType ? "edit" : "create"}
        />
      </div>
    </div>
  );
}
