import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../..//auth/schemas/user.schemas";
import mongoose from "mongoose";

export enum Category {
    ADVENTURE = "Adventure",
    CLASSICS = "classics",
    CRIME = "Crime",
    FANTASY = "Fantasy",
}

@Schema({
    timestamps: true,
    collection: "books",
})
export class Book {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    author: string;

    @Prop()
    category: Category;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
}

export const BooksSchema = SchemaFactory.createForClass(Book);
