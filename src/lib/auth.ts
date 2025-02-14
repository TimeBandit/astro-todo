import { UserManager } from "oidc-client-ts";

const getEnv = (key: string) => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const getHost = () => {
  if (import.meta.env.DEV === true) {
    return "localhost:4321";
  }
  return "astrotodos.netlify.app";
};

const getProtocol = () => {
  if (import.meta.env.DEV === true) {
    return "http";
  }
  return "https";
};

const host = getHost();

const basePath = `${getProtocol()}://${host}`;

const client_id = getEnv("PUBLIC_CLIENT_ID");

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_m7FgHaaxa",
  client_id,
  redirect_uri: `${basePath}/signin-callback`,
  response_type: "code",
  scope: "email openid phone profile",
};

// create a UserManager instance
export const userManager = new UserManager({
  ...cognitoAuthConfig,
  automaticSilentRenew: false, // the token won't automatically renew
});

export async function signOutRedirect() {
  const logoutUri = `${basePath}`;
  const cognitoDomain =
    "https://eu-west-2m7fghaaxa.auth.eu-west-2.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${client_id}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
}
