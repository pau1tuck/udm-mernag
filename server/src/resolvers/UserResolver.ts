import { Request } from "express";
import {
    Resolver,
    Query,
    Mutation,
    Arg,
    ObjectType,
    Field,
    UseMiddleware,
    Ctx,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "../entities/User";
import { IContext } from "../config/types";
import { isAuthenticated } from "../utils/isAuthenticated";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken!: string;
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    async getUsers() {
        return await User.find();
    }

    @Query(() => String)
    @UseMiddleware(isAuthenticated)
    async Me(@Ctx() { payload }: IContext) {
        return `User ID: ${payload!.userId}`;
    }

    @Mutation(() => Boolean)
    async Register(
        @Arg("firstName") firstName: string,
        @Arg("lastName") lastName: string,
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const hashedPassword = await hash(password, 13);
        // let user = null;
        try {
            await User.insert({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    @Mutation(() => LoginResponse)
    async Login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { req }: IContext
    ) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Email not registered");
        }

        const verify = compare(password, user.password);

        if (!verify) {
            throw new Error("Incorrect password");
        }

        req.session!.userId = user.id;

        return {
            accessToken: sign({ userId: user.id }, "MySecretKey", {
                expiresIn: "15m",
                algorithm: "RS256",
            }),
        };
    }
}
