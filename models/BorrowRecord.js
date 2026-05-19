export class BorrowRecord {
  constructor({ recordId, book, member, borrowDate, dueDate }) {
    this.recordId = recordId;
    this.book = book;
    this.member = member;
    this.borrowDate = borrowDate;
    this.dueDate = dueDate;
    this.returnDate = null;
  }
}
