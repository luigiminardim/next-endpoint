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
