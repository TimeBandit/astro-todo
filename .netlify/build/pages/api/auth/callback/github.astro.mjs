export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  const data = await request.formData();
  const name = data.get("todo");
  if (!name) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields"
      }),
      { status: 400 }
    );
  }
  return new Response(
    JSON.stringify({
      todo: "logged in"
    }),
    { status: 200 }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
