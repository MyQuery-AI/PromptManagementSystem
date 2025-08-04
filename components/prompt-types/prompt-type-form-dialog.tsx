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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  createPromptType,
  updatePromptType,
} from "@/actions/prompt-type-actions";
import type {
  CreatePromptTypeInput,
  UpdatePromptTypeInput,
  PromptTypeResponse,
} from "@/actions/prompt-type-actions";

// Available color options
const COLOR_OPTIONS = [
  { value: "gray", label: "Gray", bg: "bg-gray-100", text: "text-gray-800" },
  { value: "blue", label: "Blue", bg: "bg-blue-100", text: "text-blue-800" },
  {
    value: "green",
    label: "Green",
    bg: "bg-green-100",
    text: "text-green-800",
  },
  {
    value: "yellow",
    label: "Yellow",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  { value: "red", label: "Red", bg: "bg-red-100", text: "text-red-800" },
  {
    value: "purple",
    label: "Purple",
    bg: "bg-purple-100",
    text: "text-purple-800",
  },
  { value: "pink", label: "Pink", bg: "bg-pink-100", text: "text-pink-800" },
  {
    value: "indigo",
    label: "Indigo",
    bg: "bg-indigo-100",
    text: "text-indigo-800",
  },
  {
    value: "orange",
    label: "Orange",
    bg: "bg-orange-100",
    text: "text-orange-800",
  },
  { value: "teal", label: "Teal", bg: "bg-teal-100", text: "text-teal-800" },
];

// Common emoji options for icons
const ICON_OPTIONS = [
  "📝",
  "🔍",
  "📊",
  "💡",
  "🎯",
  "🚀",
  "⚡",
  "🛠️",
  "📋",
  "🎨",
  "🔧",
  "📈",
  "💬",
  "🌟",
  "🔮",
  "📌",
  "🎪",
  "🎭",
  "🎸",
  "🎲",
];

interface PromptTypeFormData {
  name: string;
  usage: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
}

interface PromptTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptType?: PromptTypeResponse | null;
  mode: "create" | "edit";
}

export function PromptTypeFormDialog({
  open,
  onOpenChange,
  promptType,
  mode,
}: PromptTypeFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<PromptTypeFormData>({
    name: promptType?.name || "",
    usage: promptType?.usage || "",
    color: promptType?.color || "blue",
    bgColor: promptType?.bgColor || "bg-blue-100",
    textColor: promptType?.textColor || "text-blue-800",
    icon: promptType?.icon || "📝",
  });

  // Update colors when color selection changes
  const handleColorChange = (color: string) => {
    const selectedColor = COLOR_OPTIONS.find(
      (option) => option.value === color
    );
    if (selectedColor) {
      setFormData({
        ...formData,
        color,
        bgColor: selectedColor.bg,
        textColor: selectedColor.text,
      });
    }
  };

  // Reset form when prompt type changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: promptType?.name || "",
        usage: promptType?.usage || "",
        color: promptType?.color || "blue",
        bgColor: promptType?.bgColor || "bg-blue-100",
        textColor: promptType?.textColor || "text-blue-800",
        icon: promptType?.icon || "📝",
      });
    }
  }, [open, promptType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "create") {
        const createData: CreatePromptTypeInput = {
          name: formData.name,
          usage: formData.usage,
          color: formData.color,
          bgColor: formData.bgColor,
          textColor: formData.textColor,
          icon: formData.icon,
        };

        const result = await createPromptType(createData);
        if (result.success) {
          toast.success(result.message || "Prompt type created successfully");
          onOpenChange(false);
          resetForm();
        } else {
          toast.error(result.error || "Failed to create prompt type");
        }
      } else if (mode === "edit" && promptType) {
        const updateData: UpdatePromptTypeInput = {
          id: promptType.id,
          name: formData.name,
          usage: formData.usage,
          color: formData.color,
          bgColor: formData.bgColor,
          textColor: formData.textColor,
          icon: formData.icon,
        };

        const result = await updatePromptType(updateData);
        if (result.success) {
          toast.success(result.message || "Prompt type updated successfully");
          onOpenChange(false);
        } else {
          toast.error(result.error || "Failed to update prompt type");
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
      name: "",
      usage: "",
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: "📝",
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
      <DialogContent className="flex flex-col sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {mode === "create" ? "Create New Prompt Type" : "Edit Prompt Type"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Define a new type of prompt for your system."
              : "Make changes to the prompt type configuration."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="gap-4 grid py-4">
              <div className="gap-2 grid">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., SQL Generation"
                  required
                />
              </div>

              <div className="gap-2 grid">
                <Label htmlFor="usage">Usage Description</Label>
                <Textarea
                  id="usage"
                  value={formData.usage}
                  onChange={(e) =>
                    setFormData({ ...formData, usage: e.target.value })
                  }
                  placeholder="Describe what this prompt type is used for..."
                  rows={3}
                  required
                />
              </div>

              <div className="gap-2 grid">
                <Label htmlFor="icon">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) =>
                    setFormData({ ...formData, icon: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{formData.icon}</span>
                        <span>Select Icon</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="grid grid-cols-5 gap-1 p-2">
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem
                          key={icon}
                          value={icon}
                          className="flex justify-center p-2"
                        >
                          <span className="text-lg">{icon}</span>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="gap-2 grid">
                <Label htmlFor="color">Color Theme</Label>
                <Select
                  value={formData.color}
                  onValueChange={handleColorChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color theme">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded ${formData.bgColor}`}
                        ></div>
                        <span className="capitalize">{formData.color}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${option.bg}`}></div>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <div className="gap-2 grid">
                <Label>Preview</Label>
                <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted/50">
                  <Badge
                    variant="outline"
                    className={`${formData.bgColor} ${formData.textColor} border-0`}
                  >
                    <span className="mr-1">{formData.icon}</span>
                    {formData.name || "Prompt Type Name"}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    {formData.usage || "Usage description"}
                  </span>
                </div>
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
                ? "Create Prompt Type"
                : "Update Prompt Type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
