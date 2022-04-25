import { endpoint, success, error } from "@luigiminardim/next-endpoint";

export default endpoint({
  post: {
    handler: async (query, body) => {
      const { foo } = body as { foo: string };
      if (!foo) {
        const invalidFormatCode = 400;
        return error(400, "Missing parameter: foo");
      }
      return success({ bar: "Hello, " + foo });
    },
  },
});
