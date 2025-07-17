const config = require('./config.json');
const {
  checkAvailabilityStatus,
  returnBook
} = require('./libraryUtils.cjs');

const { books, users, borrowLimit,defaultUserData } = config;

const listBooks = (books) =>
  books
    .filter(book => book.available)
    .map(({ id, title, author}) => `${id}. ${title} by ${author}`);

const isUserEligible = (userName, bookTitle, users, books) => {
  const user = users[userName];
 
  return user.borrowed.length < borrowLimit
    ? checkAvailabilityStatus(bookTitle, userName, users, books)
    : "User not eligible to borrow a book.";
};


const searchBooks = (keyword) =>
  books
    .filter(book =>
      book.title.toLowerCase().includes(keyword.toLowerCase()) ||
      book.author.toLowerCase().includes(keyword.toLowerCase())
    )
    .map(book => `${book.id}. ${book.title} by ${book.author}`);

const createNewUser = (user) => (
  users[user] = { ...defaultUserData },
  `User ${user} registered.`
);

const registerUser = (user) =>
  users[user]
    ? "User already exists."
    : createNewUser(user);


console.log("User Registration:",registerUser("bob"));
console.log("Available books:", listBooks(books));
console.log("User Eligibility Check:",isUserEligible("alice", "The Great Gatsby", users, books));
console.log("Book Return Status:",returnBook("alice", "JS Basics", users, books));
console.log("Search all books:",searchBooks("orwell"));
