import { UserManager } from "oidc-client-ts";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_m7FgHaaxa",
  client_id: "6481si40mb09htsbsb83liv2io",
  redirect_uri: "https://astrotodos.netlify.app/todos",
  response_type: "code",
  scope: "phone openid email",
};

// create a UserManager instance
export const userManager = new UserManager({
  ...cognitoAuthConfig,
});

export async function signOutRedirect() {
  const clientId = "6481si40mb09htsbsb83liv2io";
  const logoutUri = "https://astrotodos.netlify.app";
  const cognitoDomain =
    "https://eu-west-2m7fghaaxa.auth.eu-west-2.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
}
