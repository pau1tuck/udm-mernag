import {
    Resolver,
    Query,
    Mutation,
    Arg,
    ObjectType,
    Field,
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entities/User";

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
        @Arg("password") password: string
    ) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Email not registered");
        }

        const verify = compare(password, user.password);

        if (!verify) {
            throw new Error("Incorrect password");
        }

        return {
            accessToken: "jhfksjhdk",
        };
    }
}
