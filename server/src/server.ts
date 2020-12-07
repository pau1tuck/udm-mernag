import "reflect-metadata";
import "dotenv/config.js";
import express from "express";
import { Request, Response } from "express";

import { RedisStore, redisClient } from "./config/redis";
import session from "express-session";

import { createConnection, Connection } from "typeorm";
import database from "./config/database";

import { ApolloServer } from "apollo-server-express";
import { Resolver, Query, buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { TrackResolver } from "./resolvers/TrackResolver";

import cors from "cors";
import bodyParser from "body-parser";

const production: boolean = process.env.NODE_ENV === "production";

@Resolver()
class Hello {
    @Query(() => String)
    async hello() {
        return "Hello, Wanker.";
    }
}

const main = async () => {
    const orm: Connection = await createConnection(database);

    const app = express();

    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
                disableTTL: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
                sameSite: "lax",
                secure: production,
            },
            secret: "keyboard cat",
            resave: false,
            saveUninitialized: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [Hello, UserResolver, TrackResolver],
            validate: false,
        }),
        context: ({ req, res }: any) => ({ req, res }),
    });

    // Middleware
    app.use(
        cors({
            origin: "*", // Switch to production domain
            optionsSuccessStatus: 200,
            credentials: true,
        })
    );
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/", (req: Request, res: Response) => {
        res.send("Hello, Bastard!");
    });

    apolloServer.applyMiddleware({ app });

    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}.`);
    });
};
main().catch((err) => {
    console.error(err);
});
