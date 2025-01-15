import { atom } from "nanostores";
import { User } from "oidc-client-ts";

export const $user = atom<User | undefined>();
