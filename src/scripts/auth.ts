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

console.table({ host });

const basePath = `${getProtocol()}://${host}`;
console.log(basePath);

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_m7FgHaaxa",
  client_id: "6481si40mb09htsbsb83liv2io",
  redirect_uri: `${basePath}/todos`,
  response_type: "code",
  scope: "phone openid email",
};

// create a UserManager instance
export const userManager = new UserManager({
  ...cognitoAuthConfig,
});

export async function signOutRedirect() {
  const clientId = "6481si40mb09htsbsb83liv2io";
  const logoutUri = `${basePath}`;
  const cognitoDomain =
    "https://eu-west-2m7fghaaxa.auth.eu-west-2.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
}
