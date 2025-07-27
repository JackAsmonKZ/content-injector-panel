import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import AppsIcon from "@mui/icons-material/Apps";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dashboard, Info } from "@mui/icons-material";

const nav = [
  { label: "Инструкция", icon: <Info />, path: "/" },
  { label: "Кампании", icon: <Dashboard />, path: "/campaigns" },
];

const SidebarMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <Sidebar
        backgroundColor="#ffffff"
        rootStyles={{
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
        collapsed={isCollapsed}
      >
        <Menu
          menuItemStyles={{
            button: {
              [`&.active`]: {
                backgroundColor: "#0080ff",
                color: "#000000",
              },
            },
          }}
        >
          <MenuItem
            style={{
              width: "100%",
              backgroundColor: "#0080ff5e",
              marginBottom: "20px",
            }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={<AppsIcon />}
          ></MenuItem>
          {nav.map(({ label, icon, path }) => (
            <MenuItem key={path} icon={icon} component={<Link to={path} />}>
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Sidebar>
    </>
  );
};

export default SidebarMenu;
