// dummy data
<<<<<<< HEAD
export const books = [];
=======
export const books = [
  {
    id: 1,
    title: "IT",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234567899,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 2,
    title: "The Green Mile",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234555599,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 3,
    title: "IT",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234567899,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 4,
    title: "The Green Mile",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234555599,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 5,
    title: "IT",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234567899,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 6,
    title: "The Green Mile",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234555599,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 7,
    title: "IT",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234567899,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 8,
    title: "The Green Mile",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234555599,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 9,
    title: "IT",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234567899,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 10,
    title: "The Green Mile",
    author: 'aStephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234555599,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 11,
    title: "IT",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234567899,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
  {
    id: 12,
    title: "The Green Mile",
    author: 'Stephen King',
    datePublished: '2021-05-02',
    genre: 'Mystery, Thriller & Suspense',
    ISBN: 1234555599,
    language: 'English',
    isBorrowed: false,
    isDeleted: false,
    ageRecommendation: 'All ages',
  },
];
>>>>>>> c9c6eca050de9428dc21715cae1ffc51f933666b

let id = 1;

export const getBooksId = () => id++;

export const createBook = (data) => {
  const book = {
    id: books.length + 1,
    ...data,
    isBorrowed: false,
    isDeleted: false,
  };

  return book;
};

export const updateBook = (id, isBorrowed) => {
  // 1. Check if book is available in the DB
  // 2. Update isBorrowed value in the DB
  // 3. Write a record in records
};
