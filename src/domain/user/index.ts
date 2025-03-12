import { signOutRedirect, userManager } from "@/lib/auth";
import type { User } from "oidc-client-ts";

let user: User | null = null;

const getUser = async () => {
  if (user) return user;
  user = await userManager.getUser();
  return user;
};

const signOutUser = async () => {
  signOutRedirect();
};

export { getUser, signOutUser };
