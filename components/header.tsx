import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Settings, Shield, Mail, Calendar } from "lucide-react";

export async function Header() {
  const session = await auth();

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to format date
  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b">
      <div className="flex justify-between items-center px-4 h-16 container">
        <div className="flex items-center space-x-4">
          <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-transparent text-2xl tracking-tight">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative hover:bg-muted/50 px-3 rounded-full w-auto h-10"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white text-sm">
                        {session.user.name
                          ? getUserInitials(session.user.name)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start text-left">
                      <span className="font-medium text-foreground text-sm">
                        {session.user.name || "User"}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white">
                        {session.user.name
                          ? getUserInitials(session.user.name)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-foreground">
                          {session.user.name || "User"}
                        </span>
                        {session.user.emailVerifiedBoolean && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 hover:bg-green-100 px-2 h-5 text-green-800"
                          >
                            <Shield className="mr-1 w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                        <Mail className="w-3 h-3" />
                        <span>{session.user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                        <User className="w-3 h-3" />
                        <span>ID: {session.user.id}</span>
                      </div>
                      {session.user.emailVerified && (
                        <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Verified: {formatDate(session.user.emailVerified)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 w-4 h-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/login" });
                    }}
                    className="w-full"
                  >
                    <button
                      type="submit"
                      className="flex items-center w-full text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      <LogOut className="mr-2 w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default">
              <a href="/login">Sign In</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
