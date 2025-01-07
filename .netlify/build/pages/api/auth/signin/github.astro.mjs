export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const POST = ({ request }) => {
  console.log("route hit");
  return new Response(
    JSON.stringify({
      todo: "logged in"
    }),
    { status: 200 }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
