import React, { useState } from "react";
import NavBar from './navBar.jsx';
import DynamicSidebar from "./../reusable elements/SideBarRuseable";
import sideBarData from "./../data/sideBar.json";
import useAuthStore from "./../store/store"; // Import logout logic
import "./../pages/dashboard.css";

export default function Dashboard() {
  const { logout } = useAuthStore(); // Access logout function
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div>
      <NavBar onSidebarToggle={handleSidebarToggle} />
      <DynamicSidebar
        fetchUrl={sideBarData}
        onLogout={() => {
          logout();
          window.location.href = "/"; // Redirect to login
        }}
        sidebarClassName={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}
        menuItemClassName="menu-item"
        menuItemHoverClassName="menu-item-hover"
        logoutClassName="logout"
      />
    
      <div className={`dashboard-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        {/* Dashboard content goes here */}
      </div>
    </div>
  );
}
