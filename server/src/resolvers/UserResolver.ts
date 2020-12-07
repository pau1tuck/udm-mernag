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
import { User } from "../entities/User";
import { IContext } from "../config/types";
import { isAdmin } from "../utils/permissions";

@Resolver(User)
export class UserResolver {
    @Query(() => [User])
    @UseMiddleware(isAdmin)
    async Users(): Promise<User[]> {
        return await User.find();
    }

    @Query(() => User, { nullable: true })
    Me(@Ctx() { req }: IContext) {
        // you are not logged in
        if (!req.session.userId) {
            return null;
        }
        return User.findOne(req.session.userId);
    }

    @Mutation(() => Boolean)
    async Register(
        @Arg("firstName") firstName: string,
        @Arg("lastName") lastName: string,
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("isAdmin") isAdmin: boolean
    ) {
        const hashedPassword = await hash(password, 13);
        // let user = null;
        try {
            await User.insert({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                isAdmin,
            });
        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }

    @Mutation(() => User, { nullable: true })
    async Login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() ctx: IContext
    ): Promise<User | null> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("User not registered");
        }

        const verify = await compare(password, user.password);

        if (!verify) {
            throw new Error("Incorrect password");
        }

        ctx.req.session!.userId = user.id;
        ctx.req.session!.isAdmin = user.isAdmin;

        return user;
    }
}
