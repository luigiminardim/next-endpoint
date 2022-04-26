import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
export type Middleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => unknown
) => void | Promise<void>;

const combineMiddlewares = (middlewares: Middleware[]): Middleware =>
  middlewares.reduceRight(
    (combination, middleware) => async (req, res, next) =>
      await middleware(req, res, async () => await combination(req, res, next)),
    async (req, res, next) => {
      await next();
    }
  );

export const applyMiddleWares = (
  middlewares: Middleware[],
  handler: NextApiHandler
) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const next = async () => await handler(req, res);
    const combination = combineMiddlewares(middlewares);
    await combination(req, res, next);
  };
};
