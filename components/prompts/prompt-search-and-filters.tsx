"use client";

import { useState } from "react";
import { Search, Plus, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PromptTypeResponse } from "@/actions/prompt-type-actions/types";
import { PROMPT_TYPES } from "@/lib/prompt-types";
import type { PromptFilters } from "@/actions/prompt-actions/types";

interface PromptSearchAndFiltersProps {
  filters: PromptFilters;
  onFiltersChange: (filters: PromptFilters) => void;
  onCreateNew?: () => void;
  userRole: string;
  promptTypes: PromptTypeResponse[];
}

export function PromptSearchAndFilters({
  filters,
  onFiltersChange,
  onCreateNew,
  userRole,
  promptTypes,
}: PromptSearchAndFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [typeSearchTerm, setTypeSearchTerm] = useState("");
  const [statusSearchTerm, setStatusSearchTerm] = useState("");

  const isOwner = userRole === "Owner";
  const hasCreatePermission = isOwner; // Add more permission logic here

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleStatusFilter = (isActive: boolean | undefined) => {
    onFiltersChange({ ...filters, isActive });
    setStatusSearchTerm(""); // Reset search when filter is applied
  };

  const handlePromptTypeFilter = (promptType: string | undefined) => {
    onFiltersChange({ ...filters, promptType });
    setTypeSearchTerm(""); // Reset search when filter is applied
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeSearchTerm("");
    setStatusSearchTerm("");
    onFiltersChange({});
  };

  const filteredPromptTypes = PROMPT_TYPES.filter(
    (type) =>
      type.name.toLowerCase().includes(typeSearchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(typeSearchTerm.toLowerCase())
  );

  // Status options for filtering
  const statusOptions = [
    {
      value: undefined,
      label: "All Status",
      description: "Show all prompts",
    },
    { value: true, label: "Active", description: "Only active prompts" },
    { value: false, label: "Inactive", description: "Only inactive prompts" },
  ];

  // Filter status options based on search term
  const filteredStatusOptions = statusOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(statusSearchTerm.toLowerCase()) ||
      option.description.toLowerCase().includes(statusSearchTerm.toLowerCase())
  );

  const hasActiveFilters =
    filters.search ||
    filters.isActive !== undefined ||
    filters.promptTypeId ||
    filters.feature ||
    filters.promptType ||
    filters.createdBy;

  return (
    <div className="space-y-4">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        {/* Search and Filters Row */}
        <div className="flex flex-wrap flex-1 items-center gap-2">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by feature, content, or creator..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Status Filter Dropdown with Search */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between w-[120px]">
                <span>
                  {filters.isActive === undefined
                    ? "All Status"
                    : filters.isActive
                      ? "Active"
                      : "Inactive"}
                </span>
                <ChevronDown className="opacity-50 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              <div className="p-2">
                <div className="relative">
                  <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search status..."
                    value={statusSearchTerm}
                    onChange={(e) => setStatusSearchTerm(e.target.value)}
                    className="pl-8 h-8"
                  />
                </div>
              </div>
              {filteredStatusOptions.map((option, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleStatusFilter(option.value)}
                  className={`${filters.isActive === option.value ? "bg-accent" : ""}`}
                >
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {option.description}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
              {filteredStatusOptions.length === 0 && statusSearchTerm && (
                <div className="px-2 py-6 text-muted-foreground text-sm text-center">
                  No status found
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Filter Dropdown with Search */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between w-[160px]">
                <span className="flex items-center space-x-2">
                  {filters.promptTypeId ? (
                    <>
                      <span>
                        {
                          promptTypes.find((t) => t.id === filters.promptTypeId)
                            ?.icon
                        }
                      </span>
                      <span>
                        {
                          promptTypes.find((t) => t.id === filters.promptTypeId)
                            ?.name
                        }
                      </span>
                    </>
                  ) : (
                    <span>All Types</span>
                  )}
                </span>
                <ChevronDown className="opacity-50 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <div className="p-2">
                <div className="relative">
                  <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search types..."
                    value={typeSearchTerm}
                    onChange={(e) => setTypeSearchTerm(e.target.value)}
                    className="pl-8 h-8"
                  />
                </div>
              </div>
              <DropdownMenuItem
                onClick={() => handlePromptTypeFilter(undefined)}
                className={`${!filters.promptTypeId ? "bg-accent" : ""}`}
              >
                All Types
              </DropdownMenuItem>
              {filteredPromptTypes.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  onClick={() => handlePromptTypeFilter(type.id)}
                  className={`${filters.promptTypeId === type.id ? "bg-accent" : ""}`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{type.icon}</span>
                    <div className="flex flex-col">
                      <span>{type.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {type.usage}
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              {filteredPromptTypes.length === 0 && typeSearchTerm && (
                <div className="px-2 py-6 text-muted-foreground text-sm text-center">
                  No types found
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="px-2 h-9"
            >
              <X className="mr-1 w-3 h-3" />
              Clear
            </Button>
          )}
        </div>

        {hasCreatePermission && (
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 w-4 h-4" />
            Create Prompt
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm">Filtered by:</span>

          {filters.search && (
            <Badge variant="secondary" className="text-xs">
              Search: "{filters.search}"
            </Badge>
          )}

          {filters.isActive !== undefined && (
            <Badge variant="secondary" className="text-xs">
              Status: {filters.isActive ? "Active" : "Inactive"}
            </Badge>
          )}

          {filters.promptType && (
            <Badge variant="secondary" className="text-xs">
              {PROMPT_TYPES.find((t) => t.id === filters.promptType)?.icon}{" "}
              {PROMPT_TYPES.find((t) => t.id === filters.promptType)?.name ||
                filters.promptType}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
