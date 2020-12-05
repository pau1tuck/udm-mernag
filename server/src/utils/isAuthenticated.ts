import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { IContext } from "../config/types";

//format like bearer 21321n2bmbbj

export const isAuthenticated: MiddlewareFn<IContext> = (
    { context }: any,
    next
) => {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
        throw new Error("User not authenticated");
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, "MySecretKey");
        console.log(payload);
        context.payload = payload as any;
    } catch (err) {
        console.log(err);
        throw new Error("User not authenticated");
    }
    return next();
};
