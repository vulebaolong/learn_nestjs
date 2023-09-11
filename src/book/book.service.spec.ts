import { Test, TestingModule } from "@nestjs/testing";
import { BookService } from "./book.service";
import { getModelToken } from "@nestjs/mongoose";
import { Book, Category } from "./schemas/book.schema";
import mongoose, { Model } from "mongoose";
import { BadRequestException, NotFoundException } from "@nestjs/common";

// khởi tạo một describe block bằng cách gọi describe. Describe block này chứa tất cả các bài kiểm tra liên quan đến BookService.
describe("CatsController", () => {
    // khai báo biến bookService (đối tượng BookService sẽ được kiểm tra)
    let bookService: BookService;

    // khai báo biến model (đối tượng Model<Book> liên quan đến Book)
    let model: Model<Book>;

    // định nghĩa một đối tượng mockBook để sử dụng trong các bài kiểm tra. Đây là một ví dụ của một cuốn sách giả định.
    const mockBook = {
        _id: "64fc9de39f3426cb40dd927a",
        title: "book4",
        description: "description book 1",
        author: "author book 1",
        category: Category.FANTASY,
        user: "64fc8bcd267c60df8688cac9",
    };

    /**
     * định nghĩa một đối tượng mockBookService để sử dụng thay thế cho đối tượng getModelToken(Book.name)
     * trong việc cung cấp dịch vụ BookService cho module kiểm tra.
     */
    const mockBookService = {
        findById: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(async () => {
        /**
         * tạo một module kiểm tra sử dụng Test.createTestingModule và cung cấp các providers cần thiết.
         * Trong trường hợp này, bạn cung cấp BookService và cung cấp mockBookService thay thế cho Model của Book.
         * Module này sẽ được sử dụng cho tất cả các bài kiểm tra trong describe block.
         */
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService,
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookService,
                },
            ],
        }).compile();

        /**
         * sử dụng module.get để nhận các instances của BookService và Model<Book> đã được cung cấp trong module kiểm tra.
         * Điều này sẽ tạo ra bookService và model bạn cần cho các bài kiểm tra.
         */
        bookService = module.get<BookService>(BookService);
        model = module.get<Model<Book>>(getModelToken(Book.name));
    });

    /**
     * bắt đầu mô tả các bài kiểm tra bằng cách sử dụng describe hoặc it.
     * Trong trường hợp này, bạn đang mô tả bài kiểm tra cho phương thức findById của BookService.
     */
    describe("findById", () => {
        /**
         * bài kiểm tra "should find and return a book by id",
         * bạn sử dụng jest.spyOn để giả lập phương thức findById của model để trả về giá trị mockBook.
         * Sau đó, bạn gọi bookService.findById và kiểm tra xem nó trả về giá trị mong đợi mockBook hay không.
         */
        it("should find and return a book by id", async () => {
            jest.spyOn(model, "findById").mockResolvedValue(mockBook);

            const result = await bookService.findById(mockBook._id);

            expect(model.findById).toHaveBeenCalledWith(mockBook._id);
            expect(result).toEqual(mockBook);
        });

        /**
         * bài kiểm tra "should throw BadRequestException if invalid ID is provided",
         * bạn truyền một ID không hợp lệ và kiểm tra xem bookService.findById có ném ra một BadRequestException như mong đợi hay không.
         * Bạn cũng sử dụng jest.spyOn để giả lập hàm mongoose.isValidObjectId để trả về false cho ID không hợp lệ.
         */
        it("should throw BadRequestException if invalid ID is provided", async () => {
            const id = "invalid-id";

            const isValidObjectIdMock = jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(false);

            await expect(bookService.findById(id)).rejects.toThrow(BadRequestException);

            expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
            isValidObjectIdMock.mockRestore();
        });

        /**
         * bài kiểm tra "should throw NotFoundException if book is not found",
         * bạn giả lập model.findById để trả về null và sau đó kiểm tra xem bookService.findById có ném ra một NotFoundException như mong đợi hay không.
         */
        it("should throw NotFoundException if book is not found", async () => {
            jest.spyOn(model, "findById").mockResolvedValue(null);

            await expect(bookService.findById(mockBook._id)).rejects.toThrow(NotFoundException);

            expect(model.findById).toHaveBeenCalledWith(mockBook._id);
        });
    });

    describe("findAll", () => {
        it("should return an array of book", async () => {
            const query = { page: "1", keyword: "test" };

            jest.spyOn(model, "find").mockImplementation(
                () =>
                    ({
                        limit: () => ({
                            skip: jest.fn().mockResolvedValue([mockBook]),
                        }),
                    }) as any
            );

            const result = await bookService.findAll(query);

            expect(model.find).toHaveBeenCalledWith({
                title: {
                    $regex: "test",
                    $options: "i",
                },
            });

            expect(result).toEqual([mockBook]);
        });
    });
});
