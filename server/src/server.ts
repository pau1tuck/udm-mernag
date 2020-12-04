import "dotenv/config.js";
import "reflect-metadata";
import cors from "cors";
import express from "express";
import { Request, Response } from "express";
import session from "express-session";
import { createConnection, Connection } from "typeorm";
import bodyParser from "body-parser";
import path from "path";

const env: string = process.env.NODE_ENV || "development";
const PORT: any = process.env.PORT;

const main = async () => {
    const db: Connection = await createConnection({
        type: "postgres",
        url: process.env.DB_URI,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: true,
        ssl: true,
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
        entities: ["src/entity/**/*.ts"],
        migrations: ["src/migration/**/*.ts"],
        subscribers: ["src/subscriber/**/*.ts"],
    });

    const app = express();

    // Middleware
    app.use(
        cors({
            origin: "*", // Be sure to switch to your production domain
            optionsSuccessStatus: 200,
            credentials: true,
        })
    );
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/", (req: Request, res: Response) => {
        res.send("Hello, Bastard!");
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}.`);
    });
};
main().catch((err) => {
    console.error(err);
});
