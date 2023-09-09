import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Book } from "./schemas/book.schema";
import * as mongoose from "mongoose";
import { Query } from "express-serve-static-core";

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async findAll(query: Query): Promise<Book[]> {
        // một trang có bao nhiêu phần tử
        const resPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        const keyword = query.keyword
            ? {
                  title: {
                      $regex: query.keyword,
                      $options: "i",
                  },
              }
            : {};
        if (!query.page) {
            const books = await this.bookModel.find({ ...keyword });
            return books;
        }
        const books = await this.bookModel
            .find({ ...keyword })
            .limit(resPerPage)
            .skip(skip);
        return books;
    }

    async create(book: Book): Promise<Book> {
        const newBook = await this.bookModel.create(book);
        return newBook;
    }

    async findById(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id);
        if (!book) {
            throw new NotFoundException("Book not found!");
        }
        return book;
    }

    async updateById(id: string, book: Book): Promise<Book> {
        const updateBook = await this.bookModel.findOneAndUpdate({ _id: id }, book, { new: true });

        return updateBook;
    }

    async deleteById(id: string): Promise<Book> {
        const deleteBook = await this.bookModel.findByIdAndDelete(id);

        return deleteBook;
    }
}
