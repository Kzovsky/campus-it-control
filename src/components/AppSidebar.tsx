import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Calendar, 
  Filter,
  ArrowUp,
  ArrowDown
} from "lucide-react";

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

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Calendar },
  { title: "Equipamentos", url: "/equipamentos", icon: Filter },
  { title: "Chamados", url: "/chamados", icon: ArrowUp },
  { title: "Avaliações", url: "/avaliacoes", icon: ArrowDown },
  { title: "Relatórios", url: "/relatorios", icon: Calendar },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isActive 
        ? "bg-primary text-primary-foreground font-medium" 
        : "hover:bg-accent text-foreground"
    }`;

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} bg-sidebar-bg border-r transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar-bg">
        <div className="p-4 border-b border-sidebar-muted">
          <h2 className={`font-bold text-white ${collapsed ? "text-xs text-center" : "text-lg"}`}>
            {collapsed ? "TI" : "Sistema TI"}
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted font-medium">
            {!collapsed && "Menu Principal"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClassName}
                    >
                      <item.icon className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
                      {!collapsed && <span className="text-white">{item.title}</span>}
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