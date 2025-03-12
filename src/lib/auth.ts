import { Log, UserManager } from "oidc-client-ts";

Log.setLogger(console);

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
const userManager = new UserManager({
  ...cognitoAuthConfig,
  automaticSilentRenew: true, // the token won't automatically renew
});

const signOutRedirect = () => {
  const logoutUri = `${basePath}`;
  const cognitoDomain =
    "https://eu-west-2m7fghaaxa.auth.eu-west-2.amazoncognito.com";

  window.location.href = `${cognitoDomain}/logout?client_id=${client_id}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
};

const serverLogin = async (
  accessToken: string,
  idToken: string = "",
  expiresIn: number = 3600
) => {
  try {
    await fetch("/api/auth/login", {
      headers: {
        Authentication: `Bearer ${accessToken}`,
        Authorization: `Bearer ${idToken}`,
        Ttl: expiresIn.toString(),
      },
      credentials: "same-origin",
    });
  } catch (e) {
    console.error("Login failed 🔥", e);
  }
};

userManager.events.addUserLoaded(async () => {
  console.log("running addUserLoaded event");
  const user = await userManager.getUser();
  if (user) {
    const { id_token, access_token } = user;
    if (id_token && access_token) {
      await serverLogin(access_token, id_token);
    }
  }
});

export { serverLogin, signOutRedirect, userManager };
