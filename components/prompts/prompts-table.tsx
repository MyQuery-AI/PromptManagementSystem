import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PromptActions } from "./prompt-actions";
import type { PromptResponse } from "@/actions/prompt-actions/types";

interface PromptsTableProps {
  prompts: PromptResponse[];
  userRole: string;
  onView?: (prompt: PromptResponse) => void;
  onEdit?: (prompt: PromptResponse) => void;
}

export function PromptsTable({
  prompts,
  userRole,
  onView,
  onEdit,
}: PromptsTableProps) {
  if (prompts.length === 0) {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[160px]">Type</TableHead>
              <TableHead className="w-[100px]">Version</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[150px]">Created By</TableHead>
              <TableHead className="w-[120px]">Last Updated</TableHead>
              <TableHead className="w-[70px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No prompts found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead className="w-[160px]">Type</TableHead>
            <TableHead className="w-[100px]">Version</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[150px]">Created By</TableHead>
            <TableHead className="w-[120px]">Last Updated</TableHead>
            <TableHead className="w-[70px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.map((prompt) => {
            return (
              <TableRow key={prompt.id}>
                <TableCell className="font-medium">#{prompt.id}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge
                      variant="outline"
                      className={`${prompt.promptType?.bgColor || "bg-gray-100"} ${prompt.promptType?.textColor || "text-gray-800"} border-0`}
                    >
                      {prompt.promptType?.icon}{" "}
                      {prompt.promptType?.name || "Unknown"}
                    </Badge>
                    <div className="text-muted-foreground text-xs">
                      {prompt.promptType?.usage || "General Use"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{prompt.version}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={prompt.isActive ? "default" : "secondary"}
                    className={
                      prompt.isActive
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {prompt.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {prompt.createdBy || "System"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(prompt.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <PromptActions
                    prompt={prompt}
                    userRole={userRole}
                    onView={onView}
                    onEdit={onEdit}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
