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
  let mongoPipeline: any = pipeline;

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
    mongoPipeline = [...mongoPipeline, { $match: { $and: filterArr } }];
  }

  if (search) {
    let query = ["description", "title", "category", "author"].map((ele) => {
      return { [ele]: { $regex: search, $options: "i" } };
    });
    mongoPipeline = [...mongoPipeline, { $match: { $or: query } }];
  }
  const limitsize = 5;
  const skippage = (page - 1) * limitsize;
  if (page == undefined) page = 1;
  if (page == 1) {
    mongoPipeline = [...mongoPipeline, { $limit: limitsize }];
  } else {
    mongoPipeline = [...mongoPipeline, { $skip: skippage }];
  }
  const countBooks = await bookModel.aggregate(mongoPipeline);
  // console.log(countBooks.length);
  const allBooks = (await bookModel
    .aggregate(mongoPipeline)
    .limit(limitsize)) as booksInterface[];
  return {
    allBooks,
    page: `${page}/${Math.ceil(countBooks.length / limitsize)}`,
    tip: MSGS.page_tip,
  };
};
