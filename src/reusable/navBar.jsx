import React, { useState } from "react";
import { Icon } from "@iconify/react";
import useAuthStore from "./../store/store.js";
import "./../pages/dashboard.css";
import Logo from "./../assets/Scopesky Logo.png";

export default function NavBar({ onSidebarToggle }) {
  const { user } = useAuthStore(); // Fetch logged-in user info dynamically
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);

  // Toggle notification dropdown visibility
  const handleNotificationClick = () => {
    setIsNotificationsActive((prev) => !prev);
  };

  return (
    <div className="navbar-container">
      {/* Left Section */}
      <div className="navbar-left">
        <div
          className={`notification ${isNotificationsActive ? "active" : ""}`}
          onClick={handleNotificationClick}
        >
          <Icon icon="material-symbols:notifications" width="30" height="30" />
          <span className="notification-badge"></span>
        </div>
        {isNotificationsActive && (
          <div className="notification-content">
            <p>New notification!</p>
            <p>You have a meeting at 3 PM.</p>
          </div>
        )}
        <div className="user-info">
          <h3>{user?.username || "Guest"}</h3>
          <h4>{user?.role || "Unknown Role"}</h4>
        </div>
        <div className="user-avatar">
          <Icon icon="material-symbols:person" width="45" height="45" />
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <h1>نظام إدارة المكاتب</h1>
        <Icon
          icon="gg:menu"
          width="45"
          height="45"
          onClick={onSidebarToggle}
          style={{ cursor: "pointer" }}
        />
        <img src={Logo} alt="Logo" className="navbar-logo" />
      </div>
    </div>
  );
}
