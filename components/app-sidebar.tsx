"use client";

import type * as React from "react";

import {
  CalendarCheck,
  Home,
  Users,
  Wallet,
  MessageSquare,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Members",
      url: "/dashboard/member",
      icon: Users,
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: CalendarCheck,
    },
    {
      title: "Finance",
      url: "/dashboard/finance",
      icon: Wallet,
    },
    {
      title: "Bulk SMS",
      url: "/dashboard/sms",
      icon: MessageSquare,
    },
    {
      title: "Users",
      url: "/dashboard/user",
      icon: Users,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="border-r border-border/50 bg-sidebar"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-border/50 p-6 bg-gradient-to-br from-muted/30 via-sidebar to-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition-all duration-300" />
                {/* Logo */}
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 p-2 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain filter brightness-0 invert"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-sidebar-foreground group-hover:text-primary transition-colors duration-200">
                  Christ Assembly
                </span>
                <span className="text-center text-sidebar-foreground font-medium">
                  Worldwide
                </span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-3 py-6">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Footer with User */}
      {/* <SidebarFooter className="border-t border-border/50 p-4 bg-gradient-to-t from-gray-50/50 via-white to-white">
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
