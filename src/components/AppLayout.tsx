import { Box } from "@mui/material";
import type { ReactNode } from "react";
import SidebarMenu from "./SidebarMenu";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => (
  <Box sx={{ display: "flex" }}>
    <SidebarMenu />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      {children}
    </Box>
  </Box>
);

export default AppLayout;
