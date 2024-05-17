export let pipeline = [
  {
    $lookup: {
      from: "authors",
      localField: "author",
      foreignField: "_id",
      as: "author",
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  },
  {
    $unwind: {
      path: "$author",
    },
  },
  {
    $unwind: {
      path: "$category",
    },
  },
  {
    $project: {
      _id: 1,
      description: "$description",
      title: "$title",
      price: "$price",
      category: "$category.category",
      author: "$author.authorName",
    },
  },
];
