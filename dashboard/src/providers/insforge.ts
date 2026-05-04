import { createClient } from "@insforge/sdk";
import { INSFORGE_URL, INSFORGE_ANON_KEY } from "./constants";

export const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY,
});
