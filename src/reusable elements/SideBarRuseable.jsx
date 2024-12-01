import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import useAuthStore from "../store/store.js";


const DynamicSidebar = ({
  fetchUrl,
  onLogout,
  sidebarClassName,
  menuItemClassName,
  menuItemHoverClassName,
  logoutClassName,
  logoutHoverClassName,
}) => {
  const { user } = useAuthStore(); // Access logged-in user's info
  const [roleItems, setRoleItems] = useState([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        if (!user || !user.role) return; // Ensure the user is logged in and has a role
        if (typeof fetchUrl === "string") {
          const response = await fetch(fetchUrl);
          const data = await response.json();
          setRoleItems(data[user.role] || []); // Filter items based on the user's role
        } else if (typeof fetchUrl === "object") {
          setRoleItems(fetchUrl[user.role] || []); // Handle direct JSON object
        } else {
          throw new Error("Invalid fetchUrl format. Must be a URL or JSON object.");
        }
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error.message);
      }
    };

    fetchSidebarData();
  }, [fetchUrl, user]);

  // Common items (always displayed at the bottom)
  const commonItems = [
    { label: "الإعدادات", icon: "material-symbols:settings-outline", path: "/settings" },
    { label: "تسجيل الخروج", icon: "mdi:logout", action: onLogout },
  ];

  return (
    <div
      className={sidebarClassName || "sidebar"}
      dir="rtl"

    >
      <div className="sidebar-top" dir="ltr">
        {roleItems.map((item, index) => (
          <div
            key={index}
            className={menuItemClassName}
            onClick={() => item.path && (window.location.href = item.path)}
            onMouseEnter={(e) => e.target.classList.add(menuItemHoverClassName)}
            onMouseLeave={(e) => e.target.classList.remove(menuItemHoverClassName)}
          >
            <Icon icon={item.icon} width="30" height="30" />
            <h3>{item.label}</h3>
          </div>
        ))}
      </div>
      <div className="sidebar-bottom" dir="ltr">
  {commonItems.map((item, index) => (
    <div
      key={index}
      className={item.label === "تسجيل الخروج" ? logoutClassName : menuItemClassName}
      onClick={() => {
        if (item.action) {
          item.action(); // Call the logout function
        } else if (item.path) {
          window.location.href = item.path; // Navigate to the specified path
        }
      }}
      onMouseEnter={(e) =>
        item.label === "تسجيل الخروج"
          ? e.target.classList.add(logoutHoverClassName)
          : e.target.classList.add(menuItemHoverClassName)
      }
      onMouseLeave={(e) =>
        item.label === "تسجيل الخروج"
          ? e.target.classList.remove(logoutHoverClassName)
          : e.target.classList.remove(menuItemHoverClassName)
      }
    >
      <Icon icon={item.icon} width="24" height="24" />
      <h3>{item.label}</h3>
    </div>
  ))}
</div>

    </div>
  );
};

DynamicSidebar.propTypes = {
  fetchUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired, // URL or JSON object
  onLogout: PropTypes.func.isRequired, // Logout handler
  sidebarClassName: PropTypes.string, // Class name for the sidebar container
  menuItemClassName: PropTypes.string, // Class name for menu items
  menuItemHoverClassName: PropTypes.string, // Hover class for menu items
  logoutClassName: PropTypes.string, // Class name for the logout item
  logoutHoverClassName: PropTypes.string, // Hover class for the logout item
};

export default DynamicSidebar;
