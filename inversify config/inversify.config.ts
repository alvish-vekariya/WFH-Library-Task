import { Container } from "inversify";
import { userServices } from "../services/users.services";
import { categoryService } from "../services/category.services";
import { authorService } from "../services/author.services";
import { bookService } from "../services/book.services";
import { authMiddleWare } from "../middleware/checklogin.middleware";
import { TYPES } from "../constants/types";

const container = new Container();

container.bind<userServices>(TYPES.userServices).to(userServices);
container.bind<categoryService>(TYPES.categoryServices).to(categoryService);
container.bind<authorService>(TYPES.authorServices).to(authorService);
container.bind<bookService>(TYPES.bookServices).to(bookService);
container.bind<authMiddleWare>(authMiddleWare).toSelf();

export default container;