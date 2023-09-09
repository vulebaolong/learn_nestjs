import { User } from "../../auth/schemas/user.schemas";
import { Category } from "../schemas/book.schema";
import { IsEmpty, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateBookDto {
    //IsOptional có thể bỏ trống hoặc không bắt buộc phải có giá trị
    @IsOptional()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsString()
    readonly author: string;

    @IsOptional()
    @IsEnum(Category, {message: "Please enter correct category"})
    readonly category: Category;

    @IsEmpty({message: 'You cannot pass user id'})
    readonly user: User;
}