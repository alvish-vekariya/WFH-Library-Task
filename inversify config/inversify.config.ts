import { Container } from "inversify";
import { userServices } from "../services/users.services";
import { categoryService } from "../services/category.services";
import { authorService } from "../services/author.services";
import { bookService } from "../services/book.services";
import { authMiddleWare } from "../middleware/checklogin.middleware";

const container = new Container();

container.bind<userServices>('userServices').to(userServices);
container.bind<categoryService>('categoryServices').to(categoryService);
container.bind<authorService>('authorServices').to(authorService);
container.bind<bookService>('bookServices').to(bookService);
container.bind<authMiddleWare>(authMiddleWare).toSelf();

export default container;