import { ObjectType, Field, Int } from "type-graphql";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    OneToMany,
} from "typeorm";
@ObjectType()
@Entity()
export class Track extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    artist!: string;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column({ nullable: true })
    version?: string;

    @Field()
    @Column()
    label!: string;

    @Field()
    @Column()
    youTubeId!: string;

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
    points!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: Date;
}
