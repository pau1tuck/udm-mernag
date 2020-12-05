import "dotenv/config.js";
import "reflect-metadata";
import cors from "cors";
import express from "express";
import { Request, Response } from "express";
import session from "express-session";
import { createConnection, Connection } from "typeorm";
import database from "./config/database";
import bodyParser from "body-parser";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import { Resolver, Query, buildSchema } from "type-graphql";

const dev: boolean = process.env.NODE_ENV === "development";

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

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [Hello],
        }),
        context: ({ req, res }) => ({ req, res }),
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
