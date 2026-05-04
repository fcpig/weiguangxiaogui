import type { AuthProvider } from "@refinedev/core";
import { insforge } from "./insforge";
import { TOKEN_KEY, DEFAULT_PASSWORD } from "./constants";

interface User {
  id: string;
  phone: string;
  name: string;
  user_type: "admin" | "merchant" | "vulnerable";
  merchant_id?: string;
}

export const authProvider: AuthProvider = {
  login: async ({ phone, password }) => {
    let connectionError = false;
    const { data: users, error } = await insforge.database
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !users) {
      connectionError = true;
    }

    if (connectionError || users?.status !== "active") {
      throw new Error("账号/密码有误");
    }

    if (password !== "123456") {
      throw new Error("账号/密码有误");
    }

    if (users.user_type === "vulnerable") {
      throw new Error("账号/密码有误");
    }

    if (users.user_type === "merchant") {
      const { data: merchantUsers } = await insforge.database
        .from("merchant_users")
        .select("merchant_id, is_active")
        .eq("user_id", users.id)
        .eq("is_active", true)
        .single();

      if (!merchantUsers) {
        throw new Error("账号/密码有误");
      }

      const { data: merchant } = await insforge.database
        .from("merchants")
        .select("status")
        .eq("id", merchantUsers.merchant_id)
        .single();

      if (!merchant || merchant.status !== "active") {
        throw new Error("账号/密码有误");
      }

      localStorage.setItem(
        TOKEN_KEY,
        JSON.stringify({
          id: users.id,
          phone: users.phone,
          name: users.name,
          user_type: "merchant",
          merchant_id: merchantUsers.merchant_id,
        })
      );

      return {
        success: true,
        redirectTo: "/enterprise",
      };
    }

    if (users.user_type === "admin") {
      localStorage.setItem(
        TOKEN_KEY,
        JSON.stringify({
          id: users.id,
          phone: users.phone,
          name: users.name,
          user_type: "admin",
        })
      );

      return {
        success: true,
        redirectTo: "/government",
      };
    }

    throw new Error("账号/密码有误");
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.clear();
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const user = JSON.parse(token) as User;
      return user.user_type;
    }
    return null;
  },

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const user = JSON.parse(token) as User;
      return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        userType: user.user_type,
        merchantId: user.merchant_id,
      };
    }
    return null;
  },

  onError: async (error) => {
    if (error.statusCode === 401) {
      return {
        logout: true,
        redirectTo: "/login",
      };
    }
    return { error };
  },
};

export type { User };
