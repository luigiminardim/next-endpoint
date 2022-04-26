import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { MethodHandlerReturn } from "./MethodHandlerReturn";

export type MethodHandler = (
  query: NextApiRequest["query"],
  body: unknown,
  headers: NextApiRequest["headers"],
  _: { req: NextApiRequest; res: NextApiResponse }
) => MethodHandlerReturn | Promise<MethodHandlerReturn>;

export const methodHandlerToNextApiHandler =
  (handler: MethodHandler): NextApiHandler =>
  async (req, res) => {
    const { query, body, headers } = req;
    const result = await handler(query, body, headers, { req, res });
    if (result.type === "success") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.statusCode = result.statusCode;
      res.statusMessage = result.statusMessage;
      res.json(result.data);
    } else {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.statusCode = result.statusCode;
      res.statusMessage = result.message;
      res.send(result.message);
    }
  };
