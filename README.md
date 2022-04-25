# Next-Controller

Elegant API/MVC controller wrapper for Next.js framework.

## Why Using This Package?

Next.js is an awesome framework, however it provides a primitive way to write
API backend logics via a single function. It's simpler, but headache, we'll have
to write all logics inside one single function, and handing all possible HTTP
request methods, it might not be annoying at first, be it can be a real
drawback when our program becomes big.

Hence, `next-endpoint` is meant to solve this problem, it provides an elegant
wrapper that allows us writing our backend code in a more traditional MVC
controller way, and provides straight forward support of middleware, which is
fully compatible with the Express ecosystem, meaning we can use Express
middleware directly in a Next.js program.

> This package is most inspired by the
> [next-controller](https://www.npmjs.com/package/next-controller).
> But it avoids the usage of object-oriented programming, and discards the usage of decorators.

## Install

### NPM

```sh
npm i next-endpoint
```

### YARN

```sh
yarn add endpoint
````

## Example

Just like usual, will create a TypeScript file in the `pages/api` directory, and exports a default
function, but this time, we'll use `endpoint` from `next-endpoint` to wrap the function.

```ts
// pages/api/[bar].ts
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

```

> The default Next.js server patches route params directly to the `query` object.

## Middleware Support

In an endpoint, we can use the `use` params to bind middleware. For example:

```ts
// pages/api/hello.ts
import {
  endpoint,
  success,
  error,
  Middleware,
} from "@luigiminardim/next-endpoint";
import corsMiddleware from "cors";
import { NextApiRequest, NextApiResponse } from "next";

const customMiddleware: Middleware = async (req, res, next) => {
  const custom =
    req.headers["x-custom-header"] ?? "not founded: x-custom-header";
  res.setHeader("x-custom-header", custom);
  next();
};

export default endpoint({
  get: {
    use: [corsMiddleware(), customMiddleware],
    handler: (query) => {
      return success("Hello World!");
    },
  },
});
```

## Erros

We can directly return an error from an endpoint using `return error(...)` and the library will
automatically report the exception to the client.

```ts
// pages/api/error.ts
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

```
