import "reflect-metadata";
import { bookModel } from "../models/books.model";
import { booksInterface } from "../interfaces";
import { MSGS } from "../constants";
import { pipeline } from "../constants";

export const provideData = async function (
  page: any,
  search: any,
  filter: any,
): Promise<object> {
  if (Object.keys(filter).length !== 0) {
    // console.log(filter);
    let filterArr = [];
    for (let i in filter) {
      if (i == "price") {
        filterArr.push({ [i]: { $lt: parseInt(filter[i]) } });
      } else if (filter[i]) {
        filterArr.push({ [i]: { $regex: filter[i], $options: "i" } });
      }
    }
    // console.log(filterArr);
    const mongoPipeline = [...pipeline, { $match: { $and: filterArr } }];
    const foundedBooks = await bookModel.aggregate(mongoPipeline);
    return { foundedBooks };
  }
  if (search) {
    let query = ["description", "title", "category", "author"].map((ele) => {
      return { [ele]: { $regex: search, $options: "i" } };
    });
    const mongoPipeline = [...pipeline, { $match: { $or: query } }];

    const foundedBooks = await bookModel.aggregate(mongoPipeline);

    return { foundedBooks };
  } else {
    const allBooksCount = await bookModel.countDocuments({});
    const length: number = Math.ceil(allBooksCount / 5) as number;

    if (page == undefined || page == 1) {
      const allBook = (await bookModel
        .aggregate(pipeline)
        .limit(5)) as booksInterface[];
      return { allBook, page: `1/${length}`, tip: MSGS.page_tip };
    } else {
      const limitsize = 5;
      const skippage = (page - 1) * limitsize;
      const allBooks = (await bookModel
        .aggregate(pipeline)
        .skip(skippage)
        .limit(5)) as booksInterface[];
      return { allBooks, page: `${page}/${length}`, tip: MSGS.page_tip };
    }
  }
};
