import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import PWAInstallPrompt from "@/components/pwa-install-prompt";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset className="bg-gradient-to-b from-background via-background to-muted/20">
        <SiteHeader />
        <div className="flex flex-1 flex-col overflow-auto">
          <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </SidebarInset>
      <PWAInstallPrompt />
    </SidebarProvider>
  );
};

export default DashboardLayout;
