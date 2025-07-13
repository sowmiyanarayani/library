import { readFile } from 'fs/promises';
import { getToday, calculateDueDate, calculateFine } from './dateUtils.mjs';

const config = JSON.parse(await readFile('./config.json', 'utf-8'));
const { books, users, borrowLimit, maximumDays, finePerDay } = config;

const listBooks = () =>
  books
    .filter(book => book.available)
    .map(({ id, title, author }) => `${id}. ${title} by ${author}`);

const updatedCheckOutBook = (user, bookId) => {
  const book = books.find(b => b.id === bookId);
  const validUserAndBook = book && users[user];
  const available = book?.available;
  const underLimit = users[user]?.borrowed.length < borrowLimit;

  const dueDate = calculateDueDate(maximumDays);

  return !validUserAndBook
    ? "Invalid user or book."
    : !available
    ? "Book is not available."
    : !underLimit
    ? "Borrow limit reached."
    : (() => {
        book.available = false;
        book.dueDate = dueDate;

        users[user].borrowed.push(bookId);
        users[user].history.push({ bookId, borrowedOn: getToday(), dueDate });

        return `Checked out: ${book.title}. Due: ${dueDate}`;
      })();
};

const returnBook = (user, bookId) => {
  const book = books.find(b => b.id === bookId);
  const valid = book && users[user];
  const borrowed = users[user]?.borrowed.includes(bookId);

  return !valid
    ? "Invalid user or book."
    : !borrowed
    ? "Book not borrowed by user."
    : (() => {
        const today = getToday();
        const fine = calculateFine(book.dueDate, today, finePerDay);

        users[user].borrowed = users[user].borrowed.filter(id => id !== bookId);
        users[user].fines += fine;

        book.available = true;
        book.dueDate = null;
        book.reservedBy = null;

        return `Returned: ${book.title}. ${fine > 0 ? `Fine: ₹${fine}` : "No fine."}`;
      })();
};

const searchBooks = (query) => {
  const lower = query.toLowerCase();
  return books.filter(book =>
    book.title.toLowerCase().includes(lower) ||
    book.author.toLowerCase().includes(lower)
  );
};

const reserveBook = (user, bookId) => {
  const book = books.find(b => b.id === bookId);
  const valid = book && users[user];

  return !valid
    ? "Invalid user or book."
    : book.available
    ? "Book is available, no need to reserve."
    : book.reservedBy
    ? "Book already reserved."
    : (() => {
        book.reservedBy = user;
        return `Book "${book.title}" reserved by ${user}.`;
      })();
};

const registerUser = (user) =>
  users[user]
    ? "User already exists."
    : (() => {
        users[user] = { borrowed: [], history: [], fines: 0 };
        return `User ${user} registered.`;
      })();

console.log(registerUser("charlie"));
console.log(listBooks());
console.log(updatedCheckOutBook("charlie", 1));
console.log(returnBook("charlie", 1));
console.log(searchBooks("mockingbird"));
console.log(reserveBook("alice", 3));
