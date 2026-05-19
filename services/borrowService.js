import { BorrowRecord } from "../models/BorrowRecord.js";
import { getMember } from "./memberService.js";
import { calculateDueDate } from "../utils/dateUtils.js";
import { libraryConfig } from "../config/libraryConfig.js";

export function borrowBook(library, memberId, bookId) {
  const member = getMember(library, memberId);
  const book = library.books.find((b) => b.id === bookId);
  if (!book) throw new Error("Book not found");
  if (!book.isAvailable) throw new Error("Book not available");

  const borrowDate = new Date();
  const dueDate = calculateDueDate(borrowDate, libraryConfig.borrowDays);
  const record = new BorrowRecord({ recordId: `R${Date.now()}`, book, member, borrowDate, dueDate });

  book.checkout();
  member.borrowedBooks.push(record);
  library.records.push(record);
  return record;
}

export function returnBook(library, recordId) {
  const record = library.records.find((r) => r.recordId === recordId);
  if (!record) throw new Error("Record not found");
  if (record.returnDate) throw new Error("Book already returned");

  record.returnDate = new Date();
  record.book.checkin();
  return record;
}
