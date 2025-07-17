const config = require('./config.json');
const {
  checkAvailabilityStatus,
  returnBook
} = require('./libraryUtils.cjs');

const { books, users, borrowLimit,defaultUserData } = config;

const listBooks = (books) =>
  books
    .filter(book => book.available)
    .map(({ id, title, author, name }) => `${id}. ${title} by ${author}`);

const isUserEligible = (userName, bookTitle, users, books) => {
  const user = users[userName];
 
  return user.borrowed.length < borrowLimit
    ? checkAvailabilityStatus(bookTitle, userName, users, books)
    : "User not eligible to borrow a book.";
};


const searchBooks = () =>
  books.map(book => `${book.id}. ${book.title} by ${book.author}`);


const createNewUser = (user) => (
  users[user] = { ...defaultUserData },
  `User ${user} registered.`
);

const registerUser = (user) =>
  users[user]
    ? "User already exists."
    : createNewUser(user);


console.log(registerUser("bob"));
console.log(listBooks(books));
console.log(isUserEligible("alice", "The Great Gatsby", users, books));
console.log(returnBook("alice", "JS Basics", users, books));
console.log(searchBooks("orwell"));
