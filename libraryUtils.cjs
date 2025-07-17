const getToday = () => new Date().toLocaleDateString();

const calculateDueDate = (days = 7) => 
  new Date(Date.now() + days * 86400000).toLocaleDateString();

const calculateFine = (dueDate, returnDate, finePerDay = 5) => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const diffInDays = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
  const overdueDays = Math.max(0, diffInDays);
  return overdueDays > 0 ? overdueDays * finePerDay : 0;
};

const checkOutBook = (userName, book, users) => {
  const user = users[userName];
  book.available = false;
  const dueDate = calculateDueDate();

  user.borrowed.push({ 
    title: book.title,
    dueDate 
  });

  return `Book "${book.title}" successfully borrowed by ${userName}. Due date: ${dueDate}`;
};

const checkAvailabilityStatus = (bookTitle, userName, users, books) => {
  const book = books.find(b => b.title === bookTitle);
  
  return !book.available
    ? "Book not available."
    : checkOutBook(userName, book, users);
};

const getReturnMessage = (fine, lateDays) => {
  return fine > 0
    ? `Book returned. Late by ${lateDays} days. Fine: ₹${fine}.`
    : "Book returned on time. No fine.";
};

const returnBook = (userName, bookTitle, users, books, finePerDay) => {
  const user = users[userName];
  const book = books.find(b => b.title === bookTitle);

  book.available = true;
  user.borrowed = user.borrowed.filter(b => b.title !== bookTitle);

  const returnDate = getToday();
  const fine = calculateFine(book.dueDate, returnDate, finePerDay);
  const lateDays = fine / finePerDay;

  return getReturnMessage(fine, lateDays); 
};


module.exports = {
  getToday,
  calculateDueDate,
  calculateFine,
  checkOutBook,
  checkAvailabilityStatus,
  returnBook,
  getReturnMessage
};
