import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async (context) => {
  // todo: print out the cookie from FE
  // todo: crud the todos
  // todo: validate the access token

  const ac = context.cookies.get("access_token")?.value;
  console.log(ac);
  // context.cookies.set("access_token", {
  //   // Match the original cookie settings
  //   path: "/",
  //   secure: true,
  //   sameSite: "strict",
  // });

  console.log("hallo");
  return new Response(`<mark>hallo</mark>`, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
