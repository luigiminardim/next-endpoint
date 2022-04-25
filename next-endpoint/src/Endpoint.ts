import type { NextApiHandler } from "next";
import { EndpointMethod, endpointMethodToNextHandler } from "./EndpointMethod";
import { error } from "./MethodHandlerReturn";
import type { Middleware } from "./Middleware";

export type Endpoint = {
  use?: Middleware[];
  delete?: EndpointMethod;
  get?: EndpointMethod;
  head?: EndpointMethod;
  options?: EndpointMethod;
  patch?: EndpointMethod;
  post?: EndpointMethod;
  put?: EndpointMethod;
};

export const endpoint = (endpointDef: Endpoint): NextApiHandler => {
  const methodDefs: Record<string, EndpointMethod | undefined> = {
    delete: endpointDef.delete,
    get: endpointDef.get,
    head: endpointDef.head,
    options: endpointDef.options,
    patch: endpointDef.patch,
    post: endpointDef.post,
    put: endpointDef.put,
  };
  const allowedMethods = Object.entries(methodDefs)
    .filter(([method, methodDef]) => !!methodDef)
    .map(([method, methodDef]) => method)
    .map((method) => method.toUpperCase());
  const notAllowedMethodDef: EndpointMethod = {
    use: [
      (req, res, next) => {
        res.setHeader("Allow", allowedMethods);
        next();
      },
    ],
    handler: () => {
      return error(505, "Method not allowed");
    },
  };

  return async (req, res) => {
    const method = req.method?.toLocaleLowerCase() ?? "get";
    const methodDef = methodDefs[method] ?? notAllowedMethodDef;
    const nextHandler = endpointMethodToNextHandler(methodDef, endpointDef.use);
    await nextHandler(req, res);
  };
};
