const books = [
  { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", available: true },
  { id: 2, title: "1984", author: "George Orwell", available: true },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", available: false },
  { id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true }
];

const users = {
  alice: { borrowed: [], history: [], fines: 0 },
  charlie: { borrowed: [], history: [], fines: 0 }
};

const borrowLimit = 3;
const maximumDays = 7;
const finePerDay = 5;



const listBooks = () =>
  books
    .filter(book => book.available)
    .map(({ id, title, author }) => `${id}. ${title} by ${author}`);


const updatedCheckOutBook = (user, bookId) => {
  const book = books.find(b => b.id === bookId);
  const validUserAndBook = book && users[user];
  const available = book?.available;
  const underLimit = users[user]?.borrowed.length < borrowLimit;

  const getToday = () => new Date().toLocaleDateString();

  const due = new Date();
        due.setDate(due.getDate() + maximumDays);
        const dueDate = due.toLocaleDateString();

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
        users[user].history.push({
          bookId,
          borrowedOn: getToday(),
          dueDate
        });

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
        const today = new Date();
        const due = new Date(book.dueDate);
        const overdueDays = Math.max(0, Math.ceil((today - due) / (1000 * 60 * 60 * 24)));
        const fine = overdueDays * finePerDay;

        users[user].borrowed = users[user].borrowed.filter(id => id !== bookId);
        users[user].fines += fine;

        book.available = true;
        book.dueDate = null;
        book.reservedBy = null;

        return `Returned: ${book.title}. ${fine > 0 ? `Fine: ₹${fine}` : "No fine."}`;
      })();
};

const searchBooks = () =>  books.filter(book =>book.title.toLowerCase()||book.author.toLowerCase() );


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

const registerUser = user =>
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
