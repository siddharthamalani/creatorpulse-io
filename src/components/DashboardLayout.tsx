import { Menu } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 backdrop-blur-xl px-4 md:px-6">
          <SidebarTrigger className="text-foreground">
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[100vw] overflow-x-hidden">
          {children}
        </main>
      </div>
      </div>
    </SidebarProvider>
  );
}
