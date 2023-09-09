import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
const port = process.env.PORT || 3002;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(port);
    console.log(`Lắng nghe cổng http://localhost:${port} ...`);
}
bootstrap();
