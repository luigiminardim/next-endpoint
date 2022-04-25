import { endpoint, success, error } from "@luigiminardim/next-endpoint";

type Query = { bar: string };

export default endpoint({
  get: {
    handler: (query) => {
      const { bar } = query as Query;
      return success({ message: "Hello, " + bar });
    },
  },

  // The `req` and `res` objects are arguments of the handler function.
  post: {
    handler: async (query, body, headers, { req, res }) => {
      const { foo } = body as { foo: string };
      return success({ message: "Hello, " + foo });
    },
  },
});
