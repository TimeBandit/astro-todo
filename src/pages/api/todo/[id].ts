import type { APIRoute } from "astro";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  let data;
  try {
    data = await request.formData(); // * Blog
  } catch (error) {
    console.log(error);
  }

  console.log("updating id: ", params, data);

  return new Response(null, { status: 200 });
};

export const DELETE: APIRoute = ({ params }) => {
  console.log("deleting id: ", params);
  return new Response(null, { status: 200 });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  let data;
  try {
    data = await request.formData(); // * Blog
  } catch (error) {
    console.log(error);
  }

  console.log("updating id: ", params, data);

  return new Response(null, { status: 200 });
};
