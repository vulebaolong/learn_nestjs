import { IsNotEmpty, IsString, IsEnum, IsEmpty } from "class-validator";
import { Category } from "../schemas/book.schema";
import { User } from "../../auth/schemas/user.schemas";

export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly author: string;

    @IsNotEmpty()
    @IsEnum(Category, {message: "Please enter correct category"})
    readonly category: Category;

    @IsEmpty({message: 'You cannot pass user id'})
    readonly user: User;
}
