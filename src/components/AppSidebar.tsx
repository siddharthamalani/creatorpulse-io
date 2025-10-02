import { Home, Users, FileText, FolderKanban, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home, description: "Landing Page for Users" },
  { title: "Creators", url: "/creators", icon: Users, description: "Discovery Page" },
  { title: "Content Library", url: "/content", icon: FileText, description: "Discover Trends among creators" },
  { title: "Projects", url: "/projects", icon: FolderKanban, description: "Past Projects" },
  { title: "Settings", url: "/settings", icon: Settings, description: "About Profile & Brand" },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-white/10">
      <SidebarContent className="bg-sidebar">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gradient">InfluencerHub</h1>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-6">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-6 py-3 transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {open && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
