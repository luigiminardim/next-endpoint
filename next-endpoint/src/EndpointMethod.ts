import type { NextApiHandler } from "next";
import { MethodHandler, methodHandlerToNextApiHandler } from "./MethodHandler";
import { Middleware, applyMiddleWares } from "./Middleware";

export type EndpointMethod = {
  use?: Middleware[];
  handler: MethodHandler;
};

export const endpointMethodToNextHandler =
  (
    endpointMethod: EndpointMethod,
    endpointMiddlewares: Middleware[] = []
  ): NextApiHandler =>
  async (req, res) => {
    const { use: methodMiddlewares = [], handler } = endpointMethod;
    const nextHandler = methodHandlerToNextApiHandler(handler);
    const middlewares = [...endpointMiddlewares, ...methodMiddlewares];
    const resultedMethodHandler = applyMiddleWares(middlewares, nextHandler);
    await resultedMethodHandler(req, res);
  };
