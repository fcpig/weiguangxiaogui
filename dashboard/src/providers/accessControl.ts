import type { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource }) => {
    const userData = localStorage.getItem("refine-auth");
    if (!userData) {
      return { can: false, reason: "未登录" };
    }

    const user = JSON.parse(userData);
    const userType = user.user_type;

    if (userType === "admin") {
      const governmentResources = [
        "dashboard",
        "cabinets",
        "merchants",
        "users",
        "analytics",
        "policies",
        "messages",
        "settings",
        "claim-records",
        "volunteers",
        "suggestions",
      ];
      if (governmentResources.includes(resource || "")) {
        return { can: true };
      }
    }

    if (userType === "merchant") {
      const enterpriseResources = [
        "dashboard",
        "devices",
        "analytics",
        "reports",
        "messages",
        "settings",
      ];
      if (enterpriseResources.includes(resource || "")) {
        return { can: true };
      }
    }

    return { can: false, reason: "无权访问" };
  },
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },
};
