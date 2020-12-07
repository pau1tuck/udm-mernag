import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Track } from "../entities/Track";
import { User } from "../entities/User";
import { isAuthenticated } from "../utils/authentication";
import { IContext } from "../config/types";

@Resolver()
export class HelloResolver {
    @Query(() => String)
    async hello() {
        return "Hello, Wanker.";
    }
}
