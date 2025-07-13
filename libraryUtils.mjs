 const getToday = () => new Date().toLocaleDateString();

 const calculateDueDate = (days) => {
  const due = new Date();
  due.setDate(due.getDate() + days);
  return due.toLocaleDateString();
};

 const calculateFine = (dueDate, returnDate, finePerDay) => {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const diffInMs = returned - due;
  const overdueDays = Math.max(0, Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));
  return overdueDays * finePerDay;
};

export {getToday,calculateDueDate,calculateFine}