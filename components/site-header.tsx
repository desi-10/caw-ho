"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconLogout } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/member": "Members",
  "/dashboard/attendance": "Attendance",
  "/dashboard/finance": "Finance",
  "/dashboard/sms": "Bulk SMS",
  "/dashboard/user": "Users",
  "/dashboard/profile": "Profile",
};

const pageDescriptions: Record<string, string> = {
  "/dashboard": "Welcome back! Here's what's happening today",
  "/dashboard/member": "Manage your church members and their information",
  "/dashboard/attendance": "Track and monitor attendance records",
  "/dashboard/finance": "Manage financial transactions and reports",
  "/dashboard/sms": "Send bulk SMS to members",
  "/dashboard/user": "Manage users and their permissions",
  "/dashboard/profile": "View and edit your profile information",
};

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Dashboard";
  const pageDescription =
    pageDescriptions[pathname] || "Manage your church community";

  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/");
          window.location.reload();
        },
        onError: (error) => {
          toast.error(error.error.data?.message || "Something went wrong");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 shadow-sm dark:shadow-none dark:border-border/40">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Left Section - Trigger & Title */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200" />
          <Separator orientation="vertical" className="h-6 bg-border/50" />
          <div className="hidden md:flex flex-col">
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              {pageDescription}
            </p>
          </div>
        </div>

        {/* Center Section - Search (Desktop only) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members, transactions..."
              className="w-full pl-10 pr-4 h-10 rounded-lg border-border focus:border-primary focus:ring-primary/20 bg-muted/50"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search Button (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-accent hover:text-accent-foreground rounded-lg"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-accent hover:text-accent-foreground rounded-lg"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-background dark:ring-card" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage
                    src={session?.user?.image || "/avatars/admin.jpg"}
                    alt="Admin"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold">
                    {session?.user?.name?.charAt(0) || "A"}{" "}
                    {session?.user?.name?.split(" ")[1]?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">
                    {session?.user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email || "admin@church.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/profile">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-destructive"
              >
                <IconLogout className="w-4 h-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
