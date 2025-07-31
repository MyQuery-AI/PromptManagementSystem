"use client";

import { useState, useTransition } from "react";
import {
  Shield,
  Users,
  Download,
  FileText,
  Loader2,
  User as UserIcon,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAllUsers } from "@/actions/user-actions/user-data";
import {
  getUserAllPermissions,
  syncAllUsersPermissions,
} from "@/actions/user-actions/permission-grants";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/permissions-config";
import type { User } from "@/types/user";

interface PermissionAuditData {
  user: User;
  allPermissions: string[];
  rolePermissions: string[];
  individualPermissions: string[];
  revokedPermissions: string[];
  missingPermissions: string[];
  extraPermissions: string[];
  lastUpdated?: string;
}

export function PermissionAudit() {
  const [isOpen, setIsOpen] = useState(false);
  const [auditData, setAuditData] = useState<PermissionAuditData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const runAudit = async () => {
    setIsLoading(true);
    try {
      // Get all users
      const users = await getAllUsers();

      const auditResults = await Promise.all(
        users.map(async (user) => {
          try {
            const permissions = await getUserAllPermissions(user.id);

            // Calculate expected permissions for the user's role
            const expectedPermissions =
              user.role === "Owner"
                ? (Object.values(PERMISSIONS) as string[])
                : ([...(ROLE_PERMISSIONS[user.role] || [])] as string[]);

            // Find missing and extra permissions
            const missingPermissions = expectedPermissions.filter(
              (perm) => !permissions.allPermissions.includes(perm as any)
            );

            const extraPermissions = permissions.individualPermissions.filter(
              (perm) => !expectedPermissions.includes(perm as string)
            );

            return {
              user,
              allPermissions: permissions.allPermissions as string[],
              rolePermissions: [...permissions.rolePermissions] as string[],
              individualPermissions:
                permissions.individualPermissions as string[],
              revokedPermissions: permissions.revokedPermissions as string[],
              missingPermissions,
              extraPermissions: extraPermissions as string[],
              lastUpdated: new Date().toISOString(),
            };
          } catch (error) {
            console.error(`Failed to audit user ${user.id}:`, error);
            return {
              user,
              allPermissions: [],
              rolePermissions: [],
              individualPermissions: [],
              revokedPermissions: [],
              missingPermissions: [],
              extraPermissions: [],
              lastUpdated: new Date().toISOString(),
            };
          }
        })
      );

      setAuditData(auditResults);
    } catch (error) {
      console.error("Failed to run permission audit:", error);
      alert("Failed to run permission audit");
    } finally {
      setIsLoading(false);
    }
  };

  const syncPermissions = async () => {
    setIsLoading(true);
    try {
      console.log("Starting permission sync...");
      const result = await syncAllUsersPermissions(false); // Don't remove extra permissions by default
      console.log("Sync result:", result);

      if (result.success) {
        const totalGranted = result.results.reduce(
          (sum, r) =>
            sum +
            ("results" in r && r.results ? r.results.granted?.length || 0 : 0),
          0
        );
        const totalRevoked = result.results.reduce(
          (sum, r) =>
            sum +
            ("results" in r && r.results ? r.results.revoked?.length || 0 : 0),
          0
        );

        alert(
          `Sync completed!\n` +
            `Users processed: ${result.results.length}\n` +
            `Permissions granted: ${totalGranted}\n` +
            `Permissions revoked: ${totalRevoked}`
        );

        // Re-run audit to show updated results
        await runAudit();
      } else {
        alert("Failed to sync permissions");
      }
    } catch (error) {
      console.error("Failed to sync permissions:", error);
      alert("Failed to sync permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const exportAudit = () => {
    const csvContent = [
      ["User ID", "Email", "Name", "Role", "Total Permissions", "Last Updated"],
      ...auditData.map((item) => [
        item.user.id,
        item.user.email,
        item.user.name || "N/A",
        item.user.role,
        item.allPermissions.length.toString(),
        item.lastUpdated || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `permission-audit-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Owner":
        return "destructive";
      case "Admin":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="justify-start w-full">
          <Shield className="mr-2 w-4 h-4" />
          Permission Audit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 w-5 h-5" />
            Permission Audit Report
          </DialogTitle>
          <DialogDescription>
            Review all user permissions and identify potential security issues
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Audit Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                onClick={runAudit}
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 w-4 h-4" />
                )}
                {isLoading ? "Running Audit..." : "Run Audit"}
              </Button>

              <Button
                onClick={syncPermissions}
                disabled={isLoading}
                variant="secondary"
                className="flex items-center"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="mr-2 w-4 h-4" />
                )}
                {isLoading ? "Syncing..." : "Sync with Roles"}
              </Button>

              {auditData.length > 0 && (
                <Button
                  variant="outline"
                  onClick={exportAudit}
                  className="flex items-center"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Export CSV
                </Button>
              )}
            </div>

            {auditData.length > 0 && (
              <div className="text-muted-foreground text-sm">
                Last audit: {new Date().toLocaleString()}
              </div>
            )}
          </div>

          {/* Audit Summary */}
          {auditData.length > 0 && (
            <div className="gap-4 grid grid-cols-1 md:grid-cols-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-2xl">{auditData.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Users with Missing Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-amber-600 text-2xl">
                    {
                      auditData.filter(
                        (item) => item.missingPermissions.length > 0
                      ).length
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Users with Extra Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-blue-600 text-2xl">
                    {
                      auditData.filter(
                        (item) => item.extraPermissions.length > 0
                      ).length
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Users with Revoked Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-red-600 text-2xl">
                    {
                      auditData.filter(
                        (item) => item.revokedPermissions.length > 0
                      ).length
                    }
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-purple-600 text-2xl">
                    {
                      auditData.filter((item) => item.user.role === "Owner")
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Audit Results Table */}
          {auditData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Audit Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Total Permissions</TableHead>
                      <TableHead>Missing</TableHead>
                      <TableHead>Extra</TableHead>
                      <TableHead>Revoked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditData.map((item) => (
                      <TableRow key={item.user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <UserIcon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">
                                {item.user.name || "No name"}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {item.user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(item.user.role)}>
                            {item.user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.allPermissions.length}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.missingPermissions.length > 0 ? (
                            <Badge variant="destructive">
                              {item.missingPermissions.length}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600">
                              0
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.extraPermissions.length > 0 ? (
                            <Badge variant="secondary">
                              {item.extraPermissions.length}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600">
                              0
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.revokedPermissions.length > 0 ? (
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-800"
                            >
                              {item.revokedPermissions.length}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600">
                              0
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {auditData.length === 0 && !isLoading && (
            <Card>
              <CardContent className="flex flex-col justify-center items-center py-12">
                <Shield className="mb-4 w-12 h-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold text-lg">No audit data</h3>
                <p className="mb-4 text-muted-foreground text-center">
                  Click "Run Audit" to analyze all user permissions and identify
                  potential security issues.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
