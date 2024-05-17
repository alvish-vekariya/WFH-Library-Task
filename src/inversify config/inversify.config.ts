import { Container } from "inversify";
import {
  userServices,
  categoryService,
  authorService,
  bookService,
} from "../services";
import { authMiddleWare } from "../middleware";
import { TYPES } from "../constants/types";
import { customError } from "../handlers";

const container = new Container();

container.bind<userServices>(TYPES.userServices).to(userServices);
container.bind<categoryService>(TYPES.categoryServices).to(categoryService);
container.bind<authorService>(TYPES.authorServices).to(authorService);
container.bind<bookService>(TYPES.bookServices).to(bookService);
container.bind<authMiddleWare>(TYPES.authMiddleWare).to(authMiddleWare);
container.bind<customError>(TYPES.customError).to(customError);

export default container;
